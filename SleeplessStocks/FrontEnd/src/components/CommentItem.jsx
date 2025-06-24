// frontend/src/components/CommentItem.jsx
import React from 'react';

function CommentItem({ comment }) {
  return (
    <div className="bg-gray-100 p-2 rounded text-sm">
      {comment.text}
    </div>
  );
}

export default CommentItem;
