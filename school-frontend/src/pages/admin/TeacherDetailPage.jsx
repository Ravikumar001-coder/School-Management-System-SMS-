import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { teacherApi } from '../../api/teacherApi';
import { fileApi } from '../../api/fileApi';

const InfoRow = ({ label, value }) => (
  <div className="flex py-3 border-b last:border-0">
    <span className="w-40 text-sm text-gray-500 flex-shrink-0">{label}</span>
    <span className="text-sm font-medium text-gray-800">{value || '-'} </span>
  </div>
);

const TeacherDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    teacherApi.getById(id)
      .then(res => setTeacher(res.data?.data || res.data))
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to load teacher details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><LoadingSpinner /></>;

  if (error) {
    return (
      <>
        <p className="text-red-500">{error}</p>
      </>
    );
  }

  if (!teacher) {
    return (
      <>
        <p className="text-red-500">Teacher not found.</p>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/admin/teachers')}
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          ← Back to Teachers
        </button>
        <button
          onClick={() => navigate(`/admin/teachers/${id}/edit`)}
          className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-green-700 font-medium"
        >
          Edit Teacher
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-3xl font-bold">
            {teacher.profilePhoto ? (
              <img
                src={fileApi.toPublicUrl(teacher.profilePhoto)}
                alt={`${teacher.firstName || ''} ${teacher.lastName || ''}`.trim()}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <>{teacher.firstName?.[0]}{teacher.lastName?.[0]}</>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {teacher.firstName} {teacher.lastName}
            </h1>
            <p className="text-gray-500">{teacher.email}</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                {teacher.employeeId}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${teacher.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {teacher.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-gray-700 mb-4">Professional Details</h2>
          <InfoRow label="Specialization" value={teacher.specialization} />
          <InfoRow label="Qualification" value={teacher.qualification} />
          <InfoRow label="Joining Date" value={teacher.joiningDate} />
          <InfoRow label="Salary" value={teacher.salary ? `INR ${teacher.salary.toLocaleString()}` : '-'} />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-gray-700 mb-4">Personal Details</h2>
          <InfoRow label="Phone" value={teacher.phone} />
          <InfoRow label="Gender" value={teacher.gender} />
          <InfoRow label="Date of Birth" value={teacher.dateOfBirth} />
          <InfoRow label="Address" value={teacher.address} />
        </div>
      </div>
    </>
  );
};

export default TeacherDetailPage;
