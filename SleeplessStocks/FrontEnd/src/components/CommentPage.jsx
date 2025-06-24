import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const CommentPage = () => {
  const { postId } = useParams();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token to get username
      const base64Url = token.split('.')[1];
      const decoded = JSON.parse(atob(base64Url));
      setCurrentUser(decoded.username);
    }

    api.get(`/comments/${postId}`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/comments/${postId}`, { content: comment });
      setComments([...comments, res.data]);
      setComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${postId}/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete comment');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Comments for Post #{postId}</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          rows="4"
          cols="50"
          required
        />
        <br />
        <button type="submit">Submit Comment</button>
      </form>

      <div style={{ marginTop: '2rem' }}>
        <h3>Previous Comments</h3>
        {comments.map(c => (
          <div key={c.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
            <p><strong>{c.user}</strong>: {c.content}</p>
            {currentUser === c.user && (
              <button onClick={() => handleDelete(c.id)} style={{ color: 'red' }}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentPage;
