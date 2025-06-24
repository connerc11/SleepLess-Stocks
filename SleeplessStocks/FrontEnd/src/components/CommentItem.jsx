import React, { useState } from 'react';
import { deleteComment, updateComment } from '../api';

export default function CommentItem({ comment, currentUser }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.text);

  const handleDelete = async () => {
    await deleteComment(comment.id);
    window.location.reload();
  };

  const handleUpdate = async () => {
    const updated = await updateComment(comment.id, text);
    setEditing(false);
  };

  return (
    <div>
      <p><strong>{comment.author}</strong>: {editing ? (
        <>
          <input value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={handleUpdate}>Save</button>
        </>
      ) : comment.text}</p>
      {currentUser === comment.author && (
        <>
          <button onClick={() => setEditing(!editing)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
}
