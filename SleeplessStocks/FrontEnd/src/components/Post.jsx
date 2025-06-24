// frontend/src/components/Post.jsx
import React, { useState } from 'react';
import CommentItem from './CommentItem';

function Post({ post, onLike, onAddComment }) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  return (
    <div className="border rounded p-4 shadow space-y-2">
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p>{post.content}</p>

      <button onClick={onLike} className="text-red-500 hover:scale-110 transition">
        ❤️ {post.likes.length}
      </button>

      <div className="mt-2">
        <form onSubmit={handleSubmit}>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="border p-1 mr-2"
            placeholder="Write a comment..."
          />
          <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">
            Comment
          </button>
        </form>

        <div className="mt-2 space-y-1">
          {post.comments.map((c, i) => (
            <CommentItem key={i} comment={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Post;
