const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Post', // reference to Post model if you have one
  },
  author: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: { // optional, to track when comment was made
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
