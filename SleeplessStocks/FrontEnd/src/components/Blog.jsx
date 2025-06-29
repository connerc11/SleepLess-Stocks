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
  const [originalPosts, setOriginalPosts] = useState(posts);
  const [profile, setProfile] = useState(null);
  // Get current user from token
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload.username);
      } catch {
        setCurrentUser('');
      }
    }
  }, []);

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

  // Load favorites from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/profile');
        setProfile(res.data.profile || {});
        setFavorites(res.data.favorites || {});
      } catch {
        // No profile or not logged in
      }
    })();
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

  // Save favorites to backend
  const saveFavorites = async (newFavorites) => {
    try {
      await api.post('/profile', { profile: profile || {}, favorites: newFavorites });
    } catch (err) {
      // Optionally handle error
    }
  };

  // When toggling favorite, keep the order in sync
  const toggleFavorite = (postId) => {
    setFavorites(prev => {
      const updated = { ...prev, [postId]: !prev[postId] };
      saveFavorites(updated);
      return updated;
    });
  };

  const handleComments = (postId) => {
    navigate(`/comments/${postId}`);
  };

  // Refresh comments after edit/delete
  const refreshComments = async () => {
    try {
      const res = await api.get('/api/comments');
      const grouped = {};
      res.data.forEach(comment => {
        if (!grouped[comment.postId]) grouped[comment.postId] = [];
        grouped[comment.postId].push(comment);
      });
      setComments(grouped);
    } catch (err) {
      // handle error
    }
  };

  // Compute the display order: favorites at top, both in original order
  const favoriteIds = Object.keys(favorites).filter(id => favorites[id]);
  const favoritePosts = originalPosts.filter(post => favoriteIds.includes(post.id.toString()));
  const nonFavoritePosts = originalPosts.filter(post => !favoriteIds.includes(post.id.toString()));
  const displayPosts = [...favoritePosts, ...nonFavoritePosts];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-ocean relative overflow-hidden px-4 sm:px-6">
      {/* Animated Waves Background */}
      <div className="absolute inset-0 -z-20 overflow-hidden flex items-center justify-center">
        <div className="wave wave1" />
        <div className="wave wave2" />
        <div className="wave wave3" />
      </div>
      {/* Floating Bubbles */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className={`absolute rounded-full bg-gradient-to-br from-cyan-200 via-blue-300 to-blue-500 opacity-60 blur-2xl animate-bubble${i % 3 + 1}`}
            style={{
              left: `${Math.random() * 100}%`,
              width: `${18 + Math.random() * 36}px`,
              height: `${18 + Math.random() * 36}px`,
              bottom: `-${Math.random() * 100}px`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>
      {/* Main Blog Content */}
      <div style={containerStyle} className="relative z-10 w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 md:p-14 mt-10 mb-10">
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
          <h1 style={{ ...titleStyle, textAlign: 'center', alignSelf: 'center', width: '100%' }}>📝 Conner's Stock Opinions</h1>
        </header>

        {/* Posts */}
        {displayPosts.map((post) => (
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
                {comments[post.id]
                  .filter(comment => !comment.parentId)
                  .map((comment) => (
                    <CommentItem
                      key={comment._id || comment.id}
                      comment={comment}
                      currentUser={currentUser}
                      onCommentUpdated={refreshComments}
                      allComments={comments[post.id]}
                      postId={post.id}
                    />
                  ))}
              </div>
            )}
          </div>
        ))}

        <footer style={{
          width: '100%',
          textAlign: 'center',
          padding: '1.2rem 0 0.7rem 0',
          color: '#888',
          fontSize: '1.05rem',
          fontFamily: 'Poppins, sans-serif',
          letterSpacing: '0.01em',
          background: 'none',
          marginTop: '2rem',
          opacity: 0.85,
        }}>
          Made by Conner Cochrane! This is not financial advice but just my opinion 🙂
        </footer>
      </div>
      {/* Custom Styles for Ocean Theme */}
      <style>{`
        .bg-ocean {
          background: linear-gradient(to bottom, #001f3f, #003366, #005580, #0077b6);
        }
        .wave {
          position: absolute;
          bottom: 0;
          width: 200%;
          height: 100px;
          background: url('https://svgshare.com/i/1VYj.svg') repeat-x;
          background-size: contain;
          opacity: 0.2;
        }
        .wave1 {
          animation: waveMove 20s linear infinite;
          z-index: -3;
        }
        .wave2 {
          animation: waveMove 30s linear infinite reverse;
          bottom: 20px;
          opacity: 0.15;
          z-index: -2;
        }
        .wave3 {
          animation: waveMove 40s linear infinite;
          bottom: 40px;
          opacity: 0.1;
          z-index: -1;
        }
        @keyframes waveMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes bubble1 {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
        }
        @keyframes bubble2 {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          80% { opacity: 0.7; }
          100% { transform: translateY(-120vh) scale(1.4); opacity: 0; }
        }
        @keyframes bubble3 {
          0% { transform: translateY(0) scale(1); opacity: 0.5; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-130vh) scale(1.6); opacity: 0; }
        }
        .animate-bubble1 { animation: bubble1 7s linear infinite; }
        .animate-bubble2 { animation: bubble2 9s linear infinite; }
        .animate-bubble3 { animation: bubble3 11s linear infinite; }
      `}</style>
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