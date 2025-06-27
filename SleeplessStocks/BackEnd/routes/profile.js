const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const profilesPath = path.join(__dirname, '../models/userProfiles.json');

// Save or update a user profile
router.post('/save', authenticateToken, (req, res) => {
  const { profile, stocks } = req.body;
  const username = req.user?.username;

  if (!username) {
    return res.status(401).json({ error: 'Unauthorized: Missing user info' });
  }

  const data = fs.existsSync(profilesPath) ? JSON.parse(fs.readFileSync(profilesPath)) : {};
  data[username] = { profile, stocks };
  fs.writeFileSync(profilesPath, JSON.stringify(data, null, 2));

  res.json({ message: 'Profile saved' });
});

// Get user profile
router.get('/', authenticateToken, (req, res) => {
  const username = req.user?.username;

  if (!username) {
    return res.status(401).json({ error: 'Unauthorized: Missing user info' });
  }

  const data = fs.existsSync(profilesPath) ? JSON.parse(fs.readFileSync(profilesPath)) : {};
  res.json(data[username] || {});
});

module.exports = router;
