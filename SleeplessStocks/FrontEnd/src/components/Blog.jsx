// src/components/Blog.jsx
import React from 'react';
import Post from './Post';

// Sample post data — in a real app this might be fetched from the backend
const samplePosts = [
  { id: 1, title: 'Tech Stocks Rally', content: 'The market saw a major rally today...' },
  { id: 2, title: 'Economic Update', content: 'Recent changes in GDP growth indicate...' },
];

export default function Blog({ currentUser }) {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Stock Market Blog</h1>
      {samplePosts.map(post => (
        <div key={post.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '2rem' }}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <Post postId={post.id} currentUser={currentUser} />
        </div>
      ))}
    </div>
  );
}
