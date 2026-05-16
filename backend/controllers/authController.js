const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const User = require('../models/User')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() })

    const { name, email, password } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists' })

    const user = await User.create({ name, email, password })
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
    console.log(error
    );
  }
}

const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() })

    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const token = generateToken(user._id)
    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user })
}

module.exports = { register, login, getMe }