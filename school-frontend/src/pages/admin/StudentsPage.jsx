// src/pages/admin/StudentsPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  // Filters
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Data for filters
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchCount();
  }, [currentPage, selectedClass, selectedSection, selectedStatus]);

  useEffect(() => {
    if (selectedClass) {
      fetchSections(selectedClass);
    } else {
      setSections([]);
    }
  }, [selectedClass]);

  const fetchFilters = async () => {
    try {
      const classRes = await api.get('/classes');
      setClasses(classRes.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSections = async (classId) => {
    try {
      const cls = classes.find(c => c.id.toString() === classId.toString());
      if (cls) {
        const secRes = await api.get(`/classes/sections?className=${cls.name}`);
        setSections(secRes.data.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCount = async () => {
    try {
      let url = `/students/count?`;
      if (selectedClass) url += `&classId=${selectedClass}`;
      if (selectedSection) url += `&section=${selectedSection}`;
      if (selectedStatus) url += `&status=${selectedStatus}`;
      const res = await api.get(url);
      setTotalStudents(res.data.data || 0);
    } catch (e) {
      console.error(e);
    }
  }

  const fetchStudents = async () => {
    try {
      setLoading(true);
      let url = `/students?page=${currentPage}&size=10&sortBy=firstName`;
      if (searchTerm) url += `&keyword=${searchTerm}`;
      if (selectedClass) url += `&classId=${selectedClass}`;
      // Note: Backend might need updates to handle section/status filters in /students, but we'll pass them if supported
      
      const response = await api.get(url);
      setStudents(response.data.data?.content || response.data.content || []);
      setTotalPages(response.data.data?.totalPages || response.data.totalPages || 0);
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchStudents();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedClass('');
    setSelectedSection('');
    setSelectedStatus('');
    setCurrentPage(0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
      fetchCount();
    } catch (err) {
      setError('Failed to delete student');
    }
  };

  const handleExport = async (format) => {
    try {
      let url = `/students/export?format=${format}`;
      if (selectedClass) url += `&classId=${selectedClass}`;
      if (selectedSection) url += `&section=${selectedSection}`;
      window.open(api.defaults.baseURL + url, '_blank');
    } catch (e) {
      console.error('Export failed');
    }
  };

  const handleBulkIdCards = async () => {
    const studentIds = students.map(s => s.id);
    if(studentIds.length === 0) return alert('No students to generate IDs for');
    try {
      const res = await api.post('/admin/id-cards/generate', { studentIds }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'id_cards.pdf');
      document.body.appendChild(link);
      link.click();
    } catch(e) {
      alert('Failed to generate ID cards');
    }
  };

  const cardStyle = "bg-white border border-slate-200 shadow-[0_2px_2px_rgba(0,0,0,0.05),0_12px_24px_-4px_rgba(30,64,175,0.08)]";

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-900 font-sans">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Student Directory</h2>
          <p className="text-slate-500 text-sm">Manage enrollments, view academic profiles, and update guardian information.</p>
        </div>
        <div className="flex gap-3">
            <button onClick={() => handleExport('excel')} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">download</span> Excel
            </button>
            <button onClick={handleBulkIdCards} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">badge</span> ID Cards
            </button>
            <button className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-blue-800 flex items-center gap-2 transition-all">
                <span className="material-symbols-outlined text-[18px]">add</span> Add Student
            </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl mb-6 shadow-sm flex items-center gap-3">
          <span className="material-symbols-outlined">error</span> {error}
        </div>
      )}

      {/* Filter Bar (Extruded Level 1) */}
      <div className={`${cardStyle} rounded-xl p-5 mb-6 flex flex-wrap items-end gap-4`}>
        <div className="flex-1 min-w-[240px]">
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Search</label>
          <div className="relative focus-within:ring-2 focus-within:ring-blue-600 rounded-lg border border-slate-300 bg-white shadow-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input 
              className="w-full bg-transparent border-none focus:ring-0 py-2 pl-10 pr-3 text-sm text-slate-900 rounded-lg placeholder-slate-400" 
              placeholder="Name, ID, or Guardian" 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>
        <div className="w-44">
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Grade / Class</label>
          <select 
            className="w-full border border-slate-300 rounded-lg bg-white shadow-sm py-2 px-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            value={selectedClass}
            onChange={(e) => { setSelectedClass(e.target.value); setSelectedSection(''); }}
          >
            <option value="">All Grades</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} {c.section}</option>
            ))}
          </select>
        </div>
        <div className="w-36">
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Section</label>
          <select 
            className="w-full border border-slate-300 rounded-lg bg-white shadow-sm py-2 px-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 disabled:bg-slate-50"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={!selectedClass || sections.length === 0}
          >
            <option value="">All Sections</option>
            {sections.map(s => (
              <option key={s} value={s}>Section {s}</option>
            ))}
          </select>
        </div>
        <div className="w-36">
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Status</label>
          <select 
            className="w-full border border-slate-300 rounded-lg bg-white shadow-sm py-2 px-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="GRADUATED">Graduated</option>
          </select>
        </div>
        <div className="flex gap-2">
            <button onClick={handleSearch} className="px-5 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-colors">
              Apply
            </button>
            <button onClick={handleReset} className="px-5 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors shadow-sm">
              Reset
            </button>
        </div>
      </div>

      {/* Data Table (Extruded Level 1) */}
      <div className={`${cardStyle} rounded-xl overflow-hidden flex flex-col`}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
          <h3 className="text-xl font-semibold text-slate-900">Enrolled Students</h3>
          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 tracking-wide">{totalStudents || students.length} Total</span>
        </div>
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
            </div>
          ) : students.length === 0 ? (
             <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">group_off</span>
                <p className="text-slate-500 text-lg font-medium">No students found matching your criteria</p>
             </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Profile</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Number</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Class &amp; Section</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Guardian</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {students.map((student, idx) => (
                  <tr key={student.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${idx % 2 === 0 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                            {student.firstName?.[0] || '?'}{student.lastName?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{student.firstName} {student.lastName}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">{student.studentId}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{student.className || 'Unassigned'}</p>
                      <p className="text-slate-500 text-xs mt-0.5">Section {student.section || student.sectionName || 'A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900 font-medium">{student.parentName || 'Not Provided'}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{student.parentPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[10px] tracking-wider uppercase ${
                          student.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 
                          student.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-blue-600 transition-colors p-1" title="View Details">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 ml-2" title="Edit Student">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(student.id)} className="text-slate-400 hover:text-red-600 transition-colors p-1 ml-2" title="Deactivate">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center">
            <span className="text-sm text-slate-500">
                Showing Page {currentPage + 1} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
                <button 
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(p => p - 1)}
                className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                    i >= currentPage - 2 && i <= currentPage + 2 && (
                        <button 
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`w-8 h-8 rounded flex items-center justify-center text-sm font-semibold transition-colors ${
                                currentPage === i ? 'bg-blue-700 text-white shadow-sm' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}>
                            {i + 1}
                        </button>
                    )
                ))}

                <button 
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage(p => p + 1)}
                className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
            </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default StudentsPage;