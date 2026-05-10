import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import StudentProfileDetails from '../../components/teachers/StudentProfileDetails';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { examApi } from '../../api/examApi';
import { attendanceApi } from '../../api/attendanceApi';
import { fileApi } from '../../api/fileApi';
import { getTeacherScopeData, getTodayAttendanceSummary } from '../../utils/teacherData';

const cardBg = [
  'from-blue-50 to-blue-100 border-blue-100',
  'from-indigo-50 to-indigo-100 border-indigo-100',
  'from-green-50 to-green-100 border-green-100',
];

const TeacherStudentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState({ students: [], exams: [], assignedClasses: [] });
  const [classFilter, setClassFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [flaggedIds, setFlaggedIds] = useState([]);
  const [studentScoreByCode, setStudentScoreByCode] = useState({});
  const [attendanceStatusByCode, setAttendanceStatusByCode] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getTeacherScopeData(user);
        setScope(data);

        const marksMap = {};
        const marksArrays = await Promise.all(
          (data.exams || []).map(async (exam) => {
            try {
              const res = await examApi.getMarks(exam.id);
              return Array.isArray(res?.data?.data) ? res.data.data : [];
            } catch {
              return [];
            }
          })
        );

        marksArrays.flat().forEach((mark) => {
          const key = mark.studentCode;
          if (!key || typeof mark.marksObtained !== 'number' || !mark.totalMarks) {
            return;
          }

          if (!marksMap[key]) {
            marksMap[key] = { sumPct: 0, count: 0 };
          }

          marksMap[key].sumPct += (mark.marksObtained / mark.totalMarks) * 100;
          marksMap[key].count += 1;
        });

        const avgMap = Object.fromEntries(
          Object.entries(marksMap).map(([key, item]) => [key, Math.round(item.sumPct / item.count)])
        );
        setStudentScoreByCode(avgMap);

        const todaySummary = await getTodayAttendanceSummary(data.assignedClasses || []);
        const statusMap = {};

        // Fetch today's class attendance details for student-level status.
        await Promise.all(
          (data.assignedClasses || []).map(async (classRoom) => {
            try {
              const attendanceRes = await attendanceApi.classReport(classRoom.id, todaySummary.date);
              const classData = attendanceRes?.data?.data || {};
              const records = Array.isArray(classData.records) ? classData.records : [];
              records.forEach((record) => {
                if (record.studentId) {
                  statusMap[record.studentId] = (record.status || 'UNMARKED').toUpperCase();
                }
              });
            } catch {
              // Keep student status as UNMARKED if attendance for a class is unavailable.
            }
          })
        );

        setAttendanceStatusByCode(statusMap);
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to load students data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, showToast]);

  const classOptions = useMemo(() => {
    return Array.from(new Set((scope.students || []).map((student) => student.className).filter(Boolean)));
  }, [scope.students]);

  const filteredStudents = useMemo(() => {
    return (scope.students || []).filter((student) => classFilter === 'ALL' || student.className === classFilter);
  }, [classFilter, scope.students]);

  const topPerformers = useMemo(() => {
    return filteredStudents.filter((student) => {
      const score = studentScoreByCode[student.studentId] || 0;
      return score >= 75;
    });
  }, [filteredStudents, studentScoreByCode]);

  const lowAttendanceStudents = useMemo(() => {
    return filteredStudents.filter((student) => {
      const status = attendanceStatusByCode[student.studentId] || 'UNMARKED';
      return status === 'ABSENT' || status === 'LATE';
    });
  }, [attendanceStatusByCode, filteredStudents]);

  const statusPillClass = (status) => {
    if (status === 'PRESENT') {
      return 'bg-green-100 text-green-800';
    }
    if (status === 'LATE') {
      return 'bg-sky-100 text-sky-800';
    }
    if (status === 'ABSENT') {
      return 'bg-yellow-100 text-yellow-900';
    }
    return 'bg-gray-100 text-gray-700';
  };

  const toggleFlag = (studentId) => {
    setFlaggedIds((prev) => (
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    ));
  };

  const sendMessage = (student) => {
    if (!student.parentEmail) {
      showToast('Parent email is not available for this student.', 'error');
      return;
    }
    window.location.href = `mailto:${student.parentEmail}?subject=Student%20Update%20${encodeURIComponent(student.firstName || '')}`;
    showToast('Email composer opened for parent contact.', 'success');
  };

  const sendMessageToAll = () => {
    const emails = filteredStudents
      .map((student) => student.parentEmail)
      .filter(Boolean);

    if (!emails.length) {
      showToast('No parent email addresses are available for the current selection.', 'error');
      return;
    }

    window.location.href = `mailto:?bcc=${encodeURIComponent(emails.join(','))}&subject=${encodeURIComponent('Student Update')}`;
    showToast('Email composer opened for the selected student group.', 'success');
  };

  if (loading) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Home &gt; Dashboard &gt; My Students</p>
          <h1 className="text-4xl font-bold text-gray-900">My Students</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/teacher/exams')}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800"
          >
            View Detailed Performance
          </button>
          <button
            onClick={sendMessageToAll}
            className="bg-sky-100 text-sky-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-200"
          >
            Send Message to All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {[
          { title: 'Assigned Students', value: filteredStudents.length, subtitle: 'Total students in my classes' },
          { title: 'Top Student Performers', value: `${topPerformers.length} Students`, subtitle: 'Based on available marks' },
          { title: 'Low Attendance Alerts', value: `${lowAttendanceStudents.length} Students`, subtitle: 'Requires attention' },
        ].map((card, index) => (
          <div key={card.title} className={`bg-gradient-to-r ${cardBg[index]} border rounded-xl shadow-sm`}>
            <div className="px-4 py-3">
              <p className="text-xl font-semibold text-gray-900">{card.title}</p>
              <p className="text-5xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
            <div className="px-4 py-2 bg-white/60 text-gray-700 text-sm rounded-b-xl">{card.subtitle}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex flex-wrap items-center gap-2 justify-between">
          <h3 className="text-2xl font-semibold text-gray-900">My Students</h3>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="ALL">All Classes</option>
            {classOptions.map((className) => (
              <option key={className} value={className}>{className}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Student Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Class</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Roll No.</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Subject</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Last Test Score</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Attendance Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length ? filteredStudents.map((student, index) => {
                const studentCode = student.studentId;
                const attendanceStatus = attendanceStatusByCode[studentCode] || 'UNMARKED';
                const score = studentScoreByCode[studentCode];
                const relatedExam = (scope.exams || []).find((exam) => exam.className === student.className);
                const isFlagged = flaggedIds.includes(student.id);

                return (
                  <tr key={student.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 overflow-hidden flex items-center justify-center text-green-700 text-xs font-semibold">
                          {student.profilePhoto
                            ? <img src={fileApi.toPublicUrl(student.profilePhoto)} alt={`${student.firstName || ''} ${student.lastName || ''}`.trim()} className="w-full h-full object-cover" />
                            : `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`}
                        </div>
                        <span className="font-medium text-gray-900">{student.firstName} {student.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{student.className || '-'}</td>
                    <td className="px-4 py-3">{String(student.studentId || '').replace(/\D/g, '').slice(-4) || '-'}</td>
                    <td className="px-4 py-3">{relatedExam?.subjectName || '-'}</td>
                    <td className="px-4 py-3">{typeof score === 'number' ? `${score}` : '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusPillClass(attendanceStatus)}`}>
                        {attendanceStatus === 'UNMARKED' ? 'Unmarked' : attendanceStatus.charAt(0) + attendanceStatus.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 text-sm">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="text-blue-700 hover:text-blue-900 font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => sendMessage(student)}
                          className="text-green-700 hover:text-green-900 font-medium"
                        >
                          Message
                        </button>
                        <button
                          onClick={() => toggleFlag(student.id)}
                          className={`font-medium ${isFlagged ? 'text-red-700 hover:text-red-900' : 'text-amber-700 hover:text-amber-900'}`}
                        >
                          {isFlagged ? 'Unflag' : 'Flag'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td className="px-4 py-8 text-gray-500" colSpan={8}>No students found for this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Student Insights & Profile"
        size="xl"
      >
        {selectedStudent && (
          <StudentProfileDetails 
            student={selectedStudent} 
            score={studentScoreByCode[selectedStudent.studentId]}
            attendanceStatus={attendanceStatusByCode[selectedStudent.studentId]}
          />
        )}
      </Modal>
    </>
  );
};

export default TeacherStudentsPage;
