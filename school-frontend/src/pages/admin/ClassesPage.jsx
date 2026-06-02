import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import { classApi } from '../../api/classApi';
import { teacherApi } from '../../api/teacherApi';
import { subjectApi } from '../../api/subjectApi';
import { getCurrentAcademicYear } from '../../utils/helpers';

const initialForm = {
  id: null,
  name: '',
  section: '',
  academicYear: getCurrentAcademicYear(),
  classTeacherId: '',
  subjectIds: [],
  maxCapacity: 40,
  classFee: 0,
  admissionFee: 0,
};

const formatInr = (value) => `INR ${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('ALL');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const pageSize = 8;

  const { showToast } = useToast();

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [classRes, teacherRes, subjectRes] = await Promise.all([
        classApi.getAll(),
        teacherApi.getAll(0, 200),
        subjectApi.getAll(),
      ]);

      setClasses(classRes.data?.data || []);
      setTeachers(teacherRes.data?.data?.content || []);
      setSubjects(subjectRes.data?.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load classes.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const gradeOptions = useMemo(() => {
    const vals = [...new Set(classes.map((c) => c.name))];
    return ['ALL', ...vals];
  }, [classes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return classes.filter((c) => {
      const gradeMatch = grade === 'ALL' || c.name === grade;
      const searchMatch = !q ||
        String(c.id).includes(q) ||
        `${c.name} ${c.section}`.toLowerCase().includes(q) ||
        (c.classTeacherName || '').toLowerCase().includes(q) ||
        (c.subjectNames || []).join(' ').toLowerCase().includes(q);
      return gradeMatch && searchMatch;
    });
  }, [classes, grade, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const stats = useMemo(() => {
    const totalClasses = classes.length;
    const totalStudents = classes.reduce((sum, c) => sum + Number(c.studentCount || 0), 0);
    const avgClassFee = totalClasses
      ? Math.round(classes.reduce((sum, c) => sum + Number(c.classFee || 0), 0) / totalClasses)
      : 0;
    return { totalClasses, totalStudents, avgClassFee };
  }, [classes]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const openCreate = () => {
    setForm(initialForm);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name || '',
      section: item.section || '',
      academicYear: item.academicYear || getCurrentAcademicYear(),
      classTeacherId: item.classTeacherId || '',
      subjectIds: item.subjectIds || [],
      maxCapacity: item.maxCapacity || 40,
      classFee: item.classFee ?? 0,
      admissionFee: item.admissionFee ?? 0,
    });
    setShowForm(true);
  };

  const onFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubjectChange = (e) => {
    const values = Array.from(e.target.selectedOptions).map((opt) => Number(opt.value));
    setForm((prev) => ({ ...prev, subjectIds: values }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        section: form.section.trim(),
        academicYear: form.academicYear.trim(),
        classTeacherId: form.classTeacherId ? Number(form.classTeacherId) : null,
        subjectIds: form.subjectIds,
        maxCapacity: Number(form.maxCapacity) || 40,
        classFee: Number(form.classFee),
        admissionFee: Number(form.admissionFee),
      };

      if (!payload.name || !payload.section || !payload.academicYear) {
        throw new Error('Class name, section and academic year are required.');
      }

      if (!Number.isFinite(payload.classFee) || payload.classFee < 0) {
        throw new Error('Class fee must be a valid non-negative number.');
      }

      if (!Number.isFinite(payload.admissionFee) || payload.admissionFee < 0) {
        throw new Error('Admission fee must be a valid non-negative number.');
      }

      if (form.id) {
        await classApi.update(form.id, payload);
        showToast('Class updated successfully.', 'success');
      } else {
        await classApi.create(payload);
        showToast('Class created successfully.', 'success');
      }

      setShowForm(false);
      setForm(initialForm);
      await loadAll();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to save class.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await classApi.delete(deleteId);
      setDeleteId(null);
      showToast('Class deleted successfully.', 'success');
      await loadAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete class.', 'error');
    }
  };

  return (
    <>
      <div className="mb-2 text-sm text-gray-500">Home &gt; Academic &gt; Classes</div>
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-slate-100 via-blue-100 to-cyan-100 p-5 shadow-sm border border-blue-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Classes Management</h1>
            <p className="text-sm text-slate-700 mt-1">Manage classes, teachers, subjects and fee slabs in one place.</p>
          </div>
          <button
            onClick={openCreate}
            className="bg-[#1E40AF] text-white px-6 py-3 rounded-[16px] text-sm font-bold shadow-md hover:bg-[#1E3A8A] min-h-[44px]"
          >
            Add New Class
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 p-4">
          <p className="text-sm text-gray-700">Total Classes</p>
          <p className="text-4xl font-bold text-slate-900 mt-1">{stats.totalClasses}</p>
          <p className="text-xs text-gray-600 mt-2">Configured in system</p>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-indigo-100 p-4">
          <p className="text-sm text-gray-700">Students Enrolled</p>
          <p className="text-4xl font-bold text-slate-900 mt-1">{stats.totalStudents}</p>
          <p className="text-xs text-gray-600 mt-2">Across all sections</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-emerald-100 p-4">
          <p className="text-sm text-gray-700">Average Class Fee</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{formatInr(stats.avgClassFee)}</p>
          <p className="text-xs text-gray-600 mt-2">Monthly tuition average</p>
        </div>
      </div>

      <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative w-full sm:w-72">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by class, teacher or subject"
            className="w-full border border-gray-300 rounded-lg pl-3 pr-9 py-2.5 text-sm"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
        </div>

        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
        >
          {gradeOptions.map((g) => (
            <option key={g} value={g}>{g === 'ALL' ? 'All Grades' : g}</option>
          ))}
        </select>

        <button
          onClick={() => {
            setSearch('');
            setGrade('ALL');
          }}
          className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200"
        >
          Clear Filters
        </button>

        <span className="ml-auto text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full">
          Showing {filtered.length} class{filtered.length === 1 ? '' : 'es'}
        </span>
      </div>

      <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] overflow-hidden border border-[#f1f5f9]">
        {loading ? (
          <div className="p-8 text-sm text-gray-500">Loading classes...</div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['ID', 'Class Name', 'Section', 'Class Fee', 'Admission Fee', 'Teacher', 'Subjects', 'No. Students', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-gray-600 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-800">{item.section}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatInr(item.classFee)}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatInr(item.admissionFee)}</td>
                    <td className="px-4 py-3">{item.classTeacherName || 'Not Assigned'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(item.subjectNames || []).length > 0 ? (item.subjectNames || []).map((s) => (
                          <span key={s} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{s}</span>
                        )) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">{item.studentCount || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 text-xs">
                        <button onClick={() => setViewItem(item)} className="text-blue-700 hover:underline">View</button>
                        <button onClick={() => openEdit(item)} className="text-green-700 hover:underline">Edit</button>
                        <button onClick={() => setDeleteId(item.id)} className="text-red-700 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-500">No classes found.</div>
            )}

            <div className="flex items-center justify-end gap-2 p-3 border-t bg-gray-50">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
              >
                &lt;
              </button>
              <span className="text-sm text-gray-600">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </>
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={form.id ? 'Edit Class' : 'Add Class'}>
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 text-xs uppercase tracking-wide font-semibold text-gray-500 border-b pb-1">Basic Information</div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Name *</label>
            <input name="name" value={form.name} onChange={onFormChange} className="w-full border rounded-lg px-3 py-2.5 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
            <input name="section" value={form.section} onChange={onFormChange} className="w-full border rounded-lg px-3 py-2.5 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
            <input name="academicYear" value={form.academicYear} onChange={onFormChange} className="w-full border rounded-lg px-3 py-2.5 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Teacher</label>
            <select
              name="classTeacherId"
              value={form.classTeacherId}
              onChange={onFormChange}
              className="w-full border rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="">Not Assigned</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 text-xs uppercase tracking-wide font-semibold text-gray-500 border-b pb-1 mt-1">Curriculum</div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
            <select
              multiple
              value={form.subjectIds.map(String)}
              onChange={onSubjectChange}
              className="w-full border rounded-lg px-3 py-2.5 text-sm h-28"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple subjects.</p>
          </div>

          <div className="md:col-span-2 text-xs uppercase tracking-wide font-semibold text-gray-500 border-b pb-1 mt-1">Capacity & Fees</div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
            <input
              type="number"
              min="1"
              name="maxCapacity"
              value={form.maxCapacity}
              onChange={onFormChange}
              className="w-full border rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Fee *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="classFee"
              value={form.classFee}
              onChange={onFormChange}
              className="w-full border rounded-lg px-3 py-2.5 text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Charged monthly.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admission Fee *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="admissionFee"
              value={form.admissionFee}
              onChange={onFormChange}
              className="w-full border rounded-lg px-3 py-2.5 text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Charged one time per student.</p>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-2">
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm disabled:opacity-60">
              {saving ? 'Saving...' : form.id ? 'Update Class' : 'Create Class'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="Class Details" size="sm">
        {viewItem && (
          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-semibold">Name:</span> {viewItem.name}</p>
            <p><span className="font-semibold">Section:</span> {viewItem.section}</p>
            <p><span className="font-semibold">Academic Year:</span> {viewItem.academicYear}</p>
            <p><span className="font-semibold">Class Fee:</span> {formatInr(viewItem.classFee)} (Monthly)</p>
            <p><span className="font-semibold">Admission Fee:</span> {formatInr(viewItem.admissionFee)} (One Time)</p>
            <p><span className="font-semibold">Teacher:</span> {viewItem.classTeacherName || 'Not Assigned'}</p>
            <p><span className="font-semibold">Students:</span> {viewItem.studentCount || 0}</p>
            <div>
              <p className="font-semibold">Subjects:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {(viewItem.subjectNames || []).length > 0 ? viewItem.subjectNames.map((s) => (
                  <span key={s} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{s}</span>
                )) : <span className="text-gray-400 text-xs">No subjects assigned</span>}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        message="Delete this class? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmText="Delete"
      />
    </>
  );
};

export default ClassesPage;
