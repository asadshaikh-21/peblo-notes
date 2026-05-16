const express = require('express')
const {
  createNote, getNotes, getNote, updateNote,
  deleteNote, generateAISummary, shareNote,
  getSharedNote, getInsights,
} = require('../controllers/noteController')
const { protect } = require('../middleware/auth')

const router = express.Router()

// Public route
router.get('/shared/:shareId', getSharedNote)

// Protected routes
router.use(protect)
router.get('/insights', getInsights)
router.route('/').get(getNotes).post(createNote)
router.route('/:id').get(getNote).patch(updateNote).delete(deleteNote)
router.post('/:id/generate-summary', generateAISummary)
router.post('/:id/share', shareNote)

module.exports = router