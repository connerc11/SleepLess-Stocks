import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { fetchStockQuote } from '../api';

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

const StockSearch = () => {
  const [query, setQuery] = useState('');
  const [searchWatchlist, setSearchWatchlist] = useState([]);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  // Load saved stocks and watchlist on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/profile');
        setProfile(res.data.profile || {});
        setSearchWatchlist(res.data.profile?.searchWatchlist || []);
        setWatchlist(res.data.profile?.stocks || []);
      } catch {
        // No profile or not logged in
      }
    })();
  }, []);

  // Save stocks to backend
  const saveSearchWatchlist = async (newStocks) => {
    try {
      await api.post('/profile', { profile: profile || {}, searchWatchlist: newStocks, stocks: watchlist });
    } catch (err) {
      setError('Failed to save stocks');
    }
  };

  // Save watchlist to backend
  const saveWatchlist = async (newList) => {
    try {
      await api.post('/profile', { profile: profile || {}, stocks: newList, searchWatchlist });
    } catch (err) {
      setError('Failed to save watchlist');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    if (!profile || !profile.name || !profile.email) {
      setError('Please create a profile to search for a stock.');
      return;
    }
    try {
      const res = await fetchStockQuote(query);
      if (res.data.o === 0 && res.data.c === 0) {
        setError('This stock does not exist. Try again.');
        return;
      }
      const newStock = {
        ticker: query.toUpperCase(),
        open: res.data.o,
        close: res.data.c,
      };
      const updated = [newStock, ...searchWatchlist.filter(s => s.ticker !== newStock.ticker)];
      setSearchWatchlist(updated);
      setQuery('');
      await saveSearchWatchlist(updated);
    } catch (err) {
      setError('Failed to fetch stock data');
    }
  };

  // Add to watchlist from search result
  const handleAddToWatchlist = async (stock) => {
    if (watchlist.some(s => s.ticker === stock.ticker)) {
       setError(`Ticker ${stock.ticker} is already on your watchlist!`);
       return
    }
      
    const newStock = { ticker: stock.ticker, price: stock.close };
    const updated = [newStock, ...watchlist];
    setWatchlist(updated);
    await saveWatchlist(updated);
  };

  return (
    <div style={containerStyle}>
      <header style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '1rem',
        marginBottom: '2rem',
        paddingLeft: '1rem',
        boxSizing: 'border-box',
        justifyContent: 'space-between',
      }}>
        <h2 style={{ ...titleStyle, textAlign: 'left', alignSelf: 'center', margin: 0 }}>
          🔍 Search for a Stock
        </h2>
        <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: 0 }}>
          <button onClick={() => navigate('/blog')} style={headerBtnStyle} className="btn-outline">← Back to Blog</button>
          <button onClick={() => navigate('/watchlist')} style={headerBtnStyle} className="btn-outline">⭐ Watchlist</button>
          <button onClick={() => navigate('/profile')} style={headerBtnStyle} className="btn-outline">👤 Profile</button>
        </nav>
      </header>
      <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter stock symbol (e.g. AAPL)"
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            marginBottom: '1rem',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
          required
        />
        <button type="submit" className="btn-outline w-full" style={{ fontWeight: 'bold', fontSize: '1rem' }}>Search</button>
      </form>
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
          <div style={{ color: '#b36b00', marginTop: '0.5rem', fontWeight: 500 }}>
            
          </div>
        </div>
      )}
      {searchWatchlist.map((stock, idx) => {
        const inWatchlist = watchlist.some(s => s.ticker === stock.ticker);
        return (
          <div key={idx} style={{ background: '#f8f8f8', borderRadius: '10px', padding: '1.5rem', textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1890ff' }}>Symbol: {stock.ticker}</div>
            <div style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>Open: <span style={{ color: '#faad14', fontWeight: 'bold' }}>${stock.open}</span></div>
            <div style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>Current/Close: <span style={{ color: '#27ae60', fontWeight: 'bold' }}>${stock.close}</span></div>
            <button
              className="btn-outline"
              style={{ marginTop: '1rem', fontWeight: 'bold', fontSize: '1rem', opacity: inWatchlist ? 0.5 : 1, cursor: inWatchlist ? 'not-allowed' : 'pointer' }}
              onClick={() => handleAddToWatchlist(stock)}
              disabled={inWatchlist}
            >
              {inWatchlist ? 'Added to Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        );
      })}
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

export default StockSearch;