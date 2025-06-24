const API_URL = 'http://localhost:4000';

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function fetchComments(postId) {
  const res = await fetch(`${API_URL}/comments/${postId}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export async function createComment(postId, text) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ postId, text }),
  });
  if (!res.ok) throw new Error('Failed to create comment');
  return res.json();
}

export async function updateComment(id, text) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/comments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to update comment');
  return res.json();
}

export async function deleteComment(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/comments/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete comment');
  return res;
}
