const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://peblo-notes-986o.onrender.com/'
  ],
  credentials: true
}))
app.use(express.json({ limit: '10kb' }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' },
})
app.use('/api', limiter)

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'))
app.use('/api/v1/notes', require('./routes/noteRoutes'))

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Peblo Notes API running!',
    endpoints: {
      auth: '/api/v1/auth',
      notes: '/api/v1/notes',
    },
  })
})

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})