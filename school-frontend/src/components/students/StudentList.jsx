import React from 'react';
import StudentCard from './StudentCard';

export default function StudentList({ students = [], onDelete }) {
  if (!students.length) {
    return <p>No students found.</p>;
  }

  return (
    <section style={{ display: 'grid', gap: '0.75rem' }}>
      {students.map((student) => (
        <StudentCard key={student.id || student.email} student={student} onDelete={onDelete} />
      ))}
    </section>
  );
}
