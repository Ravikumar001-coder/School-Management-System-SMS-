import React from 'react';

export default function TeacherList({ teachers = [], onDelete }) {
  if (!teachers.length) {
    return <p>No teachers found.</p>;
  }

  return (
    <section style={{ display: 'grid', gap: '0.75rem' }}>
      {teachers.map((teacher) => (
        <article key={teacher.id || teacher.email} style={{ background: '#fff', borderRadius: '8px', padding: '0.75rem' }}>
          <h4 style={{ margin: 0 }}>{teacher.name}</h4>
          <p style={{ margin: '0.35rem 0' }}>Email: {teacher.email}</p>
          {onDelete && (
            <button type="button" onClick={() => onDelete(teacher.id)}>
              Delete
            </button>
          )}
        </article>
      ))}
    </section>
  );
}
