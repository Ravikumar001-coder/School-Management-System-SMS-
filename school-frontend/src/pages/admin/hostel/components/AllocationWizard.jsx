import React, { useState, useEffect } from 'react';
import { BedDouble, X, Search, CheckCircle, XCircle, AlertTriangle, ChevronRight, Check } from 'lucide-react';
import { getBranchInfrastructureMap, checkStudentEligibility, allocateRoom, getMessPlans } from '../../../../api/hostelApi';
import api from '../../../../api/axios'; // using direct api for student search

export default function AllocationWizard({ branchId, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Student
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [eligibility, setEligibility] = useState(null);

  // Step 2: Map
  const [mapData, setMapData] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);

  // Step 3: Metadata
  const [messPlans, setMessPlans] = useState([]);
  const [formData, setFormData] = useState({
    academicYearId: 1, // Defaulting to 1 for MVP
    allocationType: 'REGULAR',
    expectedCheckoutDate: '',
    messPlanId: '',
    lockerAssigned: false,
    rfidCardAssigned: false,
    transportLinked: false,
    adminApproval: false,
    parentConsent: false,
    guardianApproval: false,
    medicalNotes: '',
    specialNeeds: '',
    emergencyContact: '',
    notes: ''
  });

  useEffect(() => {
    if (step === 2 && mapData.length === 0) fetchMap();
    if (step === 3 && messPlans.length === 0) fetchPlans();
  }, [step]);

  const fetchMap = async () => {
    try {
      setLoading(true);
      const data = await getBranchInfrastructureMap(branchId);
      setMapData(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchPlans = async () => {
    try {
      const data = await getMessPlans(branchId);
      setMessPlans(data || []);
    } catch (e) { console.error(e); }
  };

  // --- Step 1 Actions ---
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/students/search?keyword=${searchQuery}`);
      setSearchResults(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectStudent = async (student) => {
    setSelectedStudent(student);
    setSearchResults([]);
    try {
      setLoading(true);
      const data = await checkStudentEligibility(student.id);
      setEligibility(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // --- Final Submission ---
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const payload = {
        studentId: selectedStudent.id,
        bedId: selectedBed.id,
        ...formData,
        messPlanId: formData.messPlanId ? parseInt(formData.messPlanId) : null
      };
      await allocateRoom(payload);
      onSuccess();
    } catch (e) {
      alert('Allocation Failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 lg:p-10">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BedDouble className="text-indigo-600 h-6 w-6" />
              Guided Room Allocation
            </h2>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className={`px-2 py-1 rounded ${step >= 1 ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>1. Student</span>
              <ChevronRight size={16} className="text-slate-300"/>
              <span className={`px-2 py-1 rounded ${step >= 2 ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>2. Select Bed</span>
              <ChevronRight size={16} className="text-slate-300"/>
              <span className={`px-2 py-1 rounded ${step >= 3 ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>3. Metadata</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50/30">
          
          {/* STEP 1: STUDENT */}
          {step === 1 && (
            <div className="p-8 max-w-3xl mx-auto space-y-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Search Student</h3>
                <div className="flex gap-2 relative">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search by Name, Email, or Admission No..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <button onClick={handleSearch} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Search</button>
                  
                  {/* Dropdown Results */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
                      {searchResults.map(s => (
                        <div key={s.id} onClick={() => selectStudent(s)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-800">{s.firstName} {s.lastName}</span>
                            <div className="text-xs text-slate-500">{s.studentId} • {s.email}</div>
                          </div>
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Select</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedStudent && eligibility && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8">
                  {/* Student Card */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                      <div className="h-16 w-16 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full text-2xl font-bold">
                        {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                        <p className="text-sm font-mono text-indigo-600">{selectedStudent.studentId}</p>
                        <p className="text-sm text-slate-500">Gender: {eligibility.gender}</p>
                      </div>
                    </div>
                    {eligibility.medicalConditions && (
                      <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg text-sm text-rose-800">
                        <span className="font-bold">Medical Alert:</span> {eligibility.medicalConditions}
                      </div>
                    )}
                  </div>

                  {/* Eligibility Checklist */}
                  <div className="flex-1 bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-700 mb-4">Eligibility Check</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Active Allocation</span>
                        {eligibility.hasActiveAllocation ? <XCircle className="text-rose-500 h-5 w-5"/> : <CheckCircle className="text-emerald-500 h-5 w-5"/>}
                      </li>
                      <li className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Dues Cleared</span>
                        {eligibility.outstandingDues > 0 ? <span className="font-bold text-rose-600">₹{eligibility.outstandingDues} Pending</span> : <CheckCircle className="text-emerald-500 h-5 w-5"/>}
                      </li>
                    </ul>
                    
                    {eligibility.warnings?.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {eligibility.warnings.map((w, i) => (
                          <div key={i} className="flex gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                            <AlertTriangle size={14} className="shrink-0 mt-0.5" /> {w}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: BED SELECTION */}
          {step === 2 && (
            <div className="flex h-full">
              {/* Left Panel: Map */}
              <div className="w-2/3 border-r border-slate-200 p-6 overflow-y-auto">
                <h3 className="font-bold text-slate-800 mb-6 text-xl">Visual Bed Layout</h3>
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-20 bg-slate-200 rounded-xl w-full"></div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {mapData.map(block => (
                      <div key={block.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                          <h4 className="font-bold text-lg text-slate-800">{block.blockName}</h4>
                          <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-1 rounded">{block.genderType}</span>
                        </div>
                        <div className="space-y-6">
                          {block.floors?.map(floor => (
                            <div key={floor.id} className="pl-4 border-l-4 border-indigo-100">
                              <h5 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">{floor.floorName}</h5>
                              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {floor.rooms?.map(room => {
                                  const isFull = room.availableBeds === 0;
                                  const isAlmostFull = room.availableBeds === 1 && room.capacity > 1;
                                  return (
                                    <div key={room.id} className={`border rounded-xl p-3 ${isFull ? 'bg-rose-50/50 border-rose-100' : isAlmostFull ? 'bg-amber-50/50 border-amber-100' : 'bg-emerald-50/30 border-emerald-100'}`}>
                                      <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-slate-700">Room {room.roomNumber}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isFull ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                          {room.availableBeds}/{room.capacity}
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        {room.beds?.map(bed => {
                                          const isSelected = selectedBed?.id === bed.id;
                                          return (
                                            <button
                                              key={bed.id}
                                              disabled={bed.isOccupied}
                                              onClick={() => setSelectedBed({ ...bed, roomNumber: room.roomNumber, blockName: block.blockName })}
                                              className={`relative flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${
                                                bed.isOccupied ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' :
                                                isSelected ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg transform scale-105 z-10' :
                                                'bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer'
                                              }`}
                                              title={bed.isOccupied ? `Occupied by: ${bed.occupantName}` : 'Available'}
                                            >
                                              <BedDouble size={20} className="mb-1" />
                                              <span className="text-[10px] font-bold">{bed.bedNumber}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Right Panel: Selection Info */}
              <div className="w-1/3 bg-white p-6 border-l border-slate-200 flex flex-col">
                <h3 className="font-bold text-slate-800 mb-6 text-xl">Allocation Target</h3>
                {selectedBed ? (
                  <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-indigo-100 pb-3">
                      <span className="text-sm text-indigo-800 font-medium">Block</span>
                      <span className="font-bold text-indigo-900">{selectedBed.blockName}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-indigo-100 pb-3">
                      <span className="text-sm text-indigo-800 font-medium">Room Number</span>
                      <span className="font-bold text-indigo-900">{selectedBed.roomNumber}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-indigo-100 pb-3">
                      <span className="text-sm text-indigo-800 font-medium">Bed Selection</span>
                      <span className="font-bold text-white bg-indigo-600 px-2 py-1 rounded text-sm">{selectedBed.bedNumber}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center">
                    <BedDouble size={48} className="mb-4 text-slate-200" />
                    <p>Select an available bed from the map to proceed.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: METADATA */}
          {step === 3 && (
            <div className="p-8 max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
                
                {/* Summary Banner */}
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-600"><Check size={20}/></div>
                    <div>
                      <h4 className="font-bold text-emerald-900">Allocation Summary</h4>
                      <p className="text-xs text-emerald-700">{selectedStudent.firstName} {selectedStudent.lastName} ➔ Room {selectedBed.roomNumber} ({selectedBed.bedNumber})</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Col */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Allocation Type</label>
                      <select value={formData.allocationType} onChange={e => setFormData({...formData, allocationType: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500">
                        <option value="REGULAR">Regular (Full Year)</option>
                        <option value="TEMPORARY">Temporary</option>
                        <option value="EMERGENCY">Emergency</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Expected Checkout Date</label>
                      <input type="date" value={formData.expectedCheckoutDate} onChange={e => setFormData({...formData, expectedCheckoutDate: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Link Mess Plan</label>
                      <select value={formData.messPlanId} onChange={e => setFormData({...formData, messPlanId: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500">
                        <option value="">-- No Mess Plan --</option>
                        {messPlans.map(p => (
                          <option key={p.id} value={p.id}>{p.planName} (₹{p.monthlyRate}/mo)</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Emergency Contact Number</label>
                      <input type="text" value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Required for hostel files"/>
                    </div>
                  </div>

                  {/* Right Col */}
                  <div className="space-y-5">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h4 className="font-semibold text-slate-700 mb-3">Enterprise Checklist</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={formData.adminApproval} onChange={e => setFormData({...formData, adminApproval: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"/>
                          <span className="text-sm text-slate-700">Admin Approved</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={formData.parentConsent} onChange={e => setFormData({...formData, parentConsent: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"/>
                          <span className="text-sm text-slate-700">Parent Consent Received</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={formData.lockerAssigned} onChange={e => setFormData({...formData, lockerAssigned: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"/>
                          <span className="text-sm text-slate-700">Locker Assigned</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={formData.rfidCardAssigned} onChange={e => setFormData({...formData, rfidCardAssigned: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"/>
                          <span className="text-sm text-slate-700">RFID Card Provisioned</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Medical/Special Needs Notes</label>
                      <textarea value={formData.medicalNotes} onChange={e => setFormData({...formData, medicalNotes: e.target.value})} rows={3} className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="E.g., requires ground floor, asthma..."></textarea>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-5 border-t border-slate-200 bg-white flex justify-between items-center shrink-0">
          <button
            onClick={() => step === 1 ? onClose() : setStep(s => s - 1)}
            className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          {step === 1 && (
            <button 
              disabled={!selectedStudent || !eligibility?.eligible} 
              onClick={() => setStep(2)} 
              className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              Continue to Bed Mapping <ChevronRight size={18}/>
            </button>
          )}

          {step === 2 && (
            <button 
              disabled={!selectedBed} 
              onClick={() => setStep(3)} 
              className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              Continue to Metadata <ChevronRight size={18}/>
            </button>
          )}

          {step === 3 && (
            <button 
              disabled={submitting || !formData.expectedCheckoutDate} 
              onClick={handleSubmit} 
              className="px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all"
            >
              {submitting ? 'Allocating...' : 'Complete Allocation'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
