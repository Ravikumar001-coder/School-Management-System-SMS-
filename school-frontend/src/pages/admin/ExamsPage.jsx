import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { examApi } from '../../api/examApi';

const ExamsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [exams, setExams]   = useState([]);
  const [search, setSearch] = useState('');
  const [termFilter, setTermFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examApi.getAll()
      .then(r => setExams(r.data.data || []))
      .catch(err => {
        toast.error(err.response?.data?.message || 'Failed to load exams.');
      })
      .finally(() => setLoading(false));
  }, [toast]);

  const getStatus = (exam) => {
    if (exam.status === 'COMPLETED') return 'COMPLETED';
    if (exam.examDate && new Date(exam.examDate) < new Date(new Date().toDateString())) {
      return 'PAST_DUE';
    }
    return 'SCHEDULED';
  };

  const statusColor = (status) => {
    if (status === 'COMPLETED') return 'bg-green-100 text-green-800';
    if (status === 'PAST_DUE') return 'bg-red-100 text-red-800';
    return 'bg-amber-100 text-amber-800';
  };

  const termOptions = Array.from(
    new Set(exams.map((exam) => exam.academicYear).filter(Boolean))
  );

  const classOptions = Array.from(
    new Set(exams.map((exam) => exam.className).filter(Boolean))
  );

  const filtered = exams.filter((exam) => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || [exam.name, exam.examType, exam.className, exam.subjectName, exam.status]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q);

    const term = exam.academicYear || 'Term 1';
    const matchesTerm = termFilter === 'ALL' || term === termFilter;

    const cls = exam.className || '-';
    const matchesClass = classFilter === 'ALL' || cls === classFilter;

    return matchesSearch && matchesTerm && matchesClass;
  });

  const upcomingCount = exams.filter((e) => getStatus(e) === 'SCHEDULED').length;

  const formatStatus = (status) => {
    if (status === 'PAST_DUE') return 'Past Due';
    if (status === 'COMPLETED') return 'Completed';
    return 'Scheduled';
  };

  return (
    <>
      <PageHeader title="Exams List" subtitle="Home > Academic > Exams"
        action={
          <button onClick={() => navigate('/admin/exams/new')}
            className="bg-blue-700 text-white px-5 py-2.5 rounded-lg hover:bg-blue-800 text-sm font-medium">
            Create Exam
          </button>
        }
      />

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative w-full">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full border border-gray-300 rounded-lg pl-3 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
            </div>

              <select
                value={termFilter}
                onChange={(e) => setTermFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Terms</option>
                {termOptions.map((term) => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>

              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Classes</option>
                {classOptions.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm bg-gray-200 text-gray-800 px-3 py-2 rounded-lg font-medium">Total Exams: {exams.length}</span>
              <span className="text-sm bg-amber-100 text-amber-800 px-3 py-2 rounded-lg font-medium">Upcoming: {upcomingCount}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Exam Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Term</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Class</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Date Range</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((exam, i) => {
                  const status = getStatus(exam);
                  const term = exam.academicYear || 'Term 1';
                  const dateText = exam.examDate
                    ? `${exam.examDate} ${exam.endTime ? `| ${exam.startTime || ''} - ${exam.endTime}` : ''}`
                    : '-';
                  return (
                    <tr key={exam.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{121 + i}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{exam.name}</td>
                      <td className="px-4 py-3">{term}</td>
                      <td className="px-4 py-3">{exam.examType || '-'}</td>
                      <td className="px-4 py-3">{exam.className || '-'}</td>
                      <td className="px-4 py-3">{dateText}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${statusColor(status)}`}>
                          {formatStatus(status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 text-sm">
                          <button
                            onClick={() => navigate(`/admin/exams/${exam.id}/marks`)}
                            className="text-blue-700 hover:text-blue-900 font-medium"
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/admin/exams/${exam.id}/marks`)}
                            className="text-green-700 hover:text-green-900 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => navigate(`/admin/exams/${exam.id}/marks`)}
                            className="text-red-700 hover:text-red-900 font-medium"
                          >
                            Marks
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No exams found</p>
          <button onClick={() => navigate('/admin/exams/new')}
            className="mt-4 bg-blue-700 text-white px-6 py-2.5 rounded-lg hover:bg-blue-800 text-sm">
            Create Exam
          </button>
        </div>
      )}
    </>
  );
};

export default ExamsPage;
