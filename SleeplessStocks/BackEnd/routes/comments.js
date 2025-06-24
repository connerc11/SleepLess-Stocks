// backend/routes/comments.js
const express = require('express');
const router = express.Router();
const { posts } = require('../data');
const auth = require('../middleware/auth');

// Add comment to post
router.post('/:postId', auth, (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  const post = posts.find((p) => p.id === parseInt(postId));
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const newComment = {
    userId: req.user.id,
    text,
    date: new Date(),
  };

  post.comments.push(newComment);
  res.status(201).json(newComment);
});

module.exports = router;
