const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

let userProfiles = {}; // in-memory

router.post('/', authenticateToken, (req, res) => {
  const username = req.user.username;
  const { profile, stocks, favorites, searchedStocks } = req.body;
  userProfiles[username] = {
    profile,
    stocks: stocks || (userProfiles[username] && userProfiles[username].stocks) || [],
    favorites: favorites || (userProfiles[username] && userProfiles[username].favorites) || {},
    searchedStocks: searchedStocks || (userProfiles[username] && userProfiles[username].searchedStocks) || [],
  };
  return res.status(201).json({ message: 'Profile saved' });
});

router.get('/', authenticateToken, (req, res) => {
  const username = req.user.username;
  const data = userProfiles[username];
  if (!data) {
    return res.status(404).json({ error: 'No profile found' });
  }
  return res.json(data);
});

module.exports = router;
