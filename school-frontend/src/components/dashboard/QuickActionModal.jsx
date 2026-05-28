import React, { useState, useEffect } from 'react';
import { X, User, Shield, Briefcase, Landmark, BookOpen, Truck, Home, Megaphone, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';

const QuickActionModal = ({ isOpen, onClose, actionType, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Unified form state
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({});
      setSuccess(false);
      setErrorMsg('');
    }
  }, [isOpen, actionType]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      parent: {
        ...prev.parent,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      let endpoint = '';
      let payload = { ...formData };

      switch (actionType) {
        case 'ADD_STUDENT':
          endpoint = '/students';
          // Ensure structure for parent
          if (!payload.parent) {
            payload.parent = {
              firstName: payload.parentFirstName || 'ParentName',
              phone: payload.parentPhone || '9876543210',
              email: payload.parentEmail || 'parent@schoolos.edu'
            };
          }
          payload.classRoomId = parseInt(payload.classRoomId || '1');
          break;
        case 'ADD_STAFF':
        case 'ADD_TEACHER':
          endpoint = '/hrms/staff';
          payload.branchId = parseInt(payload.branchId || '1');
          payload.roleId = actionType === 'ADD_TEACHER' ? 2 : parseInt(payload.roleId || '3');
          payload.departmentId = parseInt(payload.departmentId || '1');
          payload.aadhaarNumber = payload.aadhaarNumber || '123456789012';
          payload.panNumber = payload.panNumber || 'ABCDE1234F';
          payload.joiningDate = payload.joiningDate || new Date().toISOString().split('T')[0];
          payload.employmentType = payload.employmentType || 'FULL_TIME';
          break;
        case 'COLLECT_FEES':
          endpoint = '/fees/pay';
          payload.studentId = parseInt(payload.studentId || '1');
          payload.amount = parseFloat(payload.amount || '0');
          payload.paymentDate = payload.paymentDate || new Date().toISOString().split('T')[0];
          payload.paymentMethod = payload.paymentMethod || 'CASH';
          payload.month = payload.month || 'May 2026';
          break;
        case 'CREATE_INVOICE':
          endpoint = '/fees/pay';
          payload.studentId = parseInt(payload.studentId || '1');
          payload.amount = parseFloat(payload.amount || '0');
          payload.paymentDate = payload.paymentDate || new Date().toISOString().split('T')[0];
          payload.paymentMethod = 'ONLINE';
          payload.status = 'PENDING';
          payload.month = payload.month || 'May 2026';
          break;
        case 'RUN_PAYROLL':
          endpoint = '/hrms/payroll/run';
          payload.month = parseInt(payload.month || '5');
          payload.year = parseInt(payload.year || '2026');
          payload.branchId = parseInt(payload.branchId || '1');
          break;
        case 'MARK_ATTENDANCE':
          endpoint = '/attendance/bulk';
          payload.classId = parseInt(payload.classId || '1');
          payload.date = payload.date || new Date().toISOString().split('T')[0];
          payload.records = [
            {
              studentId: parseInt(payload.studentId || '1'),
              status: payload.status || 'PRESENT'
            }
          ];
          break;
        case 'ADD_EXPENSE':
          endpoint = '/finance/expenses';
          payload.branch = { id: parseInt(payload.branchId || '1') };
          payload.amount = parseFloat(payload.amount || '0');
          payload.expenseNo = 'EXP-' + Date.now();
          payload.expenseDate = payload.expenseDate || new Date().toISOString().split('T')[0];
          payload.category = payload.category || 'OFFICE';
          payload.status = 'PAID';
          break;
        case 'SEND_NOTICE':
          endpoint = '/announcements';
          payload.audience = payload.audience || 'ALL';
          break;
        case 'REGISTER_VEHICLE':
          const brId = payload.branchId || '1';
          endpoint = `/transport/vehicles/branch/${brId}`;
          payload.vehicleType = payload.vehicleType || 'BUS';
          payload.seatingCapacity = parseInt(payload.seatingCapacity || '40');
          break;
        case 'ALLOCATE_HOSTEL':
          endpoint = '/hostel/allocations';
          payload.studentId = parseInt(payload.studentId || '1');
          payload.bed = { id: parseInt(payload.bedId || '1') };
          payload.academicYear = { id: 1 };
          payload.allocationDate = payload.allocationDate || new Date().toISOString().split('T')[0];
          break;
        case 'CREATE_EXAM':
          endpoint = '/exams';
          payload.classRoomId = parseInt(payload.classRoomId || '1');
          payload.maxMarks = parseFloat(payload.maxMarks || '100');
          payload.minMarks = parseFloat(payload.minMarks || '40');
          payload.examDate = payload.examDate || new Date().toISOString().split('T')[0];
          payload.academicYear = '2025-2026';
          payload.subjectId = parseInt(payload.subjectId || '1');
          break;
        default:
          throw new Error('Unsupported action');
      }

      await api.post(endpoint, payload);
      setSuccess(true);
      if (onComplete) onComplete();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Action execution failed. Please verify fields.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (actionType) {
      case 'ADD_STUDENT':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">First Name</label>
                <input required type="text" name="firstName" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Last Name</label>
                <input required type="text" name="lastName" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Email</label>
                <input required type="email" name="email" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Phone</label>
                <input required type="text" name="phone" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Date of Birth</label>
                <input required type="date" name="dateOfBirth" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Gender</label>
                <select name="gender" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500">
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-3">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Parent Name</label>
                <input required type="text" name="parentFirstName" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Classroom Assignment</label>
                <select required name="classRoomId" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500">
                  <option value="">Select Class</option>
                  <option value="1">Class 1-A</option>
                  <option value="2">Class 5-B</option>
                  <option value="3">Class 10-A</option>
                </select>
              </div>
            </div>
          </>
        );
      case 'ADD_STAFF':
      case 'ADD_TEACHER':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">First Name</label>
                <input required type="text" name="firstName" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Last Name</label>
                <input required type="text" name="lastName" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Email</label>
                <input required type="email" name="email" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Phone</label>
                <input required type="text" name="phone" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Date of Birth</label>
                <input required type="date" name="dateOfBirth" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Gender</label>
                <select required name="gender" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500">
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Department</label>
                <select name="departmentId" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500">
                  <option value="1">Academics</option>
                  <option value="2">Finance</option>
                  <option value="3">Operations</option>
                </select>
              </div>
              {actionType === 'ADD_STAFF' && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Role Type</label>
                  <select name="roleId" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500">
                    <option value="3">HR Staff</option>
                    <option value="4">Finance Officer</option>
                    <option value="5">Transport Warden</option>
                  </select>
                </div>
              )}
            </div>
          </>
        );
      case 'COLLECT_FEES':
      case 'CREATE_INVOICE':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Student Record ID</label>
                <input required type="number" name="studentId" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Fee Amount (₹)</label>
                <input required type="number" name="amount" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Billing Month</label>
                <input required type="text" name="month" placeholder="e.g. May 2026" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              {actionType === 'COLLECT_FEES' && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Payment Method</label>
                  <select name="paymentMethod" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500">
                    <option value="CASH">Cash Payment</option>
                    <option value="ONLINE">Online Gateway</option>
                    <option value="CHEQUE">Cheque Draft</option>
                  </select>
                </div>
              )}
            </div>
          </>
        );
      case 'RUN_PAYROLL':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Month (1-12)</label>
              <input required type="number" min="1" max="12" name="month" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Year</label>
              <input required type="number" name="year" defaultValue="2026" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
        );
      case 'MARK_ATTENDANCE':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Class ID</label>
                <select name="classId" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500">
                  <option value="1">Class 5-B</option>
                  <option value="2">Class 8-A</option>
                  <option value="3">Class 10-B</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Date</label>
                <input required type="date" name="date" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Student Record ID</label>
                <input required type="number" name="studentId" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Status</label>
                <select name="status" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500">
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                </select>
              </div>
            </div>
          </>
        );
      case 'ADD_EXPENSE':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Expense Category</label>
                <select name="category" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500">
                  <option value="OFFICE">Office Supplies</option>
                  <option value="SALARY">Staff Salaries</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="FUEL">Fuel Fleet</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Expense Amount (₹)</label>
                <input required type="number" name="amount" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Payment Mode</label>
                <select name="paymentMode" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500">
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CARD">Credit Card</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Expense Date</label>
                <input required type="date" name="expenseDate" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </>
        );
      case 'SEND_NOTICE':
        return (
          <>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Bulletin Title</label>
              <input required type="text" name="title" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Message Content</label>
              <textarea required name="content" rows="3" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"></textarea>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Target Audience</label>
              <select name="audience" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500">
                <option value="ALL">All Groups</option>
                <option value="TEACHERS">Teachers Only</option>
                <option value="STUDENTS">Students Only</option>
              </select>
            </div>
          </>
        );
      case 'REGISTER_VEHICLE':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Plate Number</label>
                <input required type="text" name="vehicleNumber" placeholder="e.g. MH12AB1234" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Vehicle Type</label>
                <select name="vehicleType" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500">
                  <option value="BUS">Bus</option>
                  <option value="VAN">Van</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Seating Capacity</label>
                <input required type="number" name="seatingCapacity" defaultValue="40" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Branch ID</label>
                <input required type="number" name="branchId" defaultValue="1" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </>
        );
      case 'ALLOCATE_HOSTEL':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Student Record ID</label>
                <input required type="number" name="studentId" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Hostel Bed ID</label>
                <input required type="number" name="bedId" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Allocation Date</label>
              <input required type="date" name="allocationDate" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
            </div>
          </>
        );
      case 'CREATE_EXAM':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Exam Name</label>
                <input required type="text" name="name" placeholder="e.g. Final Exams" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Subject Record ID</label>
                <input required type="number" name="subjectId" defaultValue="1" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Classroom ID</label>
                <input required type="number" name="classRoomId" defaultValue="1" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Exam Date</label>
                <input required type="date" name="examDate" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    return actionType?.replace(/_/g, ' ');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-slate-50 rounded-lg text-slate-400">
          <X size={18} />
        </button>

        <h3 className="text-sm font-black text-slate-800 mb-2 uppercase tracking-wide flex items-center gap-2">
          <Landmark size={18} className="text-blue-600" />
          {getTitle()}
        </h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-6">
          Operational Direct-Persistence Center
        </p>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-emerald-500 flex-1">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-sm font-black">Action Executed & Persisted Successfully</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
            {errorMsg && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-bold leading-snug">
                {errorMsg}
              </div>
            )}

            {renderForm()}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Saving to MySQL...
                </>
              ) : (
                'Confirm & Execute Action'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default React.memo(QuickActionModal);
