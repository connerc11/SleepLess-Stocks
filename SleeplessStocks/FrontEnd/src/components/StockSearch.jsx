import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const containerStyle = {
  maxWidth: '600px',
  margin: '2rem auto',
  padding: '2rem',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  borderRadius: '10px',
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

const StockSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); // Store all searched stocks
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null); // For profile info
  const navigate = useNavigate();

  // Load saved stocks on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/profile');
        setProfile(res.data.profile || {});
        setResults(res.data.stocks || []);
      } catch {
        // No profile or not logged in
      }
    })();
  }, []);

  // Save stocks to backend
  const saveStocks = async (newStocks) => {
    try {
      await api.post('/profile', { profile: profile || {}, stocks: newStocks });
    } catch (err) {
      setError('Failed to save stocks');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    const newResult = { ticker: query.toUpperCase(), priceTarget: (Math.random() * 1000).toFixed(2) };
    const updated = [newResult, ...results];
    setResults(updated);
    setQuery('');
    await saveStocks(updated);
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>🔍 Search for a Stock</h2>
        <button onClick={() => navigate('/blog')} className="btn-outline">← Back to Blog</button>
      </div>
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
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      {results.map((result, idx) => (
        <div key={idx} style={{ background: '#f8f8f8', borderRadius: '10px', padding: '1.5rem', textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1890ff' }}>Symbol: {result.ticker}</div>
          <div style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>Price: <span style={{ color: '#27ae60', fontWeight: 'bold' }}>${result.priceTarget}</span></div>
        </div>
      ))}
    </div>
  );
};

export default StockSearch;
