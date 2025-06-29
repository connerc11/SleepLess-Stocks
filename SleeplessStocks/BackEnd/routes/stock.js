// routes/stock.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

router.get('/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);

    res.json(response.data); // contains c (current), o (open), pc (previous close), etc.
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock price' });
  }
});

module.exports = router;
