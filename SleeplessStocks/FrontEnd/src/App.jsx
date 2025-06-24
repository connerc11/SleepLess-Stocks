import React, { useState } from 'react';
import Login from './components/Login';
import Post from './components/Post';

function App() {
  const [user, setUser] = useState(localStorage.getItem('username'));

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div>
      <h1>Welcome, {user}</h1>
      <button onClick={() => {
        localStorage.clear();
        setUser(null);
      }}>Logout</button>
      <Post postId={1} currentUser={user} />
    </div>
  );
}

export default App;
