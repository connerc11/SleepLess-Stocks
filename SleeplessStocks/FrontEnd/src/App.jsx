import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Blog from './components/Blog';
import SignUp from './components/SignUp';
import ProfileView from './components/ProfileView';
import ProfileEdit from './components/ProfileEdit';
import CommentPage from './components/CommentPage';
import AccountInfo from './components/ProfileView';
import StockSearch from './components/StockSearch';
import StockWatchlist from './components/StockWatchlist';

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

        <Route
          path="/profile/edit"
          element={token ? <ProfileEdit /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/profile"
          element={token ? <ProfileView /> : <Navigate to="/login" replace />}
        />

        {/* <Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/account" element={<AccountInfo />} />
        </Route> */}

        <Route
          path="/"
          element={token ? <Navigate to="/blog" replace /> : <Navigate to="/login" replace />}
        />

        <Route path="/comments/:postId" element={<CommentPage />} />
        <Route path="/stock-search" element={<StockSearch />} />
        <Route path="/watchlist" element={<StockWatchlist />} />
      </Routes>
    </Router>
  );
}

export default App;