// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const { posts } = require('../../FrontEnd/data');
const auth = require('../middleware/auth');

// Get all posts
router.get('/', (req, res) => {
  res.json(posts);
});

// Toggle like on a post
router.post('/:id/like', auth, (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = req.user.id;

  const post = posts.find((p) => p.id === postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const liked = post.likes.includes(userId);
  if (liked) {
    post.likes = post.likes.filter((id) => id !== userId);
  } else {
    post.likes.push(userId);
  }

  res.json({ likes: post.likes });
});

module.exports = router;
