const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

let comments = [];
let nextId = 1;

// Get comments for a post
router.get('/:postId', (req, res) => {
  const postId = req.params.postId;
  const postComments = comments.filter(c => String(c.postId) === String(postId));
  res.json(postComments);
});

// Create comment (auth required)
router.post('/', authenticateToken, (req, res) => {
  const { postId, text } = req.body;
  if (!postId || !text) return res.status(400).json({ error: 'postId and text are required' });

  const newComment = {
    id: nextId++,
    postId,
    text,
    author: req.user.username,
    date: new Date(),
  };
  comments.push(newComment);
  res.status(201).json(newComment);
});

// Update comment (only author)
router.put('/:id', authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  const comment = comments.find(c => c.id === id);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  if (comment.author !== req.user.username) return res.status(403).json({ error: 'Unauthorized' });

  comment.text = text;
  comment.date = new Date();
  res.json(comment);
});

// Delete comment (only author)
router.delete('/:id', authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  const commentIndex = comments.findIndex(c => c.id === id);
  if (commentIndex === -1) return res.status(404).json({ error: 'Comment not found' });

  if (comments[commentIndex].author !== req.user.username) return res.status(403).json({ error: 'Unauthorized' });

  comments.splice(commentIndex, 1);
  res.status(204).end();
});

module.exports = router;
