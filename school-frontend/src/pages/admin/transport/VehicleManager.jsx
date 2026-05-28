import React, { useState, useEffect } from 'react';
import { Truck, Plus, Search, Edit2, AlertTriangle, CheckCircle, ShieldAlert, X, Info, ShieldCheck, Activity } from 'lucide-react';
import { getVehicles, createVehicle, updateVehicle } from '../../../api/transportApi';
import { useToast } from '../../../hooks/useToast';

const Field = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-[10px] mt-1 font-medium italic">{error}</p>}
  </div>
);

const inputCls = `w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300 bg-slate-50 focus:bg-white shadow-sm`;


export default function VehicleManager() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    registrationNumber: '',
    vehicleType: 'BUS',
    brand: '',
    model: '',
    seatingCapacity: '',
    fuelType: 'DIESEL',
    insuranceExpiryDate: '',
    fitnessExpiryDate: '',
    currentStatus: 'ACTIVE'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await getVehicles(1);
      setVehicles(res.data || []);
    } catch (err) {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (vehicle = null) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        vehicleNumber: vehicle.vehicleNumber || '',
        registrationNumber: vehicle.registrationNumber || '',
        vehicleType: vehicle.vehicleType || 'BUS',
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        seatingCapacity: vehicle.seatingCapacity || '',
        fuelType: vehicle.fuelType || 'DIESEL',
        insuranceExpiryDate: vehicle.insuranceExpiryDate ? vehicle.insuranceExpiryDate.substring(0,10) : '',
        fitnessExpiryDate: vehicle.fitnessExpiryDate ? vehicle.fitnessExpiryDate.substring(0,10) : '',
        currentStatus: vehicle.currentStatus || 'ACTIVE'
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        vehicleNumber: '', registrationNumber: '', vehicleType: 'BUS', brand: '', 
        model: '', seatingCapacity: '', fuelType: 'DIESEL', 
        insuranceExpiryDate: '', fitnessExpiryDate: '', currentStatus: 'ACTIVE'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, formData);
        toast.success('Vehicle updated successfully');
      } else {
        await createVehicle(formData);
        toast.success('Vehicle added successfully');
      }
      setIsModalOpen(false);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.vehicleNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isModalOpen) {
    return (
      <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{editingVehicle ? 'Edit Vehicle' : 'Register New Vehicle'}</h1>
            <p className="text-slate-500 font-medium text-sm">Enter the details for this fleet vehicle</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            <X size={16} /> Cancel
          </button>
        </div>

        <form id="vehicleForm" onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: IDENTITY & DETAILS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
              <Truck size={16} className="text-blue-600" /> Identity & Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Vehicle Number *">
                <input required type="text" value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} className={inputCls} placeholder="e.g. BUS-01"/>
              </Field>
              <Field label="Registration Number">
                <input type="text" value={formData.registrationNumber} onChange={e => setFormData({...formData, registrationNumber: e.target.value})} className={`${inputCls} font-mono uppercase`} placeholder="e.g. MH-12-AB-1234"/>
              </Field>

              <Field label="Vehicle Type">
                <select value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} className={inputCls}>
                  <option value="BUS">Heavy Bus</option>
                  <option value="MINI_BUS">Mini Bus</option>
                  <option value="VAN">Van</option>
                  <option value="EV_BUS">Electric Bus</option>
                </select>
              </Field>
              <Field label="Seating Capacity">
                <input type="number" min="1" value={formData.seatingCapacity} onChange={e => setFormData({...formData, seatingCapacity: e.target.value})} className={inputCls} placeholder="e.g. 40"/>
              </Field>

              <Field label="Brand">
                <input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className={inputCls} placeholder="e.g. Tata Motors"/>
              </Field>
              <Field label="Model">
                <input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className={inputCls} placeholder="e.g. Starbus"/>
              </Field>
            </div>
          </div>

          {/* SECTION 2: COMPLIANCE & STATUS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
              <ShieldCheck size={16} className="text-blue-600" /> Compliance & Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Insurance Expiry Date">
                <input type="date" value={formData.insuranceExpiryDate} onChange={e => setFormData({...formData, insuranceExpiryDate: e.target.value})} className={inputCls}/>
              </Field>
              <Field label="Fitness Expiry Date">
                <input type="date" value={formData.fitnessExpiryDate} onChange={e => setFormData({...formData, fitnessExpiryDate: e.target.value})} className={inputCls}/>
              </Field>

              {editingVehicle && (
                <div className="md:col-span-2 mt-2">
                  <Field label="Current Status">
                    <select value={formData.currentStatus} onChange={e => setFormData({...formData, currentStatus: e.target.value})} className={inputCls}>
                      <option value="ACTIVE">Active (On Duty)</option>
                      <option value="MAINTENANCE">In Maintenance</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </Field>
                </div>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all border border-slate-200">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl text-sm font-black shadow-lg shadow-blue-100 transition-all disabled:opacity-50">
              {editingVehicle ? 'Save Changes' : 'Register Vehicle'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Blueprint */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fleet Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage vehicles, compliance documents, and statuses</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="h-[52px] px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-sm shadow-blue-600/20 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add New Vehicle
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Vehicle No or Reg No..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-[52px] bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-[15px]"
            />
          </div>
        </div>

        {/* Vehicle Cards Grid (Mobile First Blueprint) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          {loading ? (
            <div className="col-span-full p-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
          ) : filteredVehicles.length === 0 ? (
            <div className="col-span-full p-16 text-center">
              <Truck className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No vehicles found</h3>
              <p className="text-slate-500 mt-1">Register your first fleet vehicle to begin tracking.</p>
            </div>
          ) : filteredVehicles.map(v => {
            const today = new Date();
            const insExpiry = v.insuranceExpiryDate ? new Date(v.insuranceExpiryDate) : null;
            const fitExpiry = v.fitnessExpiryDate ? new Date(v.fitnessExpiryDate) : null;
            
            let complianceState = 'OK';
            let complianceText = 'Documents Valid';
            let Icon = CheckCircle;
            let colorClass = 'text-emerald-700 bg-emerald-50 border-emerald-100';

            if ((insExpiry && insExpiry < today) || (fitExpiry && fitExpiry < today)) {
              complianceState = 'EXPIRED';
              complianceText = 'Documents Expired';
              Icon = ShieldAlert;
              colorClass = 'text-red-700 bg-red-50 border-red-100';
            } else if ((insExpiry && (insExpiry - today)/(1000*60*60*24) < 30) || 
                       (fitExpiry && (fitExpiry - today)/(1000*60*60*24) < 30)) {
              complianceState = 'WARNING';
              complianceText = 'Expiring within 30 days';
              Icon = AlertTriangle;
              colorClass = 'text-amber-700 bg-amber-50 border-amber-100';
            }

            return (
              <div key={v.id} className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-all hover:shadow-md">
                
                {/* Edit Button - Absolute positioning */}
                <button 
                  onClick={() => handleOpenModal(v)}
                  className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 shadow-sm"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </button>

                <div className="flex items-center gap-4 mb-5 pr-10">
                  <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                    <Truck className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{v.vehicleNumber}</h3>
                    <p className="text-sm font-mono text-slate-500 mt-0.5">{v.registrationNumber || 'No Reg No.'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 mb-5 text-[13px]">
                  <div>
                    <p className="text-slate-500 font-medium">Type / Brand</p>
                    <p className="font-semibold text-slate-900 mt-0.5">{v.vehicleType} • {v.brand || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Capacity</p>
                    <p className="font-semibold text-slate-900 mt-0.5">{v.seatingCapacity} Seats</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[12px] font-bold ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                    {complianceText}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider uppercase border ${
                    v.currentStatus === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                    v.currentStatus === 'MAINTENANCE' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {v.currentStatus === 'ACTIVE' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>}
                    {v.currentStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
