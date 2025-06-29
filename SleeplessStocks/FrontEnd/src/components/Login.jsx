import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import MountainBackground from './MoutainBackground'; // ✅ NEW

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      window.location.href = '/blog';
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  return (
    <div style={styles.container}>
      <MountainBackground /> {/* ✅ NEW */}

      <div style={styles.card} className="form-fade-in">
        <h2 style={styles.title}>Login to SleepLess Stocks</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
          {error && <p style={styles.error}>{error}</p>}

          <p style={styles.text}>
            Don't have an account?
            <button type="button" onClick={handleSignUpRedirect} style={styles.linkButton}>
              Sign Up
            </button>
          </p>
        </form>
      </div>

      <style>{`
        .form-fade-in {
          animation: fadeInUp 1.2s ease-out forwards;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#1d2b64',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
    maxWidth: '400px',
    width: '90%',
    zIndex: 2,
    textAlign: 'center',
  },
  title: {
    marginBottom: '1.5rem',
    fontSize: '1.8rem',
    color: '#1d2b64',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#1d2b64',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s ease-in-out',
  },
  text: {
    fontSize: '0.9rem',
    color: '#444',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    marginLeft: '0.3rem',
    textDecoration: 'underline',
  },
  error: {
    color: 'red',
    marginTop: '0.5rem',
    fontSize: '0.9rem',
  }
};

export default Login;
