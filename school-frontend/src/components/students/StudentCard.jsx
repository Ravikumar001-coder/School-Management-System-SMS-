import React from 'react';

export default function StudentCard({ student, onDelete }) {
  return (
    <article style={{ background: '#fff', borderRadius: '8px', padding: '0.75rem' }}>
      <h4 style={{ margin: 0 }}>{student.name}</h4>
      <p style={{ margin: '0.35rem 0' }}>Email: {student.email}</p>
      {onDelete && (
        <button type="button" onClick={() => onDelete(student.id)}>
          Delete
        </button>
      )}
    </article>
  );
}
