// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Mock user store — replace with your real DB in production
const users = [
  { id: 1, username: 'user1', password: 'pass1' },
  { id: 2, username: 'user2', password: 'pass2' },
];

router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user by username and password
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create JWT payload including username and id
  const token = jwt.sign(
    { username: user.username, id: user.id },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Send back the token
  res.json({ token });
});

module.exports = router;
