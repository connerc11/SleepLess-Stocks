const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

let comments = []; // In-memory comments array

// GET all comments
router.get('/', authenticateToken, (req, res) => {
  res.json(comments);
});

// GET comments by postId
router.get('/:postId', authenticateToken, (req, res) => {
  const { postId } = req.params;
  const filtered = comments.filter(comment => comment.postId == postId);
  res.json(filtered);
});

// POST a new comment (support parentId for replies)
router.post('/', authenticateToken, (req, res) => {
  const { postId, text, parentId } = req.body;

  if (!postId || !text) {
    return res.status(400).json({ error: 'postId and text are required' });
  }

  if (!req.user?.username) {
    return res.status(401).json({ error: 'Unauthorized: No user info' });
  }

  const newComment = {
    id: comments.length + 1,
    postId,
    text,
    author: req.user.username,
    createdAt: new Date(),
    parentId: parentId || null,
  };

  comments.push(newComment);
  res.status(201).json(newComment);
});

// PUT (edit) a comment by ID
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const comment = comments.find(c => c.id == id);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (comment.author !== req.user.username) {
    return res.status(403).json({ error: 'You can only edit your own comments' });
  }

  comment.text = text || comment.text;
  comment.updatedAt = new Date();

  res.json(comment);
});

// DELETE a comment by ID
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const index = comments.findIndex(c => c.id == id);

  if (index === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (comments[index].author !== req.user.username) {
    return res.status(403).json({ error: 'You can only delete your own comments' });
  }

  const deleted = comments.splice(index, 1);
  res.json({ message: 'Comment deleted', deleted });
});

// Like/unlike a comment
router.post('/:id/like', authenticateToken, (req, res) => {
  const { id } = req.params;
  const username = req.user.username;
  const comment = comments.find(c => c.id == id);
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  if (!comment.likes) comment.likes = [];
  if (comment.likes.includes(username)) {
    // Unlike
    comment.likes = comment.likes.filter(u => u !== username);
  } else {
    // Like
    comment.likes.push(username);
  }
  res.json({ likes: comment.likes.length, liked: comment.likes.includes(username) });
});

module.exports = router;