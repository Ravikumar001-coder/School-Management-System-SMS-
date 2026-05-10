import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { examApi } from '../../api/examApi';
import { classApi } from '../../api/classApi';
import { studentApi } from '../../api/studentApi';
import { fileApi } from '../../api/fileApi';

const EnterMarksPage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const toast = useToast();
  const [allExams, setAllExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(id ? Number(id) : null);
  const [selectedSubjectName, setSelectedSubjectName] = useState('');
  const [exam, setExam]         = useState(null);
  const [students, setStudents] = useState([]);
  const [classes, setClasses]   = useState([]);
  const [marks, setMarks]       = useState({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    const preferredIdFromRoute = id ? Number(id) : null;
    Promise.all([examApi.getAll(), classApi.getAll()])
      .then(([examRes, classRes]) => {
        const exams = examRes.data.data || [];
        const classList = classRes.data.data || [];
        setAllExams(exams);
        setClasses(classList);

        const preferredId = preferredIdFromRoute || (exams[0]?.id ?? null);
        setSelectedExamId(preferredId);
      })
      .catch((err) => {
        toast.showToast(err.response?.data?.message || 'Failed to load exams data.', 'error');
      });
  }, [id]);

  useEffect(() => {
    if (!allExams.length || !selectedExamId) {
      setLoading(false);
      return;
    }

    const selected = allExams.find((x) => x.id === Number(selectedExamId));
    setExam(selected || null);
    setSelectedSubjectName(selected?.subjectName || '');

    if (!selected?.className) {
      setStudents([]);
      setMarks({});
      setLoading(false);
      return;
    }

    const targetClass = classes.find((c) => `${c.name} - ${c.section}` === selected.className);
    if (!targetClass) {
      setStudents([]);
      setMarks({});
      setLoading(false);
      return;
    }

    setLoading(true);
    studentApi.byClass(targetClass.id)
      .then((sRes) => {
        const list = sRes.data.data || [];
        setStudents(list);
        const init = {};
        list.forEach((s) => {
          init[s.id] = { marksObtained: '', absent: false };
        });
        setMarks(init);
      })
      .catch((err) => {
        toast.showToast(err.response?.data?.message || 'Failed to load students for selected exam.', 'error');
      })
      .finally(() => setLoading(false));
  }, [allExams, selectedExamId, classes]);

  const handleChange = (studentId, field, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value }
    }));
  };

  const handleSubmit = async () => {
    if (!selectedExamId) {
      toast.showToast('Please select an exam first.', 'error');
      return;
    }

    setSaving(true);
    try {
      const marksList = students.map(s => ({
        studentId:      s.id,
        marksObtained:  marks[s.id]?.absent
                        ? null
                        : Number(marks[s.id]?.marksObtained),
        absent:         marks[s.id]?.absent || false,
      }));
      await examApi.enterMarks({ examId: Number(selectedExamId), marks: marksList });
      toast.showToast('Marks saved successfully!', 'success');
    } catch (err) {
      toast.showToast(err.response?.data?.message || 'Failed to save marks.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <><LoadingSpinner /></>;

  return (
    <>
      <PageHeader title={`Enter Marks ${exam?.name ? `(${exam.name})` : ''}`} subtitle="Home > Academic > Exams > Enter Marks" />

      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex flex-col lg:flex-row gap-3 lg:items-end lg:justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full lg:max-w-2xl">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Select Exam</label>
              <select
                value={selectedExamId || ''}
                onChange={(e) => setSelectedExamId(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {allExams.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Select Subject</label>
              <select
                value={selectedSubjectName}
                onChange={(e) => setSelectedSubjectName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from(new Set(allExams.map((e) => e.subjectName).filter(Boolean))).map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800"
            >
              Upload Marks via CSV
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save All'}
            </button>
            <button onClick={() => navigate('/admin/exams')} className="text-sm text-gray-600 hover:text-gray-900 px-2 py-2">
              Back
            </button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-gray-700">ID</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-700">Student Name</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-700">Roll No.</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-700">Class</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-700">Marks Obtained</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {students.map((s, i) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-gray-700">{121 + i}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 overflow-hidden flex items-center justify-center text-green-700 text-xs font-bold">
                      {s.profilePhoto ? (
                        <img src={fileApi.toPublicUrl(s.profilePhoto)} alt={`${s.firstName || ''} ${s.lastName || ''}`.trim()} className="w-8 h-8 object-cover rounded-full" />
                      ) : (
                        <>{s.firstName?.[0]}{s.lastName?.[0]}</>
                      )}
                    </div>
                    <span className="font-medium text-gray-800">{s.firstName} {s.lastName}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  {String(s.studentId || '').replace(/\D/g, '').slice(-4) || `00${i + 10}`}
                </td>
                <td className="px-5 py-3">
                  <select
                    disabled
                    className="border border-gray-300 rounded-lg px-2 py-1.5 bg-gray-50 text-sm"
                  >
                    <option>{exam?.className || '-'}</option>
                  </select>
                </td>
                <td className="px-5 py-3">
                  <input
                    type="number"
                    min="0"
                    max={exam?.totalMarks}
                    value={marks[s.id]?.marksObtained || ''}
                    onChange={e =>
                      handleChange(s.id, 'marksObtained', e.target.value)}
                    disabled={marks[s.id]?.absent}
                    className="w-28 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                               disabled:bg-gray-100"
                    placeholder="0"
                  />
                  <span className="ml-3 text-gray-700 font-medium">[ {exam?.passingMarks || 0} ] / {exam?.totalMarks || 100}</span>
                  <label className="ml-3 inline-flex items-center gap-1 text-xs text-red-600">
                    <input
                      type="checkbox"
                      checked={marks[s.id]?.absent || false}
                      onChange={e => handleChange(s.id, 'absent', e.target.checked)}
                      className="w-3.5 h-3.5 accent-red-500 cursor-pointer"
                    />
                    Absent
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EnterMarksPage;
