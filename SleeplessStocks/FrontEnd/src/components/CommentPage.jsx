// src/components/CommentPage.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const CommentPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    console.log('Token:', token);
    console.log('Submitting comment:', { postId, content });
    try {

      const response = await api.post('/api/comments', {
        postId,
        text: content,
        // author: 'CurrentUser', // replace with actual user data
      
    },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
);
        console.log('Comment submitted:', response.data);
      navigate('/blog'); // go back to blog after successful submit
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      borderRadius: '10px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#fff',
    }}>
      <h2 style={{ marginBottom: '1rem', color: '#333' }}>Add a Comment</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment here..."
          rows="5"
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            marginBottom: '1rem',
            resize: 'vertical',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
          required
        />
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <button
          type="submit"
          style={{
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={e => (e.target.style.backgroundColor = '#117acc')}
          onMouseLeave={e => (e.target.style.backgroundColor = '#1890ff')}
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
};

export default CommentPage;
