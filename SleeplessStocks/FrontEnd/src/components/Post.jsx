import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../API_CONFIG';
import './Post.css'; // Optional: styling

const Post = ({ id, title, content, ticker }) => {
  const [liked, setLiked] = useState(false);
  const [price, setPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ticker) return;

    const fetchPrice = async () => {
      try {
        const res = await fetch(`https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${API_CONFIG.FMP_API_KEY}`);
        const data = await res.json();
        if (data && data.length > 0) {
          setPrice(data[0].price);
        }
      } catch (err) {
        console.error('Failed to fetch stock price:', err);
      }
    };

    fetchPrice();
  }, [ticker]);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleComment = () => {
    navigate(`/comments/${id}`);
  };

  return (
    <div className="post-card">
      <h2>{title}</h2>
      <p>{content}</p>

      {ticker && (
        <p style={{ fontWeight: 'bold', color: '#2a9d8f' }}>
          {ticker} Price: {price ? `$${price.toFixed(2)}` : 'Loading...'}
        </p>
      )}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={handleLike} style={{ fontSize: '1.2rem' }}>
          {liked ? '💖' : '🤍'} Like
        </button>
        <button onClick={handleComment}>💬 Comment</button>
      </div>
    </div>
  );
};

export default Post;
