import React, { useState } from 'react';

const initialState = {
  name: '',
  email: '',
};

export default function StudentForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit?.(form);
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Student name" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Student email" required />
      <button type="submit">Add Student</button>
    </form>
  );
}
