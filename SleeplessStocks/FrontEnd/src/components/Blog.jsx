// frontend/src/components/Blog.jsx
import React, { useEffect, useState } from 'react';
import Post from './Post';
import api from '../api';

function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch all posts on component mount
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts'); // Example route
        setPosts(response.data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };

    fetchPosts();
  }, []);

  // Handle like toggling
  const toggleLike = async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  // Add a comment to a post
  const addComment = async (postId, commentText) => {
    try {
      const response = await api.post(`/comments/${postId}`, {
        text: commentText,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, response.data] }
            : post
        )
      );
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Stock Blog</h1>
      {posts.length === 0 ? (
        <p>Loading posts...</p>
      ) : (
        posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onLike={() => toggleLike(post.id)}
            onAddComment={(text) => addComment(post.id, text)}
          />
        ))
      )}
    </div>
  );
}

export default Blog;
