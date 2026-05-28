import React, { useState, useEffect } from 'react';
import { BedDouble, Plus, Search, Filter, RefreshCw, LogOut } from 'lucide-react';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useToast } from '../../../hooks/useToast';
import { getAllocations } from '../../../api/hostelApi';
import AllocationWizard from './components/AllocationWizard';
import TransferModal from './components/TransferModal';
import VacateModal from './components/VacateModal';

export default function RoomAllocation() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'WIZARD', 'TRANSFER', 'VACATE', null
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const toast = useToast();

  const branchId = 1; // Assuming branch 1 for MVP

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const data = await getAllocations();
      setAllocations(data || []);
    } catch (error) {
      toast.error('Failed to load allocations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const handleModalSuccess = (msg) => {
    toast.success(msg);
    setActiveModal(null);
    setSelectedAllocation(null);
    fetchAllocations();
  };

  const openTransfer = (alloc) => {
    setSelectedAllocation(alloc);
    setActiveModal('TRANSFER');
  };

  const openVacate = (alloc) => {
    setSelectedAllocation(alloc);
    setActiveModal('VACATE');
  };

  return (
    <>
      <PageHeader
        title="Hostel Room Allocation"
        subtitle="Enterprise-grade room assignments, transfers, and checkout workflows"
        actions={
          <button
            onClick={() => setActiveModal('WIZARD')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
          >
            <Plus size={18} /> New Allocation
          </button>
        }
      />

      {/* Stats row for enterprise feel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Active Allocations</p>
            <p className="text-2xl font-bold text-slate-800">{allocations.filter(a => a.status === 'ACTIVE').length}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <BedDouble size={24} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Vacated</p>
            <p className="text-2xl font-bold text-slate-800">{allocations.filter(a => a.status === 'VACATED').length}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
            <LogOut size={24} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Recent Transfers</p>
            <p className="text-2xl font-bold text-slate-800">{allocations.filter(a => a.status === 'TRANSFERRED' || a.transferReason).length}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <RefreshCw size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center"><LoadingSpinner /></div>
        ) : allocations.length === 0 ? (
          <div className="text-center py-20">
            <BedDouble className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No active allocations. Click New Allocation to assign a room.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Room & Bed</th>
                  <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Type / Dates</th>
                  <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Lifecycle Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allocations.map((alloc) => (
                  <tr key={alloc.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{alloc.student?.firstName} {alloc.student?.lastName}</span>
                        <span className="text-[11px] text-indigo-600 font-mono font-bold mt-0.5">{alloc.student?.studentId}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">Rm {alloc.bed?.room?.roomNumber} • Bed {alloc.bed?.bedNumber}</span>
                        <span className="text-[11px] text-slate-500 font-medium mt-0.5">{alloc.bed?.room?.floor?.block?.blockName}</span>
                      </div>
                      {alloc.previousRoom && (
                        <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-1 py-0.5 rounded mt-1 inline-block">
                          Moved from: {alloc.previousRoom}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-700 font-bold text-xs">{alloc.allocationType || 'REGULAR'}</span>
                        <span className="text-[11px] text-slate-500 mt-0.5">{alloc.allocationDate} to {alloc.expectedCheckoutDate || 'Ongoing'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-[4px] text-[10px] font-bold tracking-wider uppercase border ${
                        alloc.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        alloc.status === 'VACATED' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {alloc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {alloc.status === 'ACTIVE' && (
                          <>
                            <button onClick={() => openTransfer(alloc)} className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                              <RefreshCw size={12}/> Transfer
                            </button>
                            <button onClick={() => openVacate(alloc)} className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors">
                              <LogOut size={12}/> Vacate
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activeModal === 'WIZARD' && (
        <AllocationWizard 
          branchId={branchId} 
          onClose={() => setActiveModal(null)} 
          onSuccess={() => handleModalSuccess('Room allocated successfully!')} 
        />
      )}

      {activeModal === 'TRANSFER' && selectedAllocation && (
        <TransferModal 
          allocation={selectedAllocation} 
          branchId={branchId} 
          onClose={() => setActiveModal(null)} 
          onSuccess={() => handleModalSuccess('Student transferred successfully!')} 
        />
      )}

      {activeModal === 'VACATE' && selectedAllocation && (
        <VacateModal 
          allocation={selectedAllocation} 
          onClose={() => setActiveModal(null)} 
          onSuccess={() => handleModalSuccess('Room vacated successfully!')} 
        />
      )}
    </>
  );
}
