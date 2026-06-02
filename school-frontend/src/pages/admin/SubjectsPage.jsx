import React, { useEffect, useMemo, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import { subjectApi } from '../../api/subjectApi';
import { classApi } from '../../api/classApi';
import { teacherApi } from '../../api/teacherApi';
import axios from '../../api/axios';

const initialForm = {
  name: '',
  code: '',
  department: 'Science',
  classRoomId: '',
  assignedTeacherId: '',
  subjectType: 'THEORY',
  totalMarks: 100,
  passingMarks: 33,
  description: '',
};

const SubjectAvatar = ({ name }) => {
  const initials = (name || 'S')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('');

  return (
    <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center justify-center">
      {initials || 'S'}
    </div>
  );
};

const SubjectsPage = () => {
  const toast = useToast();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subjectRes, classRes, teacherRes, deptRes] = await Promise.all([
        subjectApi.getAll(),
        classApi.getAll(),
        teacherApi.getAll(0, 500),
        axios.get('/departments')
      ]);

      setSubjects(subjectRes.data?.data || []);
      setClasses(classRes.data?.data || []);
      setTeachers(teacherRes.data?.data?.content || []);
      setDepartments(deptRes.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load subjects data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const rows = useMemo(() => subjects, [subjects]);

  const departmentOptions = useMemo(
    () => ['ALL', ...departments.map(d => d.name)],
    [departments]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesSearch = !q ||
        String(r.id).includes(q) ||
        (r.name || '').toLowerCase().includes(q) ||
        (r.code || '').toLowerCase().includes(q) ||
        (r.assignedTeacherName || '').toLowerCase().includes(q) ||
        (r.classLabel || '').toLowerCase().includes(q);

      const matchesDepartment = departmentFilter === 'ALL' || r.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [rows, search, departmentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || '',
      code: row.code || '',
      department: row.department || 'Science',
      classRoomId: row.classRoomId ? String(row.classRoomId) : '',
      assignedTeacherId: row.assignedTeacherId ? String(row.assignedTeacherId) : '',
      subjectType: row.subjectType || 'THEORY',
      totalMarks: row.totalMarks ?? 100,
      passingMarks: row.passingMarks ?? 33,
      description: row.description || '',
    });
    setFormOpen(true);
  };

  const openView = (row) => {
    setViewing(row);
    setViewOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim(),
        department: form.department,
        classRoomId: form.classRoomId ? Number(form.classRoomId) : null,
        assignedTeacherId: form.assignedTeacherId ? Number(form.assignedTeacherId) : null,
        subjectType: form.subjectType,
        totalMarks: Number(form.totalMarks),
        passingMarks: Number(form.passingMarks),
        description: form.description.trim(),
      };

      if (!payload.name) {
        throw new Error('Subject name is required.');
      }
      if (payload.passingMarks > payload.totalMarks) {
        throw new Error('Passing marks cannot be greater than total marks.');
      }

      if (editing?.id) {
        await subjectApi.update(editing.id, payload);
        toast.success('Subject updated successfully.');
      } else {
        await subjectApi.create(payload);
        toast.success('Subject created successfully.');
      }

      setFormOpen(false);
      setEditing(null);
      setForm(initialForm);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save subject.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await subjectApi.delete(deleteId);
      setDeleteId(null);
      toast.success('Subject deleted successfully.');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete subject.');
    }
  };

  return (
    <>
      <div className="mb-2 text-sm text-gray-500">Home &gt; Academic &gt; Subjects</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Subjects Page</h1>


      <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-4 mb-5">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative w-full md:w-[320px]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full border border-gray-300 rounded-lg pl-3 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
          </div>

          <div className="flex gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departmentOptions.map((d) => (
                <option key={d} value={d}>{d === 'ALL' ? 'Department/Grade' : d}</option>
              ))}
            </select>

            <button
              onClick={openCreate}
              className="bg-[#1E40AF] text-white px-6 py-3 rounded-[16px] text-sm font-bold hover:bg-[#1E3A8A] shadow-md min-h-[44px]"
            >
              Add Subject
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] overflow-hidden">
        {loading ? (
          <div className="p-8 text-sm text-gray-500">Loading subjects...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[980px]">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    {['ID', 'Subject Name', 'Subject Code', 'Department', 'Grade/Class', 'Assigned Teacher', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((row, idx) => (
                    <tr key={row.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{121 + (page - 1) * pageSize + idx}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{row.name}</td>
                      <td className="px-4 py-3 text-gray-700">{row.code || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{row.department}</td>
                      <td className="px-4 py-3 text-gray-700">{row.classLabel || 'Not Assigned'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <SubjectAvatar name={row.assignedTeacherName || 'Not Assigned'} />
                          <span className="text-gray-800">{row.assignedTeacherName || 'Not Assigned'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 text-sm">
                          <button onClick={() => openView(row)} className="text-blue-700 hover:text-blue-900">View</button>
                          <button onClick={() => openEdit(row)} className="text-green-700 hover:text-green-900">Edit</button>
                          <button onClick={() => setDeleteId(row.id)} className="text-red-700 hover:text-red-900">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-500">No subjects found.</div>
            )}

            <div className="flex justify-end items-center gap-1 p-3 border-t bg-gray-50">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="w-9 h-9 rounded border text-gray-600 disabled:opacity-50"
              >
                «
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded border text-gray-600 disabled:opacity-50"
              >
                ‹
              </button>
              <span className="w-9 h-9 rounded bg-blue-700 text-white flex items-center justify-center text-sm font-semibold">
                {page}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded border text-gray-600 disabled:opacity-50"
              >
                ›
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="w-9 h-9 rounded border text-gray-600 disabled:opacity-50"
              >
                »
              </button>
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Subject' : 'Add Subject'}
      >
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
            <input
              name="code"
              value={form.code}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              name="department"
              value={form.department}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="">Select Department</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade/Class</label>
            <select
              name="classRoomId"
              value={form.classRoomId}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="">Not Assigned</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Teacher</label>
            <select
              name="assignedTeacherId"
              value={form.assignedTeacherId}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="">Not Assigned</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Type</label>
            <select
              name="subjectType"
              value={form.subjectType}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="THEORY">THEORY</option>
              <option value="PRACTICAL">PRACTICAL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
            <input
              type="number"
              min="1"
              name="totalMarks"
              value={form.totalMarks}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks</label>
            <input
              type="number"
              min="1"
              name="passingMarks"
              value={form.passingMarks}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm disabled:opacity-60"
            >
              {saving ? 'Saving...' : editing ? 'Update Subject' : 'Create Subject'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Subject Details"
        size="sm"
      >
        {viewing && (
          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-semibold">Name:</span> {viewing.name}</p>
            <p><span className="font-semibold">Code:</span> {viewing.code || '-'}</p>
            <p><span className="font-semibold">Type:</span> {viewing.subjectType || '-'}</p>
            <p><span className="font-semibold">Department:</span> {viewing.department}</p>
            <p><span className="font-semibold">Grade/Class:</span> {viewing.classLabel || 'Not Assigned'}</p>
            <p><span className="font-semibold">Assigned Teacher:</span> {viewing.assignedTeacherName || 'Not Assigned'}</p>
            <p><span className="font-semibold">Marks:</span> {viewing.passingMarks || '-'} / {viewing.totalMarks || '-'}</p>
            <p><span className="font-semibold">Description:</span> {viewing.description || '-'}</p>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Subject?"
        message="This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
};

export default SubjectsPage;
