// src/pages/admin/StudentsPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch students on mount and page change
  useEffect(() => {
    fetchStudents();
  }, [currentPage]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/students?page=${currentPage}&size=10&sortBy=firstName`
      );
      setStudents(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  // Search handler
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchStudents();
      return;
    }
    try {
      const response = await api.get(`/students/search?keyword=${searchTerm}`);
      setStudents(response.data);
    } catch (err) {
      setError('Search failed');
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this student?')) {
      return;
    }
    try {
      await api.delete(`/students/${id}`);
      fetchStudents(); // Refresh list
    } catch (err) {
      setError('Failed to delete student');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 
                        border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Students</h1>
          <p className="text-gray-500">Manage all student records</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg 
                     hover:bg-blue-700 transition flex items-center gap-2"
        >
          ➕ Add Student
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          🔍 Search
        </button>
        <button
          onClick={() => { setSearchTerm(''); fetchStudents(); }}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Clear
        </button>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 text-gray-600 font-semibold">
                Student ID
              </th>
              <th className="text-left p-4 text-gray-600 font-semibold">
                Name
              </th>
              <th className="text-left p-4 text-gray-600 font-semibold">
                Email
              </th>
              <th className="text-left p-4 text-gray-600 font-semibold">
                Class
              </th>
              <th className="text-left p-4 text-gray-600 font-semibold">
                Status
              </th>
              <th className="text-left p-4 text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr 
                key={student.id} 
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 text-sm font-mono text-blue-600">
                  {student.studentId}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 
                                    flex items-center justify-center
                                    text-blue-600 font-semibold">
                      {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{student.parentName}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{student.email}</td>
                <td className="p-4">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 
                                   rounded-full text-xs font-medium">
                    {student.className}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${student.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'}`}>
                    {student.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 
                                 text-sm font-medium"
                    >
                      View
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800 
                                 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-600 hover:text-red-800 
                                 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {students.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">👥</div>
            <p className="text-gray-500 text-lg">No students found</p>
            <p className="text-gray-400 text-sm">
              Add your first student to get started
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-10 h-10 rounded-lg font-medium transition
                ${currentPage === i 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentsPage;