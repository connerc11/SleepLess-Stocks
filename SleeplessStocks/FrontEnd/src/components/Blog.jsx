import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import posts from '../../data'; // Ensure this path is correct

const Blog = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState({});

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const toggleFavorite = (postId) => {
    setFavorites((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleComments = (postId) => {
    navigate(`/comments/${postId}`);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#333' }}>Blog Homepage</h1>
        <div>
          <button onClick={goToProfile} style={headerButtonStyle}>Profile</button>
          <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
        </div>
      </div>

      {/* Blog Posts */}
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            borderRadius: '10px',
            padding: '1.5rem',
            marginBottom: '2rem',
            background: '#fff',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <h2 style={{ color: '#1a1a1a' }}>{post.title}</h2>
          <p style={{ color: '#555', lineHeight: '1.5' }}>{post.content}</p>
          <p style={{ fontWeight: '600', color: '#777' }}>{post.ticker}</p>
          <small style={{ color: '#999' }}>
            <strong>By:</strong> {post.author}
          </small>

          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => toggleFavorite(post.id)}
              style={{
                marginRight: '1rem',
                cursor: 'pointer',
                color: favorites[post.id] ? '#ff4d4f' : '#bbb',
                fontSize: '1.6rem',
                border: 'none',
                background: 'none',
                transition: 'color 0.3s ease',
              }}
              title={favorites[post.id] ? 'Unfavorite' : 'Favorite'}
              aria-label="Toggle Favorite"
            >
              {favorites[post.id] ? '❤️' : '🤍'}
            </button>

            <button
              onClick={() => handleComments(post.id)}
              style={{
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                borderRadius: '6px',
                border: '1px solid #1890ff',
                color: '#1890ff',
                background: 'white',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = '#1890ff';
                e.target.style.color = 'white';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#1890ff';
              }}
              aria-label="Go to Comments"
            >
              💬 Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Styles
const headerButtonStyle = {
  padding: '0.5rem 1rem',
  marginLeft: '0.5rem',
  backgroundColor: '#333',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const logoutButtonStyle = {
  ...headerButtonStyle,
  backgroundColor: '#ff4d4f',
};

export default Blog;
