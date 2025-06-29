import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ProfileView = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/profile');
        setData(res.data);
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

  const { profile, stocks } = data;

  return (
    <div style={viewContainer}>
      <h2 style={viewTitle}>👤 Profile Info</h2>

      <div style={viewInfo}>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Bio:</strong> {profile.bio}</p>
        <p><strong>Brokerage:</strong> {profile.brokerage}</p>
      </div>

      <h3 style={viewHeader}>📈 Favorite Stocks</h3>
      <ul>
        {stocks.map((s,i) => (
          <li key={i} style={viewStock}>
            <span>{s.ticker}</span>
            <span style={viewTarget}>🎯 ${s.priceTarget}</span>
          </li>
        ))}
      </ul>

      <div style={viewBtns}>
        <button onClick={() => navigate('/profile/edit')} style={viewEdit}>✏️ Edit</button>
        <button onClick={() => navigate('/blog')} style={viewBlog}>🏠 Blog</button>
      </div>
    </div>
  );
};

export default ProfileView;

// Styles
const viewContainer = { maxWidth: '950px', margin: '2.5rem auto', padding: '2.5rem', background: '#fff', borderRadius: '18px', boxShadow: '0 8px 32px rgba(0,0,0,0.13)', fontFamily: 'Segoe UI, sans-serif' };
const viewTitle = { fontSize: '1.8rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' };
const viewInfo = { marginTop: '1rem', lineHeight: '1.6' };
const viewHeader = { marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' };
const viewStock = { display: 'flex', justifyContent: 'space-between', background: '#f1f5ff', padding: '0.6rem', borderRadius: '6px', marginBottom: '0.5rem' };
const viewTarget = { color: '#2c7be5', fontWeight: '600' };
const viewBtns = { marginTop: '2rem', display: 'flex', gap: '1rem' };
const viewEdit = { background: '#007bff', color: '#fff', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const viewBlog = { background: '#28a745', color: '#fff', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '6px', cursor: 'pointer' };
