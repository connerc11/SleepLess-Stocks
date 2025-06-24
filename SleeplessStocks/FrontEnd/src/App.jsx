import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Blog from './components/Blog';
import CommentPage from './components/CommentPage';


function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Protect Blog route: if no token, redirect to login */}
        <Route
          path="/blog"
          element={token ? <Blog /> : <Navigate to="/login" replace />}
        />
        {/* Redirect root to login or blog based on token */}
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
