const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  email: String,
  bio: String,
  brokerage: String,
  favorites: { type: Object, default: {} },
  stocks: [
    {
      ticker: String,
      priceTarget: String
    }
  ]
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);