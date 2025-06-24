import React, { useState } from 'react';
import { login } from '../api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      onLogin(data.username);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: 'auto', marginTop: 50 }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
required
/><br />
<input
placeholder="Password"
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
required
/><br />
<button type="submit">Login</button>
</form>
);
}

