const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const users = require('../users'); // your user store
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username, id: user.id }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

module.exports = router;
