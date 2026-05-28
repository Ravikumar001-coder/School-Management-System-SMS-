import React, { useState, useEffect } from 'react';
import { RefreshCw, X, Search, ChevronRight } from 'lucide-react';
import { getBranchInfrastructureMap, transferRoom } from '../../../../api/hostelApi';

export default function TransferModal({ allocation, branchId, onClose, onSuccess }) {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBed, setSelectedBed] = useState(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMap();
  }, [branchId]);

  const fetchMap = async () => {
    try {
      const data = await getBranchInfrastructureMap(branchId);
      setMapData(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!selectedBed || !reason.trim()) return;
    try {
      setSubmitting(true);
      await transferRoom(allocation.id, { newBedId: selectedBed.id, reason });
      onSuccess();
    } catch (e) {
      console.error(e);
      alert('Transfer failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <RefreshCw className="text-indigo-600 h-5 w-5" />
              Transfer Student Room
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Moving {allocation.student?.firstName} {allocation.student?.lastName} from Bed {allocation.bed?.bedNumber}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex bg-slate-50">
          {/* Left Panel: Available Beds Map */}
          <div className="w-2/3 border-r border-slate-200 overflow-y-auto p-5">
            <h3 className="font-semibold text-slate-700 mb-4">Select Target Bed</h3>
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-slate-200 rounded w-full"></div>
                <div className="h-10 bg-slate-200 rounded w-full"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {mapData.map(block => (
                  <div key={block.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-3">{block.blockName} ({block.genderType})</h4>
                    <div className="space-y-4">
                      {block.floors?.map(floor => (
                        <div key={floor.id} className="pl-4 border-l-2 border-indigo-100">
                          <h5 className="text-sm font-semibold text-slate-600 mb-2">{floor.floorName}</h5>
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {floor.rooms?.map(room => (
                              <div key={room.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-bold text-slate-700">Rm {room.roomNumber}</span>
                                  <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                                    {room.availableBeds}/{room.capacity}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {room.beds?.map(bed => {
                                    const isSelected = selectedBed?.id === bed.id;
                                    return (
                                      <button
                                        key={bed.id}
                                        type="button"
                                        disabled={bed.isOccupied}
                                        onClick={() => setSelectedBed({ ...bed, roomNumber: room.roomNumber, blockName: block.blockName })}
                                        className={`px-2 py-1 text-xs rounded border font-medium transition-colors ${
                                          bed.isOccupied ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' :
                                          isSelected ? 'bg-indigo-600 text-white border-indigo-700 shadow-inner' :
                                          'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                                        }`}
                                      >
                                        {bed.bedNumber}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel: Transfer Form */}
          <div className="w-1/3 p-5 flex flex-col bg-white">
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-700 mb-3">Transfer Details</h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Current Bed:</span>
                    <span className="font-semibold text-slate-800">Rm {allocation.bed?.room?.roomNumber} • {allocation.bed?.bedNumber}</span>
                  </div>
                  <div className="flex justify-center text-indigo-400 py-1">
                    <ChevronRight className="h-5 w-5 rotate-90" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">New Bed:</span>
                    {selectedBed ? (
                      <span className="font-bold text-indigo-700">Rm {selectedBed.roomNumber} • {selectedBed.bedNumber}</span>
                    ) : (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">Select from map</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Transfer Reason *</label>
                <textarea
                  required
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="e.g., Medical requirement, Disciplinary action..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                />
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100">
              <button
                disabled={!selectedBed || !reason.trim() || submitting}
                onClick={handleTransfer}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? 'Transferring...' : 'Confirm Transfer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
