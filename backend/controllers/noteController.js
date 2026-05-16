const { v4: uuidv4 } = require('uuid')
const Note = require('../models/Note')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Create note
const createNote = async (req, res) => {
  try {
    const { title, content, tags, category } = req.body
    const note = await Note.create({
      title: title || 'Untitled Note',
      content: content || '',
      tags: tags || [],
      category: category || 'General',
      user: req.user._id,
    })
    res.status(201).json({ success: true, note })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
    console.log(error);
  }
}

// Get all notes
const getNotes = async (req, res) => {
  try {
    const { search, tag, sort, archived } = req.query
    let filter = { user: req.user._id }

    if (archived === 'true') filter.isArchived = true
    else filter.isArchived = false

    if (tag) filter.tags = { $in: [tag.toLowerCase()] }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ]
    }

    const sortOption = sort === 'oldest' ? { createdAt: 1 } : { updatedAt: -1 }
    const notes = await Note.find(filter).sort(sortOption)

    res.status(200).json({ success: true, count: notes.length, notes })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get single note
const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id })
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' })
    res.status(200).json({ success: true, note })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update note
const updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    )
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' })
    res.status(200).json({ success: true, note })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Delete note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' })
    res.status(200).json({ success: true, message: 'Note deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Generate AI summary
const generateAISummary = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id })
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' })

    if (!note.content || note.content.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Note content too short for AI analysis' })
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const prompt = `Analyze this note and provide:
1. A concise summary (2-3 sentences)
2. Key action items (max 5 bullet points)
3. A suggested title (max 8 words)

Note content:
"${note.content}"

Respond in this exact JSON format:
{
  "summary": "...",
  "action_items": ["item1", "item2"],
  "suggested_title": "..."
}`

      const result = await model.generateContent(prompt)
      const text = result.response.text()
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)

      note.aiSummary = parsed.summary
      note.aiActionItems = parsed.action_items
      note.aiSuggestedTitle = parsed.suggested_title
      note.aiGeneratedAt = new Date()
      await note.save()

      res.status(200).json({
        success: true,
        ai: {
          summary: note.aiSummary,
          action_items: note.aiActionItems,
          suggested_title: note.aiSuggestedTitle,
          generated_at: note.aiGeneratedAt,
        },
      })
    } catch (aiError) {
      // Fallback if AI fails
      const wordCount = note.content.split(' ').length
      note.aiSummary = `This note contains ${wordCount} words covering: ${note.title}`
      note.aiActionItems = ['Review note content', 'Add more details']
      note.aiSuggestedTitle = note.title
      note.aiGeneratedAt = new Date()
      await note.save()

      res.status(200).json({
        success: true,
        fallback: true,
        ai: {
          summary: note.aiSummary,
          action_items: note.aiActionItems,
          suggested_title: note.aiSuggestedTitle,
        },
      })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Generate share link
const shareNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id })
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' })

    if (!note.shareId) {
      note.shareId = uuidv4()
      note.isPublic = true
      await note.save()
    }

    res.status(200).json({
      success: true,
      shareId: note.shareId,
      shareUrl: `${req.protocol}://${req.get('host')}/api/v1/notes/shared/${note.shareId}`,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get shared note (public)
const getSharedNote = async (req, res) => {
  try {
    const note = await Note.findOne({ shareId: req.params.shareId, isPublic: true })
      .populate('user', 'name')
    if (!note) return res.status(404).json({ success: false, message: 'Shared note not found' })
    res.status(200).json({ success: true, note })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get dashboard insights
const getInsights = async (req, res) => {
  try {
    const userId = req.user._id

    const totalNotes = await Note.countDocuments({ user: userId, isArchived: false })
    const archivedNotes = await Note.countDocuments({ user: userId, isArchived: true })
    const aiUsed = await Note.countDocuments({ user: userId, aiSummary: { $ne: null } })

    const recentNotes = await Note.find({ user: userId, isArchived: false })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title updatedAt tags')

    // Most used tags
    const allNotes = await Note.find({ user: userId })
    const tagCount = {}
    allNotes.forEach(note => {
      note.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    })
    const topTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }))

    // Weekly activity
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weeklyNotes = await Note.countDocuments({
      user: userId,
      createdAt: { $gte: weekAgo },
    })

    res.status(200).json({
      success: true,
      insights: {
        totalNotes,
        archivedNotes,
        aiUsed,
        weeklyNotes,
        recentNotes,
        topTags,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  createNote, getNotes, getNote, updateNote,
  deleteNote, generateAISummary, shareNote,
  getSharedNote, getInsights,
}