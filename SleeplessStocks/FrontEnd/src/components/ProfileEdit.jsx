import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: '', email: '', bio: '', brokerage: '' });
  const [stocks, setStocks] = useState([{ ticker: '', priceTarget: '' }]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const res = await api.get('/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.profile) {
          setProfile({
            name: res.data.profile.name || '',
            email: res.data.profile.email || '',
            bio: res.data.profile.bio || '',
            brokerage: res.data.profile.brokerage || ''
          });
        }
        if (res.data && Array.isArray(res.data.stocks) && res.data.stocks.length > 0) {
          setStocks(res.data.stocks.map(s => ({
            ticker: s.ticker || '',
            priceTarget: s.priceTarget || ''
          })));
        }
      } catch (err) {
        // If unauthorized, redirect to login
        if (err?.response?.status === 401) {
          navigate('/login');
        }
      }
    })();
  }, [navigate]);

  const handleChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handleStock = (idx, field, val) => {
    const updated = [...stocks];
    updated[idx][field] = val;
    setStocks(updated);
  };
  const addStock = () => setStocks([...stocks, { ticker: '', priceTarget: '' }]);

  const handleSubmit = async e => {
    e.preventDefault();
    // Email must contain '@'
    if (!profile.email.includes('@')) {
      setError('Email must contain an "@" symbol.');
      return;
    }
    // All price targets must be valid numbers
    for (let s of stocks) {
      if (isNaN(Number(s.priceTarget)) || s.priceTarget === '') {
        setError('All price targets must be valid numbers.');
        return;
      }
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await api.post('/profile', { profile, stocks }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/profile');
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/login');
        return;
      }
      console.error(err);
      setError('Failed to save profile');
    }
  };

  return (
    <div style={editContainer}>
      <h2 style={editTitle}>Edit Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={editForm}>
        <input name="name" placeholder="Name" value={profile.name} onChange={handleChange} required style={input} />
        <input name="email" placeholder="Email" value={profile.email} onChange={handleChange} required style={input} />
        <input name="brokerage" placeholder="brokerage" value={profile.brokerage} onChange={handleChange} required style={input} />

        <textarea name="bio" placeholder="Bio" value={profile.bio} onChange={handleChange} rows={3} style={input} />

        <h3>Favorite Stocks 📈</h3>
        {stocks.map((s,i) => (
          <div key={i} style={{ ...stockRow, alignItems: 'center' }}>
            <input placeholder="Ticker" value={s.ticker} onChange={e => handleStock(i,'ticker',e.target.value)} required style={{...input,flex:1}} />
            <input placeholder="Price Target" value={s.priceTarget} onChange={e => handleStock(i,'priceTarget',e.target.value)} required style={{...input,flex:1}} />
            <button
              type="button"
              onClick={() => {
                setStocks(stocks.filter((_, idx) => idx !== i));
              }}
              style={{ marginLeft: 12, background: '#ff5e5e', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 0.8rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center' }}
              aria-label="Remove favorite stock"
            >
              🗑️ Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addStock} style={addBtn}>+ Add Stock</button>
        <button type="submit" style={saveBtn}>💾 Save Profile</button>
      </form>

      <button onClick={() => navigate('/blog')} style={backBtn}>← Back to Blog</button>
    </div>
  );
};

export default ProfileEdit;

// Styles
const editContainer = { maxWidth: '950px', margin: '2.5rem auto', padding: '2.5rem', background: '#fdfdfd', borderRadius: '18px', boxShadow: '0 8px 32px rgba(0,0,0,0.13)', fontFamily: 'Segoe UI, sans-serif' };
const editTitle = { fontSize: '1.8rem', marginBottom: '1rem' };
const editForm = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const input = { padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem' };
const stockRow = { display: 'flex', gap: '1rem' };
const addBtn = { background: '#3498db', color: '#fff', padding: '0.5rem', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const saveBtn = { background: '#28a745', color: '#fff', padding: '0.7rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const backBtn = { marginTop: '1.5rem', background: '#6c757d', padding: '0.5rem', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' };