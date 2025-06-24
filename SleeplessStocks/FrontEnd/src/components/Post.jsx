
import React, { useEffect, useState } from 'react';
import { fetchComments, createComment } from '../api';
import CommentItem from './CommentItem';

export default function Post({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetchComments(postId).then(setComments);
  }, [postId]);

  const handleComment = async () => {
    if (!text) return;
    const newComment = await createComment(postId, text);
    setComments([...comments, newComment]);
    setText('');
  };

  return (
    <div style={{ margin: '2em 0' }}>
      <h3>Post {postId}</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment"
      /><br />
      <button onClick={handleComment}>Comment</button>
      <div>
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
}
