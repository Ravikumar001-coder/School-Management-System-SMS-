import React, { useEffect, useState } from 'react';
import { createTeacherApi, deleteTeacherApi, getTeachersApi } from '../../api/teacherApi';
import TeacherForm from '../../components/teachers/TeacherForm';
import TeacherList from '../../components/teachers/TeacherList';
import Loading from '../../components/common/Loading';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const data = await getTeachersApi();
      setTeachers(Array.isArray(data) ? data : data.items || []);
    } catch (_) {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleCreate = async (payload) => {
    await createTeacherApi(payload);
    await loadTeachers();
  };

  const handleDelete = async (id) => {
    if (!id) {
      return;
    }
    await deleteTeacherApi(id);
    await loadTeachers();
  };

  return (
    <section>
      <h2>Teachers</h2>
      <TeacherForm onSubmit={handleCreate} />
      {loading ? <Loading /> : <TeacherList teachers={teachers} onDelete={handleDelete} />}
    </section>
  );
}
