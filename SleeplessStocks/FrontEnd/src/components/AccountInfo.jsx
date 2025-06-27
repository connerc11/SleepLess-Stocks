import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Make sure this file handles auth token headers

const AccountInfo = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setData(response.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading profile...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  if (!data) return <p style={{ textAlign: 'center' }}>No profile data saved yet.</p>;

  const { profile, stocks } = data;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>Account Information</h2>
      
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Bio:</strong> {profile.bio}</p>

      <h3 style={{ marginTop: '2rem' }}>Favorite Stocks</h3>
      {stocks.length > 0 ? (
        <ul>
          {stocks.map((stock, idx) => (
            <li key={idx}>
              <strong>{stock.ticker}</strong> → Target: ${stock.priceTarget}
            </li>
          ))}
        </ul>
      ) : (
        <p>No favorite stocks added.</p>
      )}

      <button
        onClick={() => navigate('/profile')}
        style={{
          marginTop: '2rem',
          padding: '0.6rem 1.2rem',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Edit Profile
      </button>
    </div>
  );
};

export default AccountInfo;
