import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { useToast } from '../../context/ToastContext';
import { classApi } from '../../api/classApi';
import { subjectApi } from '../../api/subjectApi';
import { examApi } from '../../api/examApi';

const emptyRow = {
  subjectId: '',
  examDate: new Date().toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '12:00',
  totalMarks: 100,
  passingMarks: 40,
};

const CreateExamPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectRows, setSubjectRows] = useState([{ ...emptyRow }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    examCode: '',
    examType: 'Theory',
    term: 'Term 1',
    classRoomId: '',
    active: true,
    publishToParents: true,
    allowReevaluation: false,
    gradeScale: '',
  });

  useEffect(() => {
    Promise.all([classApi.getAll(), subjectApi.getAll()])
      .then(([classRes, subjectRes]) => {
        const classList = classRes.data.data || [];
        const subjectList = subjectRes.data.data || [];
        setClasses(classList);
        setSubjects(subjectList);
        setForm((prev) => {
          if (prev.classRoomId || classList.length === 0) return prev;
          return { ...prev, classRoomId: String(classList[0].id) };
        });
        if (subjectList.length > 0) {
          setSubjectRows((prev) => prev.map((row, i) => (
            i === 0 ? { ...row, subjectId: String(subjectList[0].id) } : row
          )));
        }
      })
      .catch((err) => {
        toast.showToast(err.response?.data?.message || 'Failed to load class and subject data.', 'error');
      });
  }, []);

  const classLabel = useMemo(() => {
    const cls = classes.find((c) => String(c.id) === String(form.classRoomId));
    return cls ? `${cls.name} ${cls.section}` : 'Select class';
  }, [classes, form.classRoomId]);

  const updateRow = (index, key, value) => {
    setSubjectRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  };

  const addRow = () => {
    const fallbackSubject = subjects[0] ? String(subjects[0].id) : '';
    setSubjectRows((prev) => [...prev, { ...emptyRow, subjectId: fallbackSubject }]);
  };

  const removeRow = (index) => {
    setSubjectRows((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.classRoomId || subjectRows.length === 0) {
      toast.showToast('Please fill exam name, class, and at least one subject row.', 'error');
      return;
    }

    const invalidRow = subjectRows.find((r) => !r.subjectId || !r.examDate);
    if (invalidRow) {
      toast.showToast('Each subject row requires subject and date.', 'error');
      return;
    }

    setLoading(true);
    try {
      await Promise.all(subjectRows.map((row) => {
        const selectedSubject = subjects.find((s) => String(s.id) === String(row.subjectId));
        return examApi.create({
          name: subjectRows.length > 1
            ? `${form.name} - ${selectedSubject?.name || 'Subject'}`
            : form.name,
          examType: form.examType,
          classRoomId: Number(form.classRoomId),
          subjectId: Number(row.subjectId),
          examDate: row.examDate,
          startTime: row.startTime,
          endTime: row.endTime,
          totalMarks: Number(row.totalMarks) || 100,
          passingMarks: Number(row.passingMarks) || 40,
          venue: `${form.term} | ${form.examCode || 'CODE'}`,
          academicYear: form.term,
        });
      }));

      toast.showToast('Exam schedule created successfully.', 'success');
      setTimeout(() => navigate('/admin/exams'), 800);
    } catch (err) {
      toast.showToast(err.response?.data?.message || 'Failed to create exam schedule.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Create Exam" subtitle="Home > Academic > Create Exam" />

      <div className="bg-white rounded-xl shadow border border-gray-100 p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Exam Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Exam Name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Exam Type</label>
            <select
              value={form.examType}
              onChange={(e) => setForm((prev) => ({ ...prev, examType: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Theory">Theory</option>
              <option value="Practical">Practical</option>
              <option value="Oral">Oral</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Term</label>
            <select
              value={form.term}
              onChange={(e) => setForm((prev) => ({ ...prev, term: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Exam Code</label>
            <input
              value={form.examCode}
              onChange={(e) => setForm((prev) => ({ ...prev, examCode: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="MATH01024"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-52">
            <label className="text-sm font-medium text-gray-700 block mb-1">Class</label>
            <select
              value={form.classRoomId}
              onChange={(e) => setForm((prev) => ({ ...prev, classRoomId: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
              ))}
            </select>
          </div>

          <label className="inline-flex items-center gap-2 mt-6 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
              className="w-4 h-4 accent-blue-600"
            />
            Active
          </label>

          <span className="mt-6 text-xs text-gray-500">Selected: {classLabel}</span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900">Subjects & Scheduling</h3>
            <button
              type="button"
              onClick={addRow}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800"
            >
              Add Subject Row
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-700">Subject</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-700">Date</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-700">Start</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-700">End</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-700">Full Marks</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-700">Passing Marks</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subjectRows.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <select
                        value={row.subjectId}
                        onChange={(e) => updateRow(index, 'subjectId', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        {subjects.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="date"
                        value={row.examDate}
                        onChange={(e) => updateRow(index, 'examDate', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="time"
                        value={row.startTime}
                        onChange={(e) => updateRow(index, 'startTime', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="time"
                        value={row.endTime}
                        onChange={(e) => updateRow(index, 'endTime', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={row.totalMarks}
                        onChange={(e) => updateRow(index, 'totalMarks', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={row.passingMarks}
                        onChange={(e) => updateRow(index, 'passingMarks', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Optional Settings</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Grade Scale</label>
              <select
                value={form.gradeScale}
                onChange={(e) => setForm((prev) => ({ ...prev, gradeScale: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Default</option>
                <option value="A-F">A-F</option>
                <option value="A1-E2">A1-E2</option>
              </select>
            </div>

            <label className="inline-flex items-center gap-2 mt-6 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.publishToParents}
                onChange={(e) => setForm((prev) => ({ ...prev, publishToParents: e.target.checked }))}
                className="w-4 h-4 accent-blue-600"
              />
              Publish Results to Parents
            </label>

            <label className="inline-flex items-center gap-2 mt-6 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.allowReevaluation}
                onChange={(e) => setForm((prev) => ({ ...prev, allowReevaluation: e.target.checked }))}
                className="w-4 h-4 accent-blue-600"
              />
              Allow Re-evaluation
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Exam'}
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateExamPage;
