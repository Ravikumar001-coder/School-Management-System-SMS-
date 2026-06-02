// src/pages/admin/IdCardGenerator.jsx
import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import PageHeader from '../../components/common/PageHeader';
import Loading from '../../components/common/Loading';
import { FiPrinter, FiRefreshCw, FiCheckCircle, FiUser } from 'react-icons/fi';

const SCHOOL_NAME = 'KNOWLEDGE ACADEMY';
const SCHOOL_TAGLINE = 'Excellence in Education';
const SCHOOL_COLOR = '#1e3a8a'; // deep blue

const IdCardGenerator = () => {
  const toast = useToast();
  const printRef = useRef();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // ── Load classes ─────────────────────────────────────────────────────────
  useEffect(() => {
    api.get('/classes')
      .then(r => setClasses(r.data?.data ?? r.data ?? []))
      .catch(() => toast.error('Failed to load classes.'))
      .finally(() => setLoadingClasses(false));
  }, []);

  // ── Fetch students for selected class ────────────────────────────────────
  const fetchStudents = async () => {
    if (!selectedClassId) return toast.error('Please select a class first.');
    setLoadingStudents(true);
    setStudents([]);
    setSelectedKeys([]);
    try {
      const res = await api.get(`/admin/id-cards/students?classId=${selectedClassId}`);
      setStudents(res.data?.data ?? res.data ?? []);
    } catch {
      toast.error('Failed to load students.');
    } finally {
      setLoadingStudents(false);
    }
  };

  const toggleStudent = (id) =>
    setSelectedKeys(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]);
  const selectAll  = () => setSelectedKeys(students.map(s => s.id));
  const selectNone = () => setSelectedKeys([]);

  // ── Print ────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    if (selectedKeys.length === 0) return toast.warning('Select at least one student.');
    window.print();
  };

  const selectedStudents = students.filter(s => selectedKeys.includes(s.id));

  if (loadingClasses) return <Loading fullScreen />;

  return (
    <>
      <style>{`
        @media print {
          body > *:not(#id-card-print-area) { display: none !important; }
          #id-card-print-area { display: flex !important; flex-wrap: wrap; gap: 12px; padding: 8mm; }
          .id-card { break-inside: avoid; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print">
        <PageHeader
          title="Smart ID Card Generator"
          subtitle="Select a class, pick students, and print professional ID cards."
          actions={
            <button
              id="btn-print-id-cards"
              onClick={handlePrint}
              className="bg-[#1E40AF] text-white px-6 py-3 rounded-[16px] hover:bg-[#1E3A8A] font-bold text-sm min-h-[44px] shadow-md flex items-center gap-2"
              disabled={selectedKeys.length === 0}
            >
              <FiPrinter /> Print {selectedKeys.length > 0 ? `(${selectedKeys.length})` : 'Cards'}
            </button>
          }
        />

        {/* Class Selector */}
        <div className="bg-white rounded-[16px] p-5 mb-6 shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] flex items-end gap-4 animate-fade-in">
          <div className="flex-1">
            <label className="form-label">Select Class</label>
            <select
              className="form-input"
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
            >
              <option value="">Choose a class...</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.section ? ` - ${c.section}` : ''}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchStudents}
            disabled={!selectedClassId || loadingStudents}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-[16px] font-bold flex items-center gap-2 min-h-[44px] hover:bg-gray-200"
          >
            <FiRefreshCw className={loadingStudents ? 'animate-spin' : ''} />
            {loadingStudents ? 'Loading...' : 'Fetch Students'}
          </button>
        </div>

        {/* Student Selection Table */}
        {students.length > 0 && (
          <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] !p-0 overflow-hidden mb-6 animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">
                Select Students &nbsp;<span className="font-normal text-gray-400">({selectedKeys.length}/{students.length})</span>
              </h3>
              <div className="flex gap-3">
                <button onClick={selectAll} className="text-xs font-bold text-blue-600 uppercase hover:text-blue-800">All</button>
                <button onClick={selectNone} className="text-xs font-bold text-red-500 uppercase hover:text-red-700">None</button>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 w-16">Select</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Student ID</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Name</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Roll No</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Blood Group</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">DOB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map(s => {
                  const checked = selectedKeys.includes(s.id);
                  return (
                    <tr
                      key={s.id}
                      onClick={() => toggleStudent(s.id)}
                      className={`cursor-pointer transition-colors ${checked ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-6 py-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                          {checked && <FiCheckCircle className="text-white w-3.5 h-3.5" />}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm font-mono text-gray-500">{s.studentId}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-gray-800">{s.firstName} {s.lastName}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{s.rollNumber || '—'}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{s.bloodGroup || '—'}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString('en-IN') : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {students.length === 0 && !loadingStudents && selectedClassId && (
          <p className="text-center text-gray-400 py-8">No students found in selected class.</p>
        )}

        {/* Live Preview of Selected ID Cards */}
        {selectedStudents.length > 0 && (
          <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-6 animate-fade-in">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">
              ID Card Preview ({selectedStudents.length})
            </h3>
            <div className="flex flex-wrap gap-4">
              {selectedStudents.map(student => (
                <IdCard key={student.id} student={student} schoolName={SCHOOL_NAME} schoolTagline={SCHOOL_TAGLINE} schoolColor={SCHOOL_COLOR} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Print-only area */}
      <div id="id-card-print-area" style={{ display: 'none' }}>
        {selectedStudents.map(student => (
          <IdCard key={student.id} student={student} schoolName={SCHOOL_NAME} schoolTagline={SCHOOL_TAGLINE} schoolColor={SCHOOL_COLOR} print />
        ))}
      </div>
    </>
  );
};

// ── ID Card Component ────────────────────────────────────────────────────────
const IdCard = ({ student, schoolName, schoolTagline, schoolColor, print }) => (
  <div
    className="id-card"
    style={{
      width: '85.6mm',
      minHeight: '54mm',
      border: `2px solid ${schoolColor}`,
      borderRadius: '10px',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
      background: '#fff',
      boxShadow: print ? 'none' : '0 2px 12px rgba(0,0,0,0.12)',
    }}
  >
    {/* Header */}
    <div style={{ background: schoolColor, color: '#fff', padding: '6px 10px', textAlign: 'center' }}>
      <div style={{ fontWeight: 900, fontSize: '11px', letterSpacing: '1px' }}>{schoolName}</div>
      <div style={{ fontSize: '8px', opacity: 0.85, marginTop: '1px' }}>{schoolTagline}</div>
    </div>

    {/* Body */}
    <div style={{ display: 'flex', padding: '8px 10px', gap: '8px', alignItems: 'flex-start' }}>
      {/* Photo Placeholder */}
      <div style={{ width: '50px', height: '60px', border: `1px solid ${schoolColor}`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#f0f4ff' }}>
        {student.profilePhoto
          ? <img src={student.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '3px' }} />
          : <FiUser style={{ width: '22px', height: '22px', color: schoolColor }} />
        }
      </div>

      {/* Info */}
      <div style={{ fontSize: '9px', lineHeight: '1.6', flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '10px', color: schoolColor }}>{student.firstName} {student.lastName}</div>
        <div><span style={{ fontWeight: 600, color: '#555' }}>ID:</span> {student.studentId}</div>
        <div><span style={{ fontWeight: 600, color: '#555' }}>Roll:</span> {student.rollNumber || '—'}</div>
        <div><span style={{ fontWeight: 600, color: '#555' }}>Class:</span> {student.classRoom?.name}{student.classRoom?.section ? ` - ${student.classRoom.section}` : ''}</div>
        <div><span style={{ fontWeight: 600, color: '#555' }}>DOB:</span> {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-IN') : '—'}</div>
        <div><span style={{ fontWeight: 600, color: '#555' }}>Blood:</span> <strong style={{ color: '#dc2626' }}>{student.bloodGroup || '—'}</strong></div>
      </div>
    </div>

    {/* Footer */}
    <div style={{ borderTop: `1px dashed ${schoolColor}55`, margin: '0 10px', padding: '4px 0', display: 'flex', justifyContent: 'space-between', fontSize: '7px', color: '#888' }}>
      <span>📞 {student.parentPhone || '—'}</span>
      <span style={{ borderTop: `1px solid #999`, paddingTop: '1px' }}>Principal</span>
    </div>
  </div>
);

export default IdCardGenerator;
