import React, { useState, useEffect } from 'react';
import { Users, MapPin, Search, UserCheck, ArrowRight, CheckCircle } from 'lucide-react';
import { getRoutes, getRouteStops, assignStudentToRoute } from '../../../api/transportApi';
import { studentApi } from '../../../api/studentApi';
import { useToast } from '../../../hooks/useToast';

export default function StudentTransportMapping() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Assignment State
  const [studentSearch, setStudentSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [formData, setFormData] = useState({
    pickupStopId: '',
    dropStopId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await getRoutes(1);
      setRoutes(res.data || []);
    } catch (err) {
      toast.error('Failed to load transport routes');
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = async (routeId) => {
    setSelectedRoute(routeId);
    setStops([]);
    setFormData({ pickupStopId: '', dropStopId: '' });
    try {
      const res = await getRouteStops(routeId);
      setStops(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch stops for route');
    }
  };

  // Debounced student search
  useEffect(() => {
    if (studentSearch.length < 3) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await studentApi.search(studentSearch);
        setSearchResults(res.data?.data?.content || res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [studentSearch]);

  const handleSubmit = async () => {
    if (!selectedStudent || !selectedRoute) return;
    if (!formData.pickupStopId && !formData.dropStopId) {
      toast.error('Please select at least a pickup or drop stop');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        student: { id: selectedStudent.id },
        route: { id: selectedRoute },
        pickupStop: formData.pickupStopId ? { id: formData.pickupStopId } : null,
        dropStop: formData.dropStopId ? { id: formData.dropStopId } : null,
        status: 'ACTIVE'
      };

      await assignStudentToRoute(payload);
      toast.success(`${selectedStudent.firstName} successfully assigned to route!`);
      
      // Reset form
      setSelectedStudent(null);
      setStudentSearch('');
      setFormData({ pickupStopId: '', dropStopId: '' });
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 animate-fade-in"><div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Assignment Wizard</h1>
          <p className="text-sm text-slate-500 mt-1">Map students to physical bus stops and routes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Selection Panel */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] flex flex-col h-[650px] overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Select Route
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
            ) : routes.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No routes configured yet.</div>
            ) : routes.map(route => (
              <button
                key={route.id}
                onClick={() => handleRouteSelect(route.id)}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  selectedRoute === route.id 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : 'hover:bg-slate-50 border-transparent hover:border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold text-[15px] ${selectedRoute === route.id ? 'text-blue-900' : 'text-slate-900'}`}>
                    {route.routeName}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-100">
                    {route.routeCode}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-500">
                  <span className="truncate max-w-[100px]">{route.startLocation}</span>
                  <ArrowRight className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate max-w-[100px]">{route.endLocation}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Assignment Wizard Panel */}
        <div className="lg:col-span-2 bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] flex flex-col h-[650px] overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Map Student to Stops
            </h2>
            {selectedRoute && (
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                Route Active
              </span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            {!selectedRoute ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No Route Selected</h3>
                <p className="text-sm font-medium">Select a route from the sidebar to continue</p>
              </div>
            ) : (
              <div className="max-w-xl mx-auto space-y-8 animate-fade-in">
                
                {/* Step 2A: Find Student */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Student Identity</label>
                  
                  {selectedStudent ? (
                    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                           {selectedStudent.firstName.charAt(0)}{selectedStudent.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-emerald-900 text-[15px]">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                          <p className="text-xs font-medium text-emerald-700/80">Reg No: {selectedStudent.studentId} • Class {selectedStudent.className}</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedStudent(null)} className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline">Change</button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search student by name or registration number (min 3 chars)..." 
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="w-full pl-12 pr-4 h-[52px] bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-[15px]"
                      />
                      
                      {/* Search Dropdown */}
                      {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-20 max-h-60 overflow-y-auto">
                          {searchResults.map(stu => (
                            <button
                              key={stu.id}
                              onClick={() => {
                                setSelectedStudent(stu);
                                setSearchResults([]);
                                setStudentSearch('');
                              }}
                              className="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-50 flex justify-between items-center"
                            >
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{stu.firstName} {stu.lastName}</p>
                                <p className="text-xs text-slate-500">Reg: {stu.studentId}</p>
                              </div>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded">Class {stu.className}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Step 2B: Stop Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700">Morning Pickup Stop</label>
                    <select 
                      value={formData.pickupStopId}
                      onChange={(e) => setFormData({...formData, pickupStopId: e.target.value})}
                      className="w-full h-[52px] px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 text-[15px] font-medium"
                    >
                      <option value="">-- No Pickup --</option>
                      {stops.map(stop => (
                        <option key={stop.id} value={stop.id}>{stop.stopSequence}. {stop.stopName} ({stop.pickupTime})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700">Afternoon Drop Stop</label>
                    <select 
                      value={formData.dropStopId}
                      onChange={(e) => setFormData({...formData, dropStopId: e.target.value})}
                      className="w-full h-[52px] px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 text-[15px] font-medium"
                    >
                      <option value="">-- No Drop --</option>
                      {stops.map(stop => (
                        <option key={stop.id} value={stop.id}>{stop.stopSequence}. {stop.stopName} ({stop.dropTime})</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
            )}
          </div>
          
          {/* Action Footer */}
          <div className="p-5 border-t border-slate-100 bg-slate-50">
            <button 
              onClick={handleSubmit}
              disabled={!selectedStudent || (!formData.pickupStopId && !formData.dropStopId) || isSubmitting}
              className="bg-[#1E40AF] text-white px-6 py-3 rounded-[16px] min-h-[44px] font-bold text-sm shadow-md transition-all hover:bg-[#1E3A8A] w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserCheck className="h-5 w-5" />
                  Confirm Transport Assignment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
