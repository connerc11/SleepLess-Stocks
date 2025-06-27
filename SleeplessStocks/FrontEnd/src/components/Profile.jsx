import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Adjust the import path as necessary

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
  });

  const [stocks, setStocks] = useState([{ ticker: '', priceTarget: '' }]);

  const handleProfileChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleStockChange = (index, field, value) => {
    const updated = [...stocks];
    updated[index][field] = value;
    setStocks(updated);
  };

  const addStock = () => {
    setStocks([...stocks, { ticker: '', priceTarget: '' }]);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token'); // <-- Add this line

  try {
    await api.post('/profile/save', { profile, stocks }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    navigate('/account');
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};


  return (
    <div style={containerStyle}>

        <button
  type="button"
  onClick={() => navigate('/blog')}
  style={{
    marginTop: '1rem',
    padding: '0.6rem 1.2rem',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    alignSelf: 'center',
  }}
>
  ← Back to Blog
</button>
      <h2 style={headerStyle}>👤 Create Your Profile</h2>

    

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={sectionStyle}>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Enter your full name"
            style={inputStyle}
            required
          />
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            placeholder="Enter your email"
            style={inputStyle}
            required
          />
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleProfileChange}
            placeholder="Write a short bio"
            rows="4"
            style={textareaStyle}
          />
        </div>

        <h3 style={{ marginBottom: '0.5rem' }}>📈 Favorite Stocks</h3>
        {stocks.map((stock, index) => (
          <div key={index} style={stockRowStyle}>
            <input
              type="text"
              placeholder="Ticker (e.g. AAPL)"
              value={stock.ticker}
              onChange={(e) => handleStockChange(index, 'ticker', e.target.value)}
              style={stockInputStyle}
              required
            />
            <input
              type="number"
              placeholder="Target Price"
              value={stock.priceTarget}
              onChange={(e) => handleStockChange(index, 'priceTarget', e.target.value)}
              style={stockInputStyle}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addStock} style={addButtonStyle}>+ Add Another Stock</button>

        <button type="submit" style={submitButtonStyle}>💾 Save Profile</button>
      </form>

      
    </div>
  );
};

// 🎨 Styles
const containerStyle = {
  maxWidth: '700px',
  margin: '2rem auto',
  padding: '2rem',
  backgroundColor: '#f9f9f9',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontFamily: "'Segoe UI', sans-serif",
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '2rem',
  fontSize: '1.8rem',
  color: '#333',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
};

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  marginBottom: '0.5rem',
  fontWeight: 'bold',
  color: '#555',
};

const inputStyle = {
  padding: '0.8rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '1rem',
};

const textareaStyle = {
  padding: '0.8rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '1rem',
};

const stockRowStyle = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '1rem',
};

const stockInputStyle = {
  flex: 1,
  padding: '0.6rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
};

const addButtonStyle = {
  padding: '0.6rem 1.2rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  alignSelf: 'flex-start',
  transition: 'background-color 0.3s',
};

const submitButtonStyle = {
  padding: '0.8rem 1.5rem',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  alignSelf: 'center',
  marginTop: '1rem',
};

export default Profile;