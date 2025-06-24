const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

// In-memory comment store (replace with DB in production)
let comments = [
  // Example: { id: 1, postId: '101', user: 'alice', content: 'Great post!' }
];

// Get comments for a post
router.get('/:postId', authenticateToken, (req, res) => {
  const { postId } = req.params;
  const postComments = comments.filter(c => c.postId === postId);
  res.json(postComments);
});

// Create a comment
router.post('/:postId', authenticateToken, (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Comment content is required.' });
  }

  const newComment = {
    id: Date.now().toString(),
    postId,
    user: req.user.username,
    content,
  };
  comments.push(newComment);
  res.status(201).json(newComment);
});

// Delete a comment
router.delete('/:postId/:commentId', authenticateToken, (req, res) => {
  const { postId, commentId } = req.params;
  comments = comments.filter(c => !(c.postId === postId && c.id === commentId));
  res.json({ message: 'Comment deleted' });
});

// Delete a comment only if the user is the author
router.delete('/:postId/:commentId', authenticateToken, (req, res) => {
  const { postId, commentId } = req.params;
  const comment = comments.find(
    (c) => c.postId === postId && c.id === commentId
  );

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (comment.user !== req.user.username) {
    return res.status(403).json({ error: 'Not authorized to delete this comment' });
  }

  comments = comments.filter(
    (c) => !(c.postId === postId && c.id === commentId)
  );

  res.json({ message: 'Comment deleted' });
});


module.exports = router;
