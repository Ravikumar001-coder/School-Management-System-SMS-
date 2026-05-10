import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import { examApi } from '../../api/examApi';
import { subjectApi } from '../../api/subjectApi';
import { studentApi } from '../../api/studentApi';
import { useAuth } from '../../context/AuthContext';
import { getCurrentAcademicYear } from '../../utils/helpers';

const cardShadow = { boxShadow: '0 2px 12px rgba(15, 23, 42, 0.08)' };

const getStatusMeta = (exam) => {
  const apiStatus = (exam.status || '').toUpperCase();
  if (apiStatus === 'COMPLETED') return { label: 'Completed', cls: 'bg-green-100 text-green-800' };
  if (!exam.examDate) return { label: 'Scheduled', cls: 'bg-amber-100 text-amber-800' };
  const today = new Date(new Date().toDateString());
  const d = new Date(exam.examDate);
  if (Number.isNaN(d.getTime())) return { label: 'Scheduled', cls: 'bg-amber-100 text-amber-800' };
  if (d < today) return { label: 'Completed', cls: 'bg-green-100 text-green-800' };
  if ((d - today) / (1000 * 60 * 60 * 24) <= 7) {
    return { label: 'Upcoming', cls: 'bg-sky-100 text-sky-800' };
  }
  return { label: 'Scheduled', cls: 'bg-amber-100 text-amber-800' };
};

const MyExamsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const studentId = user?.studentId;

  const [exams, setExams] = useState([]);
  const [marks, setMarks] = useState([]);
  const [search, setSearch] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [syllabusOpen, setSyllabusOpen] = useState(false);
  const [syllabusLoading, setSyllabusLoading] = useState(false);
  const [syllabusData, setSyllabusData] = useState(null);
  const [syllabusError, setSyllabusError] = useState('');

  useEffect(() => {
    if (!studentId) {
      setError('Student profile is not linked to this account.');
      setLoading(false);
      return;
    }

    studentApi.getById(studentId)
      .then((studentRes) => {
        const profile = studentRes?.data?.data || studentRes?.data || null;
        return Promise.all([
          profile?.classRoomId ? examApi.getByClass(profile.classRoomId) : Promise.resolve({ data: { data: [] } }),
          examApi.reportCard(studentId, getCurrentAcademicYear()),
        ]);
      }).then(([eRes, mRes]) => {
      setExams(eRes.data.data || []);
      setMarks(mRes.data.data || []);
      setError('');
    }).catch(() => {
      setError('Unable to load exams right now.');
    }).finally(() => {
      setLoading(false);
    });
  }, [studentId]);

  const marksByExamName = useMemo(() => {
    const map = new Map();
    marks.forEach((m) => {
      if (m.examName && !map.has(m.examName)) {
        map.set(m.examName, m);
      }
    });
    return map;
  }, [marks]);

  const filteredExams = useMemo(() => {
    const q = search.trim().toLowerCase();
    return exams.filter((exam) => {
      const status = getStatusMeta(exam).label;
      if (!showCompleted && status === 'Completed') return false;

      if (!q) return true;
      return [
        exam.name,
        exam.academicYear,
        exam.subjectName,
        exam.className,
        status,
      ].filter(Boolean).join(' ').toLowerCase().includes(q);
    });
  }, [exams, search, showCompleted]);

  const assignedCount = exams.length;
  const upcomingCount = exams.filter((e) => getStatusMeta(e).label === 'Upcoming').length;
  const latestGrade = marks[0]?.grade || 'N/A';

  const openSchedule = (exam) => {
    setSelectedExam(exam);
    setScheduleOpen(true);
  };

  const openSyllabus = async (exam) => {
    setSelectedExam(exam);
    setSyllabusOpen(true);
    setSyllabusError('');
    setSyllabusData(null);

    if (exam?.subjectId) {
      setSyllabusLoading(true);
      try {
        const res = await subjectApi.getById(exam.subjectId);
        setSyllabusData(res?.data?.data || null);
      } catch {
        setSyllabusError('Unable to load syllabus details for this subject.');
      } finally {
        setSyllabusLoading(false);
      }
      return;
    }

    setSyllabusData({
      name: exam?.subjectName || 'Subject',
      code: exam?.subjectCode || '-',
      description: 'Detailed syllabus is not linked for this exam yet.',
    });
  };

  return (
    <>
      <div className="mb-3 text-sm font-medium text-gray-500">Home {'>'} Dashboard {'>'} My Exams</div>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-[48px] font-semibold leading-none tracking-tight text-slate-900">My Exams</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate('/student/exams')}
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            View Full Schedule
          </button>
          <button
            type="button"
            onClick={() => navigate('/student/report-card')}
            className="rounded-lg bg-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-400"
          >
            Exam Announcements
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {[
          {
            title: 'Assigned Exams',
            value: assignedCount,
            sub: 'Total exams to take',
            color: 'from-slate-50 to-blue-100',
            icon: '📊',
          },
          {
            title: 'Upcoming Exams',
            value: upcomingCount,
            sub: 'Next 7 days',
            color: 'from-slate-50 to-indigo-100',
            icon: '📄',
          },
          {
            title: 'Recent Results Posted',
            value: latestGrade,
            sub: marks[0]?.examName || 'No published result',
            color: 'from-slate-50 to-green-100',
            icon: '💵',
          },
        ].map((s) => (
          <div key={s.title} className={`rounded-2xl bg-gradient-to-r px-5 py-4 ${s.color}`} style={cardShadow}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[35px] font-medium leading-tight text-slate-900">{s.title}</p>
                <p className="mt-1 text-[52px] font-bold leading-none text-slate-900">{s.value}</p>
                <p className="mt-2 text-[24px] leading-tight text-slate-600">{s.sub}</p>
              </div>
              <span className="text-4xl text-slate-500">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white" style={cardShadow}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-slate-50 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <span>Show Completed</span>
              <button
                type="button"
                onClick={() => setShowCompleted((v) => !v)}
                className={`relative h-7 w-14 rounded-full transition ${showCompleted ? 'bg-blue-700' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${showCompleted ? 'right-1' : 'left-1'}`} />
              </button>
            </label>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setShowCompleted(true);
              }}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              Reset Filters
            </button>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exam, subject, class, status"
            className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[15px]">
            <thead className="border-b bg-slate-100">
              <tr>
                {['ID', 'Exam Name', 'Term', 'Subject', 'Date', 'Status', 'Grade', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[14px] font-semibold text-slate-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && filteredExams.map((exam, i) => {
                const status = getStatusMeta(exam);
                const mark = marksByExamName.get(exam.name);
                return (
                  <tr key={exam.id || i} className="border-b hover:bg-slate-50">
                    <td className="px-5 py-3.5 text-slate-700">{exam.id || 120 + i}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{exam.name || '-'}</td>
                    <td className="px-5 py-3.5 text-slate-700">{exam.academicYear || 'Term 1'}</td>
                    <td className="px-5 py-3.5 text-slate-700">{exam.subjectName || '-'}</td>
                    <td className="px-5 py-3.5 text-slate-700">{exam.examDate || '-'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${status.cls}`}>{status.label}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${mark?.grade ? 'bg-lime-100 text-lime-800' : 'bg-gray-100 text-gray-700'}`}>
                        {mark?.grade || 'TBD'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <button type="button" className="text-blue-700 hover:underline" onClick={() => openSchedule(exam)}>View Schedule</button>
                        <button type="button" className="text-slate-700 hover:underline" onClick={() => openSyllabus(exam)}>View Syllabus</button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && filteredExams.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-500">No exams found for current filters.</td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-500">Loading exams...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} title="Exam Schedule" size="md">
        {selectedExam ? (
          <div className="space-y-3 text-sm text-slate-700">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Exam</p>
              <p className="text-base font-semibold text-slate-900">{selectedExam.name || '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Date</p>
                <p className="font-medium">{selectedExam.examDate || '-'}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Time</p>
                <p className="font-medium">{selectedExam.startTime || '--:--'} - {selectedExam.endTime || '--:--'}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Subject</p>
                <p className="font-medium">{selectedExam.subjectName || '-'}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Class</p>
                <p className="font-medium">{selectedExam.className || '-'}</p>
              </div>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-blue-700">
              Current Status: {getStatusMeta(selectedExam).label}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No exam selected.</p>
        )}
      </Modal>

      <Modal isOpen={syllabusOpen} onClose={() => setSyllabusOpen(false)} title="Exam Syllabus" size="md">
        {syllabusLoading && <p className="text-sm text-slate-500">Loading syllabus...</p>}
        {!syllabusLoading && syllabusError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {syllabusError}
          </div>
        )}
        {!syllabusLoading && !syllabusError && (
          <div className="space-y-3 text-sm text-slate-700">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Exam</p>
              <p className="text-base font-semibold text-slate-900">{selectedExam?.name || '-'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Subject</p>
              <p className="font-medium">{syllabusData?.name || selectedExam?.subjectName || '-'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Subject Code</p>
              <p className="font-medium">{syllabusData?.code || syllabusData?.subjectCode || '-'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Syllabus Outline</p>
              <p className="whitespace-pre-line text-slate-700">
                {syllabusData?.description || syllabusData?.details || 'No detailed syllabus has been uploaded for this subject yet.'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default MyExamsPage;
