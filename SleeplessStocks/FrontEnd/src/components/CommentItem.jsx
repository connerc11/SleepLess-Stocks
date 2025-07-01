// frontend/src/components/CommentItem.jsx
import React, { useState } from 'react';
import { updateComment, deleteComment, likeComment } from '../api';

function CommentItem({ comment, currentUser, onCommentUpdated, allComments, postId }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [error, setError] = useState('');
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [likes, setLikes] = useState(comment.likes ? comment.likes.length : 0);
  const [liked, setLiked] = useState(comment.likes ? (comment.likes.includes && currentUser ? comment.likes.includes(currentUser) : false) : false);
  const isAuthor = currentUser && comment.author === currentUser;

  const handleEdit = async () => {
    setError('');
    try {
      await updateComment(comment.id || comment._id, editText);
      setEditing(false);
      onCommentUpdated && onCommentUpdated();
    } catch {
      setError('Failed to update comment');
    }
  };

  const handleDelete = async () => {
    setError('');
    try {
      await deleteComment(comment.id || comment._id);
      onCommentUpdated && onCommentUpdated();
    } catch {
      setError('Failed to delete comment');
    }
  };

  const handleReply = async () => {
    setError('');
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ postId, text: replyText, parentId: comment.id || comment._id }),
      });
      setReplying(false);
      setReplyText('');
      onCommentUpdated && onCommentUpdated();
    } catch {
      setError('Failed to post reply');
    }
  };

  const handleLike = async () => {
    try {
      const res = await likeComment(comment.id || comment._id);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
      onCommentUpdated && onCommentUpdated();
    } catch {
      // Optionally handle error
    }
  };

  // Find replies to this comment
  const replies = allComments
    ? allComments.filter(c => (c.parentId === comment.id || c.parentId === comment._id))
    : [];

  return (
    <div
      className="bg-gray-100 p-2 rounded text-sm"
      style={{
        marginBottom: '0.5rem',
        marginLeft: comment.parentId ? 32 : 0,
        borderLeft: comment.parentId ? '3px solid #b5e0b7' : 'none',
        background: comment.parentId ? '#f6fff8' : '#f0f4ff',
        boxShadow: comment.parentId ? '0 1px 4px rgba(34,197,94,0.07)' : '0 2px 8px rgba(24,144,255,0.04)',
        padding: comment.parentId ? '0.7rem 1rem 0.7rem 1.2rem' : '1rem',
        transition: 'background 0.2s',
      }}
    >
      <span style={{ fontWeight: 'bold', color: '#1890ff', fontSize: '1.05em' }}>
        {comment.author ? comment.author : 'Unknown Author'}
      </span>
      {editing ? (
        <>
          <input
            value={editText}
            onChange={e => setEditText(e.target.value)}
            style={{ marginLeft: 8, marginRight: 8, padding: '2px 6px', borderRadius: 4, border: '1px solid #bbb', fontSize: '0.95em' }}
          />
          <button onClick={handleEdit} style={{ marginRight: 6, color: '#1890ff', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Save</button>
          <button onClick={() => { setEditing(false); setEditText(comment.text); }} style={{ color: '#888', border: 'none', background: 'none', cursor: 'pointer' }}>Cancel</button>
        </>
      ) : (
        <span style={{ marginLeft: 8, color: '#222', fontSize: '1.01em' }}>&ldquo;{comment.text}&rdquo;</span>
      )}
      {isAuthor && !editing && (
        <>
          <button onClick={() => setEditing(true)} style={{ marginLeft: 10, color: '#1890ff', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
          <button onClick={handleDelete} style={{ marginLeft: 4, color: '#ff4d4f', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
        </>
      )}
      {!editing && (
        <button onClick={() => setReplying(r => !r)} style={{ marginLeft: 10, color: '#52c41a', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Reply</button>
      )}
      {replying && (
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            style={{ padding: '2px 6px', borderRadius: 4, border: '1px solid #bbb', fontSize: '0.95em', width: '70%' }}
          />
          <button onClick={handleReply} style={{ color: '#52c41a', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Send</button>
          <button onClick={() => { setReplying(false); setReplyText(''); }} style={{ color: '#888', border: 'none', background: 'none', cursor: 'pointer' }}>Cancel</button>
        </div>
      )}
      <button onClick={handleLike} style={{ marginLeft: 10, color: liked ? '#ff5e5e' : '#aaa', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1.1em', verticalAlign: 'middle' }}>
        {liked ? '❤️' : '🤍'} Like
      </button>
      <span style={{ marginLeft: 4, color: '#888', fontWeight: 600 }}>{likes}</span>
      {error && <div style={{ color: 'red', fontSize: '0.9em', marginTop: 2 }}>{error}</div>}
      {/* Render replies recursively */}
      {replies.length > 0 && replies.map(reply => (
        <CommentItem
          key={reply._id || reply.id}
          comment={reply}
          currentUser={currentUser}
          onCommentUpdated={onCommentUpdated}
          allComments={allComments}
          postId={postId}
        />
      ))}
    </div>
  );
}

export default CommentItem;