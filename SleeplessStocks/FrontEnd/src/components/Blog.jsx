import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import posts from '../../data';
import api, { fetchStockQuote } from '../api';
import CommentItem from './CommentItem';

const Blog = ({ setToken }) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState({});
  const [comments, setComments] = useState({});
  const [stockQuotes, setStockQuotes] = useState({});

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

  useEffect(() => {
    // Fetch stock prices for all unique tickers
    const fetchAllQuotes = async () => {
      const tickers = Array.from(new Set(posts.map(post => post.ticker)));
      const quotes = {};
      await Promise.all(
        tickers.map(async (ticker) => {
          try {
            const res = await fetchStockQuote(ticker);
            quotes[ticker] = res.data;
          } catch {
            quotes[ticker] = null;
          }
        })
      );
      setStockQuotes(quotes);
    };
    fetchAllQuotes();
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
      <header style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '1rem',
        marginBottom: '2.5rem',
        boxSizing: 'border-box',
      }}>
        <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', alignSelf: 'flex-end', marginRight: '1rem' }}>
          <button onClick={() => navigate('/stock-search')} className="btn-outline" style={headerBtnStyle}>
            🔍 Stock Search
          </button>
          <button onClick={() => navigate('/watchlist')} className="btn-outline" style={headerBtnStyle}>
            ⭐ Stock Watchlist
          </button>
          <button onClick={goToProfile} style={headerBtnStyle} className="btn-outline">👤 Profile</button>
          <button onClick={handleLogout} style={{ ...headerBtnStyle, background: '#ff4d4f', color: '#fff' }} className="btn-outline">🚪 Logout</button>
        </nav>
        <h1 style={{ ...titleStyle, textAlign: 'center', alignSelf: 'center', width: '100%' }}>📝 Creative Blog Dashboard</h1>
      </header>

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
          {stockQuotes[post.ticker] && (
            <div style={{ fontSize: '1rem', margin: '0.5rem 0', color: '#1890ff' }}>
              Open: <span style={{ color: '#faad14', fontWeight: 'bold' }}>${stockQuotes[post.ticker].o}</span> | 
              Current/Close: <span style={{ color: '#27ae60', fontWeight: 'bold' }}>${stockQuotes[post.ticker].c}</span>
            </div>
          )}
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

const titleStyle = {
  fontSize: '2.4rem',
  color: '#2c3e50',
  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
};

const headerBtnStyle = {
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
  fontSize: '1rem',
  minWidth: '150px',
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