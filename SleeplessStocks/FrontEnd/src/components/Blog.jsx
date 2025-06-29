import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import posts from '../../data';
import api from '../api';
import CommentItem from './CommentItem';

const Blog = ({ setToken }) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get('/api/comments');
        const grouped = {};
        res.data.forEach(comment => {
          if (!grouped[comment.postId]) grouped[comment.postId] = [];
          grouped[comment.postId].push(comment);
        });
        setComments(grouped);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };
    fetchComments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  const goToProfile = async () => {
    try {
      const res = await api.get('/profile');
      navigate(res.data.profile ? '/profile' : '/profile/edit');
    } catch {
      navigate('/profile/edit');
    }
  };

  const toggleFavorite = (postId) => {
    setFavorites(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleComments = (postId) => {
    navigate(`/comments/${postId}`);
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>📝 Creative Blog Dashboard</h1>
        <div>
          <button onClick={() => navigate('/stock-search')} className="btn-outline" style={{ marginRight: '0.5rem' }}>
            🔍 Stock Search
          </button>
          <button onClick={goToProfile} style={glassButton}>👤 Profile</button>
          <button onClick={handleLogout} style={logoutButton}>🚪 Logout</button>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div
          key={post.id}
          style={cardStyle}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.01)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <h2 style={postTitle}>{post.title}</h2>
          <p style={postContent}>{post.content}</p>
          <p style={postTicker}>Ticker: {post.ticker}</p>
          <p style={postAuthor}>By <strong>{post.author}</strong></p>

          <div style={buttonRow}>
            <button
              onClick={() => toggleFavorite(post.id)}
              style={{
                ...favoriteButton,
                color: favorites[post.id] ? '#ff5e5e' : '#ccc',
              }}
              aria-label="Toggle Favorite"
            >
              {favorites[post.id] ? '❤️' : '🤍'}
            </button>

            <button
              onClick={() => handleComments(post.id)}
              style={commentButton}
              aria-label="Go to Comments"
            >
              💬 Comment
            </button>
          </div>

          {/* Comments */}
          {comments[post.id] && comments[post.id].length > 0 && (
            <div style={commentSection}>
              <h4 style={commentHeader}>Comments:</h4>
              {comments[post.id].map((comment) => (
                <CommentItem key={comment._id || comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Blog;

const containerStyle = {
  maxWidth: '1000px',
  margin: '2rem auto',
  padding: '2rem',
  fontFamily: 'Poppins, sans-serif',
  background: 'linear-gradient(to right, #f9f9f9, #eaf1f8)',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2.5rem',
};

const titleStyle = {
  fontSize: '2.4rem',
  color: '#2c3e50',
  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
};

const glassButton = {
  padding: '0.6rem 1.2rem',
  marginRight: '0.5rem',
  border: 'none',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  color: '#2c3e50',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
};

const logoutButton = {
  ...glassButton,
  background: '#ff4d4f',
  color: '#fff',
};

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(6px)',
  borderRadius: '15px',
  padding: '2rem',
  marginBottom: '2rem',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease',
};

const postTitle = {
  color: '#34495e',
  fontSize: '1.8rem',
  marginBottom: '0.5rem',
};

const postContent = {
  color: '#555',
  lineHeight: '1.6',
};

const postTicker = {
  fontStyle: 'italic',
  color: '#888',
  marginTop: '0.5rem',
};

const postAuthor = {
  color: '#999',
  fontSize: '0.9rem',
};

const buttonRow = {
  marginTop: '1rem',
  display: 'flex',
  alignItems: 'center',
};

const favoriteButton = {
  fontSize: '1.5rem',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  transition: 'color 0.3s ease',
  marginRight: '1rem',
};

const commentButton = {
  background: '#1890ff',
  color: 'white',
  padding: '0.5rem 1.2rem',
  fontWeight: '600',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background 0.3s ease',
};

const commentSection = {
  marginTop: '1.5rem',
  backgroundColor: '#f8f8f8',
  borderRadius: '10px',
  padding: '1rem',
};

const commentHeader = {
  marginBottom: '0.5rem',
  color: '#666',
};
