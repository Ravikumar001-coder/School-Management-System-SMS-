import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { teacherApi } from '../../api/teacherApi';

const inputCls = `w-full border border-gray-300 rounded-lg px-3
                  py-2.5 text-sm focus:outline-none
                  focus:ring-2 focus:ring-green-500`;

const EditTeacherPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    teacherApi.getById(id)
      .then(res => {
        const t = res.data?.data || res.data;
        setForm({
          firstName: t.firstName || '',
          lastName: t.lastName || '',
          email: t.email || '',
          phone: t.phone || '',
          qualification: t.qualification || '',
          specialization: t.specialization || '',
          dateOfBirth: t.dateOfBirth || '',
          joiningDate: t.joiningDate || '',
          gender: t.gender || '',
          address: t.address || '',
          salary: t.salary ?? ''
        });
      })
      .catch(err => {
        toast.showToast(err.response?.data?.message || 'Failed to load teacher details.', 'error');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await teacherApi.update(id, {
        ...form,
        salary: form.salary === '' ? null : Number(form.salary)
      });
      toast.showToast('Teacher updated successfully!', 'success');
      setTimeout(() => navigate(`/admin/teachers/${id}`), 1200);
    } catch (err) {
      toast.showToast(err.response?.data?.message || 'Update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <><LoadingSpinner /></>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Teacher</h1>
        <button
          onClick={() => navigate(`/admin/teachers/${id}`)}
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'firstName', label: 'First Name', type: 'text' },
            { name: 'lastName', label: 'Last Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'qualification', label: 'Qualification', type: 'text' },
            { name: 'specialization', label: 'Specialization', type: 'text' },
            { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
            { name: 'joiningDate', label: 'Joining Date', type: 'date' },
            { name: 'gender', label: 'Gender', type: 'text' },
            { name: 'address', label: 'Address', type: 'text' },
            { name: 'salary', label: 'Salary', type: 'number' }
          ].map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {f.label}
              </label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name] || ''}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-8 py-2.5 rounded-lg text-sm hover:bg-green-700 disabled:opacity-60 font-medium"
          >
            {saving ? 'Saving...' : 'Update Teacher'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/teachers/${id}`)}
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default EditTeacherPage;
