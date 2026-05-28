import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Search, Filter } from 'lucide-react';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useToast } from '../../../hooks/useToast';
import { getHostelBlocks, getAllocations, createHostelAttendanceSession, markHostelAttendance } from '../../../api/hostelApi';

export default function HostelAttendance() {
  const [blocks, setBlocks] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionType, setSessionType] = useState('NIGHT');
  
  // local attendance state: studentId -> status (PRESENT/ABSENT/ON_LEAVE)
  const [attendanceMap, setAttendanceMap] = useState({});
  const toast = useToast();

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const branchId = 1;
      const [blocksData, allocData] = await Promise.all([
        getHostelBlocks(branchId),
        getAllocations()
      ]);
      setBlocks(blocksData || []);
      setAllocations((allocData || []).filter(a => a.status === 'ACTIVE'));
      if (blocksData?.length > 0) {
        setSelectedBlock(blocksData[0].id.toString());
      }
    } catch (error) {
      toast.error('Failed to load hostel data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleMarkAll = (status) => {
    const newMap = { ...attendanceMap };
    filteredAllocations.forEach(alloc => {
      newMap[alloc.student.id] = status;
    });
    setAttendanceMap(newMap);
  };

  const handleToggle = (studentId, status) => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    try {
      // 1. Create Session
      const session = await createHostelAttendanceSession(1, {
        date: selectedDate,
        type: sessionType,
        blockId: parseInt(selectedBlock),
        conductedById: 1 // MVP mock user
      });

      // 2. Mark logs
      const logPromises = filteredAllocations.map(alloc => {
        const status = attendanceMap[alloc.student.id] || 'PRESENT';
        return markHostelAttendance(session.id, {
          studentId: alloc.student.id,
          status: status,
          remarks: ''
        });
      });

      await Promise.all(logPromises);
      toast.success('Attendance saved successfully');
    } catch (error) {
      toast.error('Failed to save attendance');
    }
  };

  const filteredAllocations = allocations.filter(a => {
    if (!selectedBlock) return true;
    return a.bed?.room?.floor?.block?.id?.toString() === selectedBlock;
  });

  return (
    <>
      <PageHeader
        title="Hostel Attendance"
        subtitle="Track daily morning and night roll calls"
        actions={
          <button
            onClick={handleSaveAttendance}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
          >
            <ClipboardCheck size={16} /> Save Roll Call
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="flex flex-wrap gap-2 items-center w-full">
          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
            <Filter size={12} />
            <span className="text-[11px] font-bold uppercase tracking-wider">Filters:</span>
          </div>

          <select 
            value={selectedBlock} 
            onChange={e => setSelectedBlock(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white cursor-pointer"
          >
            <option value="">Select Block</option>
            {blocks.map(b => <option key={b.id} value={b.id}>{b.blockName}</option>)}
          </select>

          <input 
            type="date" 
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white cursor-pointer" 
          />

          <select 
            value={sessionType} 
            onChange={e => setSessionType(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white cursor-pointer"
          >
            <option value="MORNING">Morning Roll Call</option>
            <option value="NIGHT">Night Roll Call</option>
          </select>

          <div className="ml-auto flex gap-2">
             <button onClick={() => handleMarkAll('PRESENT')} className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">Mark All Present</button>
             <button onClick={() => handleMarkAll('ABSENT')} className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors">Mark All Absent</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hidden sm:block">
        {loading ? (
          <div className="py-20 text-center"><LoadingSpinner /></div>
        ) : filteredAllocations.length === 0 ? (
          <div className="text-center py-20">
             <ClipboardCheck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
             <p className="text-slate-500 font-medium">Select a block with active allocations.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Student Info</th>
                <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Room / Bed</th>
                <th className="text-center px-6 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAllocations.map(alloc => {
                const status = attendanceMap[alloc.student.id] || 'PRESENT';
                return (
                  <tr key={alloc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{alloc.student.firstName} {alloc.student.lastName}</span>
                        <span className="text-xs text-indigo-600 font-mono font-bold mt-0.5">{alloc.student.studentId}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                       <span className="font-bold text-slate-800">Room {alloc.bed?.room?.roomNumber} • Bed {alloc.bed?.bedNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleToggle(alloc.student.id, 'PRESENT')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              status === 'PRESENT' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            PRESENT
                          </button>
                          <button 
                            onClick={() => handleToggle(alloc.student.id, 'ABSENT')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              status === 'ABSENT' ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            ABSENT
                          </button>
                          <button 
                            onClick={() => handleToggle(alloc.student.id, 'ON_LEAVE')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              status === 'ON_LEAVE' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            LEAVE
                          </button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
         {loading ? (
            <div className="py-10 text-center"><LoadingSpinner /></div>
         ) : filteredAllocations.map(alloc => {
            const status = attendanceMap[alloc.student.id] || 'PRESENT';
            return (
              <div key={alloc.id} className={`bg-white rounded-2xl border p-4 shadow-sm ${
                status === 'PRESENT' ? 'border-emerald-200' : status === 'ABSENT' ? 'border-rose-200' : 'border-amber-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{alloc.student.firstName} {alloc.student.lastName}</span>
                    <span className="text-[11px] font-bold text-indigo-600 font-mono mt-1">{alloc.student.studentId} • Room {alloc.bed?.room?.roomNumber}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleToggle(alloc.student.id, 'PRESENT')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${status === 'PRESENT' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>Present</button>
                  <button onClick={() => handleToggle(alloc.student.id, 'ABSENT')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${status === 'ABSENT' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}>Absent</button>
                  <button onClick={() => handleToggle(alloc.student.id, 'ON_LEAVE')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${status === 'ON_LEAVE' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`}>Leave</button>
                </div>
              </div>
            );
         })}
      </div>
    </>
  );
}
