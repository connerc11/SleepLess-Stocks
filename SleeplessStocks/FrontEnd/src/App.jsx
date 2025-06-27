import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Blog from './components/Blog';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import CommentPage from './components/CommentPage';
import AccountInfo from './components/AccountInfo';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protect Blog route: if no token, redirect to login */}
        <Route
          path="/blog"
          element={token ? <Blog setToken={setToken} /> : <Navigate to="/login" replace />}
        />

        <Route path="/signup" element={<SignUp />} />

        <Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/account" element={<AccountInfo />} />
        </Route>

        <Route
          path="/"
          element={token ? <Navigate to="/blog" replace /> : <Navigate to="/login" replace />}
        />

        <Route path="/comments/:postId" element={<CommentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
