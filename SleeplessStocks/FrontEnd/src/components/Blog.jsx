// src/components/Blog.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import posts from '../../data';

const Blog = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState({});
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleFavorite = (postId) => {
    setFavorites((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleComments = (postId) => {
     navigate(`/comments/${postId}`);
    alert(`Navigate to comment section for post #${postId}`);
    // You can later implement modal or routing here
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Logout */}
      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
          Logout
        </button>
      </div>

      {/* Blog Posts */}
      <h1>Blog Homepage</h1>
      {posts.map((post) => (
        
        <div key={post.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>{post.ticker}</p>
          <small><strong>By:</strong> {post.author}</small>

          {/* Buttons */}
          <div style={{ marginTop: '1rem' }}>
            {/* Favorite */}
            <button
              onClick={() => toggleFavorite(post.id)}
              style={{
                marginRight: '1rem',
                cursor: 'pointer',
                color: favorites[post.id] ? 'red' : 'gray',
                fontSize: '1.2rem',
                border: 'none',
                background: 'none'
              }}
              title="Favorite"
            >
              {favorites[post.id] ? '❤️' : '🤍'}
            </button>

            {/* Comment */}
            <button
              onClick={() => handleComments(post.id)}
              style={{
                cursor: 'pointer',
                padding: '0.3rem 0.6rem',
                fontSize: '0.9rem'
              }}
            >
              💬 Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blog;
