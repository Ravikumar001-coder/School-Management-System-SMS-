import React, { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Edit2, Trash2, Clock, Users, Navigation, X, RefreshCw, Map } from 'lucide-react';
import { getRoutes, createRoute, updateRoute, deleteRoute, getRouteStops, createRouteStop, updateRouteStop, deleteRouteStop } from '../../../api/transportApi';
import { useToast } from '../../../hooks/useToast';

export default function RouteManager() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  
  // Stops Management State
  const [isStopsModalOpen, setIsStopsModalOpen] = useState(false);
  const [selectedRouteForStops, setSelectedRouteForStops] = useState(null);
  const [stops, setStops] = useState([]);
  const [stopsLoading, setStopsLoading] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [stopFormData, setStopFormData] = useState({
    stopName: '',
    stopSequence: '',
    pickupTime: '',
    dropTime: '',
    landmark: '',
    stopRadiusMeters: 50
  });
  
  const [formData, setFormData] = useState({
    routeName: '',
    routeCode: '',
    routeType: 'PICKUP',
    status: 'ACTIVE',
    startLocation: '',
    endLocation: '',
    estimatedDistanceKm: '',
    estimatedDurationMinutes: ''
  });

  const toast = useToast();

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await getRoutes(1); // Default branch 1
      setRoutes(res.data || []);
    } catch (err) {
      toast.error('Failed to load routes from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const openModal = (route = null) => {
    if (route) {
      setEditingRoute(route);
      setFormData({
        routeName: route.routeName,
        routeCode: route.routeCode,
        routeType: route.routeType || 'PICKUP',
        status: route.status,
        startLocation: route.startLocation || '',
        endLocation: route.endLocation || '',
        estimatedDistanceKm: route.estimatedDistanceKm || '',
        estimatedDurationMinutes: route.estimatedDurationMinutes || ''
      });
    } else {
      setEditingRoute(null);
      setFormData({
        routeName: '',
        routeCode: '',
        routeType: 'PICKUP',
        status: 'ACTIVE',
        startLocation: '',
        endLocation: '',
        estimatedDistanceKm: '',
        estimatedDurationMinutes: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRoute(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        estimatedDistanceKm: formData.estimatedDistanceKm ? parseFloat(formData.estimatedDistanceKm) : null,
        estimatedDurationMinutes: formData.estimatedDurationMinutes ? parseInt(formData.estimatedDurationMinutes) : null
      };

      if (editingRoute) {
        await updateRoute(editingRoute.id, payload);
        toast.success('Route updated successfully');
      } else {
        await createRoute(1, payload);
        toast.success('Route created successfully');
      }
      closeModal();
      fetchRoutes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save route');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to archive this route?')) {
      try {
        await deleteRoute(id);
        toast.success('Route archived successfully');
        fetchRoutes();
      } catch (err) {
        toast.error('Failed to delete route');
      }
    }
  };

  // Stops Management Functions
  const openStopsModal = async (route) => {
    setSelectedRouteForStops(route);
    setIsStopsModalOpen(true);
    await fetchStops(route.id);
  };

  const closeStopsModal = () => {
    setIsStopsModalOpen(false);
    setSelectedRouteForStops(null);
    setEditingStop(null);
    setStops([]);
  };

  const fetchStops = async (routeId) => {
    try {
      setStopsLoading(true);
      const res = await getRouteStops(routeId);
      setStops(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch stops');
    } finally {
      setStopsLoading(false);
    }
  };

  const handleStopChange = (e) => {
    setStopFormData({...stopFormData, [e.target.name]: e.target.value});
  };

  const handleStopSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...stopFormData,
        stopSequence: parseInt(stopFormData.stopSequence),
        stopRadiusMeters: parseInt(stopFormData.stopRadiusMeters)
      };
      if (editingStop) {
        await updateRouteStop(editingStop.id, payload);
        toast.success('Stop updated');
      } else {
        await createRouteStop(selectedRouteForStops.id, payload);
        toast.success('Stop added');
      }
      setEditingStop(null);
      setStopFormData({
        stopName: '', stopSequence: '', pickupTime: '', dropTime: '', landmark: '', stopRadiusMeters: 50
      });
      fetchStops(selectedRouteForStops.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save stop');
    }
  };

  const handleEditStop = (stop) => {
    setEditingStop(stop);
    setStopFormData({
      stopName: stop.stopName,
      stopSequence: stop.stopSequence,
      pickupTime: stop.pickupTime || '',
      dropTime: stop.dropTime || '',
      landmark: stop.landmark || '',
      stopRadiusMeters: stop.stopRadiusMeters || 50
    });
  };

  const handleDeleteStop = async (id) => {
    if (window.confirm('Are you sure you want to delete this stop?')) {
      try {
        await deleteRouteStop(id);
        toast.success('Stop deleted');
        fetchStops(selectedRouteForStops.id);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete stop');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Sticky Top Toolbar Blueprint */}
      <div className="sticky top-0 bg-white/95 backdrop-blur z-20 border-b border-slate-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Route Management</h1>
            <p className="text-sm text-slate-500 mt-1">Configure and monitor transport routes.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchRoutes}
              className="flex items-center justify-center w-12 h-[52px] text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-200 bg-white shadow-sm"
              title="Refresh Routes"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin text-blue-500' : ''}`} />
            </button>
            <button 
              onClick={() => openModal()}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 h-[52px] rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-semibold text-[15px]"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Create New Route</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Sticky Filter Bar */}
        <div className="sticky top-[85px] z-10 bg-slate-50 py-2 mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[280px] max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search routes by name or code..." 
                className="w-full pl-12 pr-4 h-[52px] bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-[15px] shadow-sm"
              />
            </div>
            <select className="h-[52px] bg-white border border-slate-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-700 text-[15px] shadow-sm min-w-[140px]">
              <option>All Statuses</option>
              <option>ACTIVE</option>
              <option>INACTIVE</option>
            </select>
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : routes.length === 0 ? (
          /* Standard Empty State Blueprint */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center mt-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Map className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No routes active</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">You haven't configured any transport routes yet. Set up your first route to start tracking.</p>
            <button onClick={() => openModal()} className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 h-[52px] rounded-xl hover:bg-blue-700 font-semibold shadow-sm">
              <Plus className="h-5 w-5" /> Create Your First Route
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {routes.map((route) => (
              <div key={route.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-300 transition-colors group relative">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  {/* Left Column */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{route.routeName}</h3>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                        route.status === 'ACTIVE' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {route.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 font-mono mb-3">{route.routeCode} • {route.routeType}</p>
                    
                    {/* Metrics Row */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      {route.startLocation && (
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="font-medium truncate max-w-[200px]">{route.startLocation} &rarr; {route.endLocation}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <Navigation className="h-4 w-4 text-slate-400"/> 
                        <span className="font-medium">{route.estimatedDistanceKm || 0} km</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <Clock className="h-4 w-4 text-slate-400"/> 
                        <span className="font-medium">{route.estimatedDurationMinutes || 0} min</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col justify-end gap-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                    <button onClick={() => openStopsModal(route)} className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200" title="Manage Stops">
                      <MapPin className="h-4 w-4" /> Manage Stops
                    </button>
                    <button onClick={() => openModal(route)} className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200" title="Edit Route">
                      <Edit2 className="h-4 w-4" /> Edit Route
                    </button>
                    <button onClick={() => handleDelete(route.id)} className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-slate-200" title="Archive Route">
                      <Trash2 className="h-4 w-4" /> Archive Route
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal Blueprint (Mobile First + Sticky Footer) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center sm:p-4">
          <div className="bg-white sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-h-[90vh] max-w-2xl flex flex-col animate-fade-in relative">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-900">{editingRoute ? 'Edit Route' : 'Create New Route'}</h2>
              <button onClick={closeModal} className="flex items-center justify-center w-10 h-10 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-700">Route Name *</label>
                    <input required name="routeName" value={formData.routeName} onChange={handleChange} className="w-full px-4 h-[52px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-[15px]" placeholder="e.g. Morning Downtown" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-700">Route Code *</label>
                    <input required name="routeCode" value={formData.routeCode} onChange={handleChange} className="w-full px-4 h-[52px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-[15px]" placeholder="e.g. RT-01" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-700">Route Type</label>
                    <select name="routeType" value={formData.routeType} onChange={handleChange} className="w-full px-4 h-[52px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-[15px] bg-white">
                      <option value="PICKUP">Pickup</option>
                      <option value="DROP">Drop</option>
                      <option value="BOTH">Both</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-700">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 h-[52px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-[15px] bg-white">
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-700">Start Location</label>
                    <input name="startLocation" value={formData.startLocation} onChange={handleChange} className="w-full px-4 h-[52px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-[15px]" placeholder="e.g. Main Gate" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-700">End Location</label>
                    <input name="endLocation" value={formData.endLocation} onChange={handleChange} className="w-full px-4 h-[52px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-[15px]" placeholder="e.g. City Center" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-700">Distance (km)</label>
                    <input type="number" step="0.1" name="estimatedDistanceKm" value={formData.estimatedDistanceKm} onChange={handleChange} className="w-full px-4 h-[52px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-[15px]" placeholder="15.5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-700">Duration (mins)</label>
                    <input type="number" name="estimatedDurationMinutes" value={formData.estimatedDurationMinutes} onChange={handleChange} className="w-full px-4 h-[52px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-[15px]" placeholder="45" />
                  </div>
                </div>
              </div>

              {/* Sticky Footer Blueprint */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 p-4 sm:px-6 flex justify-between items-center z-10">
                <div className="text-xs text-slate-400 hidden sm:block">Fields marked * are required</div>
                <div className="flex flex-1 sm:flex-none gap-3 justify-end">
                  <button type="button" onClick={closeModal} className="flex-1 sm:flex-none px-6 h-[52px] text-[15px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 sm:flex-none px-8 h-[52px] text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                    {editingRoute ? 'Save Changes' : 'Create Route'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Stops Management Modal */}
      {isStopsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-slide-in-right">
            
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Manage Stops</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">{selectedRouteForStops?.routeName}</p>
              </div>
              <button onClick={closeStopsModal} className="flex items-center justify-center w-10 h-10 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col gap-8">
              
              {/* Add/Edit Stop Form */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 shrink-0">
                <h3 className="font-bold text-slate-800 mb-4">{editingStop ? 'Edit Stop' : 'Add New Stop'}</h3>
                <form onSubmit={handleStopSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[12px] font-bold text-slate-500 uppercase">Stop Name *</label>
                      <input required name="stopName" value={stopFormData.stopName} onChange={handleStopChange} className="w-full px-3 h-11 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm" placeholder="e.g. City Bank Circle" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-500 uppercase">Sequence *</label>
                      <input required type="number" min="1" name="stopSequence" value={stopFormData.stopSequence} onChange={handleStopChange} className="w-full px-3 h-11 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm" placeholder="1" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-500 uppercase">Landmark</label>
                      <input name="landmark" value={stopFormData.landmark} onChange={handleStopChange} className="w-full px-3 h-11 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm" placeholder="Near ATM" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-500 uppercase">Pickup Time *</label>
                      <input required type="time" name="pickupTime" value={stopFormData.pickupTime} onChange={handleStopChange} className="w-full px-3 h-11 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-500 uppercase">Drop Time *</label>
                      <input required type="time" name="dropTime" value={stopFormData.dropTime} onChange={handleStopChange} className="w-full px-3 h-11 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    {editingStop && (
                      <button type="button" onClick={() => {
                        setEditingStop(null);
                        setStopFormData({ stopName: '', stopSequence: '', pickupTime: '', dropTime: '', landmark: '', stopRadiusMeters: 50 });
                      }} className="px-4 h-10 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        Cancel Edit
                      </button>
                    )}
                    <button type="submit" className="px-5 h-10 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                      {editingStop ? 'Update Stop' : 'Add Stop'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Stops List */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800">Current Stops ({stops.length})</h3>
                {stopsLoading ? (
                   <div className="text-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
                ) : stops.length === 0 ? (
                  <div className="text-center p-8 bg-white rounded-2xl border border-slate-200">
                    <p className="text-slate-500 text-sm">No stops added yet.</p>
                  </div>
                ) : (
                  stops.map(stop => (
                    <div key={stop.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                          {stop.stopSequence}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{stop.stopName}</h4>
                          <div className="flex gap-3 mt-1 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> Pickup: {stop.pickupTime}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> Drop: {stop.dropTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditStop(stop)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteStop(stop.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
