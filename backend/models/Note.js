const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Untitled Note',
    trim: true,
  },
  content: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  category: {
    type: String,
    default: 'General',
    trim: true,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  shareId: {
    type: String,
    unique: true,
    sparse: true,
  },
  aiSummary: {
    type: String,
    default: null,
  },
  aiActionItems: [{
    type: String,
  }],
  aiSuggestedTitle: {
    type: String,
    default: null,
  },
  aiGeneratedAt: {
    type: Date,
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true })

// Index for search
noteSchema.index({ title: 'text', content: 'text', tags: 'text' })

module.exports = mongoose.model('Note', noteSchema)