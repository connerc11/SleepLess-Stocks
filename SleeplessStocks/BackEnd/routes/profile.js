const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const UserProfile = require('../models/UserProfile');

// Save or update profile
router.post('/', authenticateToken, async (req, res) => {
  const username = req.user.username;
  const { profile, stocks, favorites, searchWatchlist } = req.body; // renamed
  try {
    const updated = await UserProfile.findOneAndUpdate(
      { username },
      {
        username,
        name: profile?.name || '',
        email: profile?.email || '',
        bio: profile?.bio || '',
        brokerage: profile?.brokerage || '',
        favorites: favorites || {},
        stocks: stocks || [],
        searchWatchlist: searchWatchlist || [], // renamed
      },
      { upsert: true, new: true }
    );
    return res.status(201).json({ message: 'Profile saved', profile: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Get profile
router.get('/', authenticateToken, async (req, res) => {
  const username = req.user.username;
  try {
    const profile = await UserProfile.findOne({ username });
    if (!profile) {
      return res.status(404).json({ error: 'No profile found' });
    }
    return res.json({ profile });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;