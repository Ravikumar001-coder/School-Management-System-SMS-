// src/pages/student/MyExamsPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import { examApi } from '../../api/examApi';
import { subjectApi } from '../../api/subjectApi';
import { studentApi } from '../../api/studentApi';
import { useAuth } from '../../context/AuthContext';
import { getCurrentAcademicYear } from '../../utils/helpers';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { BookOpen, Calendar, Clock, PlayCircle, CheckCircle, Search, Eye, Book, Award } from 'lucide-react';

const getStatusMeta = (exam) => {
  const apiStatus = (exam.status || '').toUpperCase();
  if (apiStatus === 'COMPLETED') return { label: 'Completed', cls: 'green' };
  if (!exam.examDate) return { label: 'Scheduled', cls: 'yellow' };
  const today = new Date(new Date().toDateString());
  const d = new Date(exam.examDate);
  if (Number.isNaN(d.getTime())) return { label: 'Scheduled', cls: 'yellow' };
  if (d < today) return { label: 'Completed', cls: 'green' };
  if ((d - today) / (1000 * 60 * 60 * 24) <= 7) {
    return { label: 'Upcoming', cls: 'blue' };
  }
  return { label: 'Scheduled', cls: 'yellow' };
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader 
          title="My Exams"
          subtitle="View upcoming schedules and syllabus details"
          className="!mb-0"
        />
        <button
          type="button"
          onClick={() => navigate('/student/report-card')}
          className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2"
        >
          <Award size={18} />
          View Report Card
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Assigned Exams" 
          value={assignedCount} 
          subtitle="Total exams this term"
          variant="purple" 
          icon={() => <BookOpen size={24} className="text-purple-500" />}
        />
        <StatCard 
          title="Upcoming Exams" 
          value={upcomingCount} 
          subtitle="Next 7 days"
          variant="blue" 
          icon={() => <Calendar size={24} className="text-blue-500" />}
        />
        <StatCard 
          title="Latest Result" 
          value={latestGrade} 
          subtitle={marks[0]?.examName || 'No published result'}
          variant={latestGrade !== 'N/A' && latestGrade !== 'F' ? "green" : "orange"} 
          icon={() => <CheckCircle size={24} className={latestGrade !== 'N/A' && latestGrade !== 'F' ? "text-green-500" : "text-orange-500"} />}
        />
      </div>

      <div className="card shadow-sm border border-gray-100 p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b bg-gray-50/50 p-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exams, subjects..."
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Show Completed</span>
            <button
              type="button"
              onClick={() => setShowCompleted((v) => !v)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${showCompleted ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showCompleted ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-gray-100">
          {!loading && filteredExams.map((exam, i) => {
            const status = getStatusMeta(exam);
            const mark = marksByExamName.get(exam.name);
            return (
              <div key={exam.id || i} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{exam.name || '-'}</h4>
                    <p className="text-sm text-gray-600">{exam.subjectName || '-'}</p>
                  </div>
                  <StatusBadge status={status.label} variant={status.cls} />
                </div>
                <div className="text-xs text-gray-500 mb-3 space-y-1">
                  <p className="flex items-center gap-1.5"><Calendar size={12} /> {exam.examDate || 'TBD'}</p>
                  <p className="flex items-center gap-1.5"><Award size={12} /> Grade: <span className="font-bold text-gray-800">{mark?.grade || 'TBD'}</span></p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="flex-1 bg-white border border-gray-200 rounded-lg py-1.5 text-xs font-bold text-gray-700 flex justify-center items-center gap-1.5 shadow-sm" onClick={() => openSchedule(exam)}>
                    <Clock size={14} /> Schedule
                  </button>
                  <button type="button" className="flex-1 bg-white border border-gray-200 rounded-lg py-1.5 text-xs font-bold text-gray-700 flex justify-center items-center gap-1.5 shadow-sm" onClick={() => openSyllabus(exam)}>
                    <Book size={14} /> Syllabus
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-5 py-3 text-left">Exam Details</th>
                <th className="px-5 py-3 text-left">Term</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-center">Grade</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!loading && filteredExams.map((exam, i) => {
                const status = getStatusMeta(exam);
                const mark = marksByExamName.get(exam.name);
                return (
                  <tr key={exam.id || i} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-800">{exam.name || '-'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{exam.subjectName || '-'}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{exam.academicYear || 'Term 1'}</td>
                    <td className="px-5 py-4 text-gray-600">{exam.examDate || '-'}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={status.label} variant={status.cls} />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${mark?.grade ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                        {mark?.grade || 'TBD'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip" onClick={() => openSchedule(exam)} title="View Schedule">
                          <Clock size={16} />
                        </button>
                        <button type="button" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors tooltip" onClick={() => openSyllabus(exam)} title="View Syllabus">
                          <Book size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!loading && filteredExams.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <BookOpen size={32} className="mx-auto mb-3 opacity-50" />
            <p>No exams found matching your criteria.</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-500">Loading exams...</p>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      <Modal isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} title="Exam Schedule" size="md">
        {selectedExam ? (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Exam</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{selectedExam.name || '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1"><Calendar size={12}/> Date</p>
                <p className="font-bold text-gray-800">{selectedExam.examDate || 'To be announced'}</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1"><Clock size={12}/> Time</p>
                <p className="font-bold text-gray-800">{selectedExam.startTime || '--:--'} - {selectedExam.endTime || '--:--'}</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1"><Book size={12}/> Subject</p>
                <p className="font-bold text-gray-800">{selectedExam.subjectName || '-'}</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1"><Eye size={12}/> Status</p>
                <StatusBadge status={getStatusMeta(selectedExam).label} variant={getStatusMeta(selectedExam).cls} />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No exam selected.</p>
        )}
      </Modal>

      {/* Syllabus Modal */}
      <Modal isOpen={syllabusOpen} onClose={() => setSyllabusOpen(false)} title="Exam Syllabus" size="md">
        {syllabusLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
            <p className="text-gray-500">Loading syllabus...</p>
          </div>
        )}
        {!syllabusLoading && syllabusError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {syllabusError}
          </div>
        )}
        {!syllabusLoading && !syllabusError && (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Subject</p>
                <p className="text-lg font-bold text-indigo-900 mt-1">{syllabusData?.name || selectedExam?.subjectName || '-'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Code</p>
                <p className="font-bold text-indigo-700 mt-1">{syllabusData?.code || syllabusData?.subjectCode || '-'}</p>
              </div>
            </div>
            
            <div className="rounded-xl border border-gray-100 p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <PlayCircle size={14} /> Syllabus Outline
              </p>
              <div className="prose prose-sm text-gray-700 max-w-none">
                <p className="whitespace-pre-line leading-relaxed">
                  {syllabusData?.description || syllabusData?.details || 'No detailed syllabus has been uploaded for this subject yet.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyExamsPage;
