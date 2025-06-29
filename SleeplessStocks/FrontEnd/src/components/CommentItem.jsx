// frontend/src/components/CommentItem.jsx
import React from 'react';

function CommentItem({ comment }) {
  return (
    <div className="bg-gray-100 p-2 rounded text-sm" style={{ marginBottom: '0.5rem' }}>
      <span style={{ fontWeight: 'bold', color: '#333' }}>
        {comment.author ? comment.author : 'Unknown Author'}:
      </span>{' '}
      <span>"{comment.text}"</span>
    </div>
  );
}

export default CommentItem;
