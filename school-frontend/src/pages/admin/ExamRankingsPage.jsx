// src/pages/admin/ExamRankingsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Medal, Award, Search, ArrowLeft, Download } from 'lucide-react';
import { examApi } from '../../api/examApi';
import { classApi } from '../../api/classApi';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RankBadge = ({ rank }) => {
  if (rank === 1) return <Trophy className="text-amber-500" size={20} />;
  if (rank === 2) return <Medal className="text-slate-400" size={20} />;
  if (rank === 3) return <Award className="text-amber-700" size={20} />;
  return <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">{rank}</span>;
};

const GradeBadge = ({ grade }) => {
  const colors = {
    'A+': 'bg-emerald-100 text-emerald-700',
    'A': 'bg-emerald-50 text-emerald-600',
    'B': 'bg-blue-50 text-blue-600',
    'C': 'bg-amber-50 text-amber-600',
    'D': 'bg-orange-50 text-orange-600',
    'F': 'bg-rose-100 text-rose-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors[grade] || 'bg-slate-100 text-slate-600'}`}>
      {grade}
    </span>
  );
};

const ExamRankingsPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [rankings, setRankings] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [examName, setExamName] = useState('');

  // Load classes
  useEffect(() => {
    classApi.getAll().then(res => {
      const data = res?.data?.data ?? [];
      setClasses(data);
      if (data.length > 0) setSelectedClass(data[0].id);
    });
    
    // In a real app, fetch exam details to get the name
    examApi.getAll().then(res => {
      const allExams = res?.data?.data ?? [];
      const current = allExams.find(e => e.id.toString() === examId);
      if (current) setExamName(current.name);
    });
  }, [examId]);

  const fetchRankings = useCallback(async () => {
    if (!selectedClass) return;
    setLoading(true);
    try {
      const res = await examApi.getClassRankings(examId, selectedClass);
      setRankings(res.data?.data ?? []);
    } catch {
      toast.error('Failed to load rankings.');
    } finally {
      setLoading(false);
    }
  }, [examId, selectedClass, toast]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  const handleExport = () => {
    toast.info('Exporting rankings to CSV...');
    const headers = ['Rank', 'ID', 'Student Name', 'Total Marks', 'Max Marks', 'Percentage', 'Grade'];
    const rows = rankings.map(r => [
      r.rank, r.studentId, r.studentName, r.totalMarks, r.maxPossibleMarks, r.percentage.toFixed(2) + '%', r.grade
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rankings_${examName}_Class_${selectedClass}.csv`;
    link.click();
    toast.success('Exported successfully');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Class Performance Rankings"
        subtitle={examName ? `${examName} — Leadership Board` : 'Academic Leaderboard'}
        actions={
          <div className="flex gap-3">
             <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm font-medium"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.section}</option>
              ))}
            </select>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-900 transition-all shadow-md active:scale-95"
            >
              <Download size={16} /> Export
            </button>
          </div>
        }
      />

      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-500 hover:text-blue-600 font-bold text-xs mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Exams
      </button>

      {loading ? (
        <div className="py-20"><LoadingSpinner /></div>
      ) : rankings.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="text-slate-300" size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800">No Rankings Available</h3>
          <p className="text-slate-400 font-bold mt-2">Marks might not have been entered for this class yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Rank</th>
                <th className="py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Total Marks</th>
                <th className="py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Percentage</th>
                <th className="py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-slate-700">
              {rankings.map((r, idx) => (
                <tr key={idx} className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors ${idx < 3 ? 'bg-amber-50/20' : ''}`}>
                  <td className="py-5 px-6">
                    <RankBadge rank={r.rank} />
                  </td>
                  <td className="py-5 px-6">
                    <div>
                      <p className="font-black text-slate-900">{r.studentName}</p>
                      <p className="text-[10px] text-slate-400 font-mono tracking-tighter">{r.studentId}</p>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-slate-600">
                    <span className="text-slate-900">{r.totalMarks}</span>
                    <span className="text-slate-300 mx-1">/</span>
                    <span className="text-slate-400 text-xs">{r.maxPossibleMarks}</span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                        <div 
                          className={`h-full rounded-full ${r.percentage >= 80 ? 'bg-emerald-500' : r.percentage >= 60 ? 'bg-blue-500' : 'bg-amber-500'}`}
                          style={{ width: `${r.percentage}%` }}
                        />
                      </div>
                      <span className="text-slate-900">{r.percentage.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <GradeBadge grade={r.grade} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExamRankingsPage;
