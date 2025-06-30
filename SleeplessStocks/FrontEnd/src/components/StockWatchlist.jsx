import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const recommended = ['AAPL', 'TSLA', 'AMZN', 'SOFI', 'UPST', 'HOOD', 'HIMS', 'COF'];

const containerStyle = {
  maxWidth: '950px',
  margin: '2.5rem auto',
  padding: '2.5rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
  borderRadius: '18px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: '#fff',
};
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
};
const titleStyle = {
  color: '#333',
  fontSize: '2rem',
  fontWeight: 'bold',
};

const StockWatchlist = () => {
  const [query, setQuery] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // Load watchlist from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/profile');
        setProfile(res.data.profile || {});
        setWatchlist(res.data.stocks || []);
      } catch {
        // No profile or not logged in
      }
    })();
  }, []);

  // Save watchlist to backend
  const saveWatchlist = async (newList) => {
    try {
      await api.post('/profile', { profile: profile || {}, stocks: newList });
    } catch (err) {
      setError('Failed to save watchlist');
    }
  };

  const handleAdd = (ticker) => {
    if (watchlist.some(s => s.ticker === ticker.toUpperCase())) return;
    const newStock = { ticker: ticker.toUpperCase(), price: (Math.random() * 1000).toFixed(2) };
    const updated = [newStock, ...watchlist];
    setWatchlist(updated);
    setQuery('');
    saveWatchlist(updated);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    handleAdd(query);
  };

  const handleRemove = (ticker) => {
    const updated = watchlist.filter(s => s.ticker !== ticker);
    setWatchlist(updated);
    saveWatchlist(updated);
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          {profile && profile.name ? `${profile.name}'s Watchlist` : '📈 Stock Watchlist'}
        </h2>
        <button onClick={() => navigate('/blog')} className="btn-outline">← Back to Blog</button>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '0.5rem', color: '#555' }}>Recommended tickers:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {recommended.map(ticker => (
            <button
              key={ticker}
              className="btn-sm"
              style={{ background: '#f1f5ff', color: '#1890ff', border: '1px solid #1890ff' }}
              onClick={() => handleAdd(ticker)}
            >
              {ticker}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Add stock by ticker (e.g. MSFT)"
            style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
            required
          />
          <button type="submit" className="btn-outline" style={{ fontWeight: 'bold' }}>Add</button>
        </form>
      </div>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <div>
        {watchlist.length === 0 && <div style={{ color: '#888', textAlign: 'center' }}>No stocks in your watchlist yet.</div>}
        {watchlist.map((stock, idx) => (
          <div key={idx} style={{ background: '#f8f8f8', borderRadius: '10px', padding: '1.2rem', textAlign: 'center', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1890ff' }}>{stock.ticker}</div>
              <div style={{ fontSize: '1rem', marginTop: '0.3rem' }}>Price: <span style={{ color: '#27ae60', fontWeight: 'bold' }}>${stock.price}</span></div>
            </div>
            <button onClick={() => handleRemove(stock.ticker)} className="btn-danger" style={{ marginLeft: '1rem' }}>Remove</button>
          </div>
        ))}
      </div>
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
        Made by Conner Cochrane!  🙂
      </footer>
    </div>
  );
};

export default StockWatchlist;