// frontend/src/App.jsx
import React, { useEffect, useState } from 'react';
import api from './api';
import Blog from './components/Blog';
import Login from './components/Login';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
  };

  return (
    <div className="p-4">
      {authenticated ? (
        <>
          <button onClick={handleLogout} className="float-right bg-red-500 text-white px-2 py-1 rounded">
            Logout
          </button>
          <h1 className="text-2xl font-bold mb-4">My Stock Blog</h1>
          <Blog />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
