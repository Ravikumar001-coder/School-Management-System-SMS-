import React, { useState } from 'react';

const initialState = {
  name: '',
  email: '',
};

export default function TeacherForm({ onSubmit }) {
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
      <input name="name" value={form.name} onChange={handleChange} placeholder="Teacher name" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Teacher email" required />
      <button type="submit">Add Teacher</button>
    </form>
  );
}
