import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit2, ShieldAlert, CheckCircle, X, Mail, Phone, MapPin, Activity, FileText, User } from 'lucide-react';
import { getDrivers, createDriver, updateDriver } from '../../../api/transportApi';
import { fileApi } from '../../../api/fileApi';
import { useToast } from '../../../hooks/useToast';

const Field = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-[10px] mt-1 font-medium italic">{error}</p>}
  </div>
);

const inputCls = `w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300 bg-slate-50 focus:bg-white shadow-sm`;

export default function DriverManager() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    address: '',
    bloodGroup: '',
    emergencyContact: '',
    aadhaarNumber: '',
    licenseNumber: '',
    licenseType: 'HMV',
    licenseExpiryDate: '',
    experienceYears: '',
    employeeId: '',
    status: 'ACTIVE',
    profilePhoto: ''
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await getDrivers(1);
      setDrivers(res.data || []);
    } catch (err) {
      toast.error('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (driver = null) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        firstName: driver.firstName || '',
        lastName: driver.lastName || '',
        phone: driver.phone || '',
        alternatePhone: driver.alternatePhone || '',
        email: driver.email || '',
        address: driver.address || '',
        bloodGroup: driver.bloodGroup || '',
        emergencyContact: driver.emergencyContact || '',
        aadhaarNumber: driver.aadhaarNumber || '',
        licenseNumber: driver.licenseNumber || '',
        licenseType: driver.licenseType || 'HMV',
        licenseExpiryDate: driver.licenseExpiryDate ? driver.licenseExpiryDate.substring(0,10) : '',
        experienceYears: driver.experienceYears || '',
        employeeId: driver.employeeId || '',
        status: driver.status || 'ACTIVE',
        profilePhoto: driver.profilePhoto || ''
      });
    } else {
      setEditingDriver(null);
      setFormData({
        firstName: '', lastName: '', phone: '', alternatePhone: '', email: '',
        address: '', bloodGroup: '', emergencyContact: '', aadhaarNumber: '',
        licenseNumber: '', licenseType: 'HMV', licenseExpiryDate: '', experienceYears: '',
        employeeId: '', status: 'ACTIVE', profilePhoto: ''
      });
    }
    setIsModalOpen(true);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const path = await fileApi.uploadImage(file);
      setFormData((prev) => ({ ...prev, profilePhoto: path }));
      toast.success('Photo uploaded successfully');
    } catch (err) {
      toast.error('Photo upload failed');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDriver) {
        await updateDriver(editingDriver.id, formData);
        toast.success('Driver updated successfully');
      } else {
        await createDriver(1, formData);
        toast.success('Driver added successfully');
      }
      setIsModalOpen(false);
      fetchDrivers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const filteredDrivers = drivers.filter(d => 
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isModalOpen) {
    return (
      <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{editingDriver ? 'Edit Driver' : 'Register New Driver'}</h1>
            <p className="text-slate-500 font-medium text-sm">Create an enterprise-hardened employee record</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            <X size={16} /> Cancel
          </button>
        </div>

        <form id="driverForm" onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: IDENTITY & PROFILE */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
              <User size={16} className="text-blue-600" /> Identity & Profile
            </h3>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-[2rem] bg-blue-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden ring-1 ring-slate-100">
                  {formData.profilePhoto ? (
                    <img src={fileApi.toPublicUrl(formData.profilePhoto)} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-blue-200" />
                  )}
                </div>
                <label className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                  {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="First Name *">
                  <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className={inputCls} placeholder="e.g. Ramesh"/>
                </Field>
                <Field label="Last Name *">
                  <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className={inputCls} placeholder="e.g. Kumar"/>
                </Field>
                <Field label="Employee ID">
                  <input type="text" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} className={`${inputCls} font-mono`} placeholder="Auto-generated if left blank"/>
                </Field>
                <Field label="Email Address">
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputCls} placeholder="e.g. ramesh@example.com"/>
                </Field>
              </div>
            </div>
          </div>

          {/* SECTION 2: CONTACT & PERSONAL DETAILS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
              <Phone size={16} className="text-blue-600" /> Contact & Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Phone Number *">
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputCls} placeholder="e.g. +91 9876543210"/>
              </Field>
              <Field label="Alternate Phone">
                <input type="tel" value={formData.alternatePhone} onChange={e => setFormData({...formData, alternatePhone: e.target.value})} className={inputCls} placeholder="e.g. +91 9876543211"/>
              </Field>
              <Field label="Emergency Contact">
                <input type="tel" value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} className={inputCls} placeholder="e.g. +91 9123456789"/>
              </Field>
              <Field label="Blood Group">
                <input type="text" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className={inputCls} placeholder="e.g. O+"/>
              </Field>
              <div className="md:col-span-2">
                <Field label="Address">
                  <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={`${inputCls} py-4`} rows="2" placeholder="Full Address"/>
                </Field>
              </div>
            </div>
          </div>

          {/* SECTION 3: LICENSING & PROFESSIONAL */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
              <FileText size={16} className="text-blue-600" /> Licensing & Professional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="License Number *">
                <input required type="text" value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} className={`${inputCls} font-mono uppercase`} placeholder="e.g. MH1220110001234"/>
              </Field>
              <Field label="License Type">
                <select value={formData.licenseType} onChange={e => setFormData({...formData, licenseType: e.target.value})} className={inputCls}>
                  <option value="LMV">LMV (Light Motor Vehicle)</option>
                  <option value="HMV">HMV (Heavy Motor Vehicle)</option>
                  <option value="HMPV">HMPV (Heavy Passenger Motor Vehicle)</option>
                </select>
              </Field>
              <Field label="License Expiry Date">
                <input type="date" value={formData.licenseExpiryDate} onChange={e => setFormData({...formData, licenseExpiryDate: e.target.value})} className={inputCls}/>
              </Field>
              <Field label="Aadhaar Number">
                <input type="text" value={formData.aadhaarNumber} onChange={e => setFormData({...formData, aadhaarNumber: e.target.value})} className={inputCls} placeholder="12-digit Aadhaar"/>
              </Field>
              <Field label="Years of Experience">
                <input type="number" min="0" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: e.target.value})} className={inputCls} placeholder="e.g. 5"/>
              </Field>
              {editingDriver && (
                <Field label="Current Status">
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className={inputCls}>
                    <option value="ACTIVE">Active (Available)</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </Field>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all border border-slate-200">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl text-sm font-black shadow-lg shadow-blue-100 transition-all disabled:opacity-50">
              {editingDriver ? 'Save Changes' : 'Register Driver'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (selectedProfile) {
    return (
      <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Driver Profile</h1>
            <p className="text-slate-500 font-medium text-sm">Detailed view of personnel record</p>
          </div>
          <button 
            onClick={() => setSelectedProfile(null)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            <X size={16} /> Back to Directory
          </button>
        </div>

        <div className="bg-white w-full rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="bg-blue-600 px-8 py-8 text-white flex justify-between items-start relative overflow-hidden shrink-0">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="flex gap-6 items-center relative z-10">
              <div className="h-24 w-24 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-4xl font-bold shadow-lg overflow-hidden">
                {selectedProfile.profilePhoto ? (
                  <img src={fileApi.toPublicUrl(selectedProfile.profilePhoto)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <>{selectedProfile.firstName?.charAt(0)}{selectedProfile.lastName?.charAt(0)}</>
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">{selectedProfile.firstName} {selectedProfile.lastName}</h2>
                <p className="text-blue-100 font-medium text-lg mt-1">{selectedProfile.employeeId || 'Driver Profile'}</p>
                <div className="flex gap-3 mt-3">
                  <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-bold tracking-wide backdrop-blur-sm border border-white/20">
                    {selectedProfile.licenseType} License
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-bold tracking-wide backdrop-blur-sm border border-white/20">
                    Exp: {selectedProfile.experienceYears || 0} Yrs
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5 text-blue-500" /> Contact Info
              </h3>
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-slate-500 text-sm font-medium">Primary Phone</span>
                <span className="font-bold text-slate-900">{selectedProfile.phone}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-slate-500 text-sm font-medium">Alternate</span>
                <span className="font-bold text-slate-900">{selectedProfile.alternatePhone || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-slate-500 text-sm font-medium">Email</span>
                <span className="font-bold text-slate-900">{selectedProfile.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-slate-500 text-sm font-medium">Emergency</span>
                <span className="font-bold text-red-600">{selectedProfile.emergencyContact || 'N/A'}</span>
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-blue-500" /> Personal Details
              </h3>
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-slate-500 text-sm font-medium">Blood Group</span>
                <span className="font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">{selectedProfile.bloodGroup || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-slate-500 text-sm font-medium">Aadhaar No.</span>
                <span className="font-mono font-bold text-slate-900">{selectedProfile.aadhaarNumber || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1 pb-1">
                <span className="text-slate-500 text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Address
                </span>
                <span className="font-medium text-slate-800 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedProfile.address || 'No address provided'}</span>
              </div>
            </div>

            {/* Licensing Information */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-blue-500" /> License & Compliance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">License Number</p>
                  <p className="font-mono font-bold text-slate-900">{selectedProfile.licenseNumber}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${selectedProfile.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                    {selectedProfile.status}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Expiry Date</p>
                  <p className="font-bold text-slate-900">{selectedProfile.licenseExpiryDate || 'Unknown'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Verification</p>
                  <p className="font-bold text-blue-600">{selectedProfile.policeVerificationStatus || 'PENDING'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
             <button onClick={() => { setSelectedProfile(null); handleOpenModal(selectedProfile); }} className="h-11 px-6 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-xl transition-colors flex items-center gap-2">
               <Edit2 className="h-4 w-4" /> Edit Profile
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Driver Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage personnel, licenses, and assignments</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="h-[52px] px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-sm shadow-blue-600/20 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add New Driver
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Name, Employee ID or License..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-[52px] bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-[15px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {loading ? (
             <div className="col-span-full p-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
          ) : filteredDrivers.length === 0 ? (
            <div className="col-span-full p-16 text-center">
              <Users className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No drivers found</h3>
              <p className="text-slate-500 mt-1">Register your first driver to assign them to vehicles.</p>
            </div>
          ) : filteredDrivers.map(d => {
            const today = new Date();
            const expDate = d.licenseExpiryDate ? new Date(d.licenseExpiryDate) : null;
            let isExpired = expDate && expDate < today;
            let isExpiringSoon = expDate && ((expDate - today)/(1000*60*60*24)) < 30;

            return (
              <div key={d.id} className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-all hover:shadow-md group">
                
                {/* Edit Button - Absolute positioning */}
                <button 
                  onClick={() => handleOpenModal(d)}
                  className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 shadow-sm"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </button>

                <div className="flex items-start justify-between mb-4 pr-10">
                  <div className="flex gap-3 items-center">
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-100 shadow-sm overflow-hidden">
                      {d.profilePhoto ? (
                        <img src={fileApi.toPublicUrl(d.profilePhoto)} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <>{d.firstName?.charAt(0)}{d.lastName?.charAt(0)}</>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg leading-tight">{d.firstName} {d.lastName}</h3>
                      <p className="text-sm font-mono text-slate-500 mt-0.5">{d.employeeId || 'No EMP ID'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-[13px] border-b border-slate-50 pb-2">
                    <span className="text-slate-500 font-medium">License No:</span>
                    <span className="font-mono font-bold text-slate-900">{d.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between text-[13px] border-b border-slate-50 pb-2">
                    <span className="text-slate-500 font-medium">Contact:</span>
                    <span className="font-semibold text-slate-900">{d.phone}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-slate-500 font-medium">Experience:</span>
                    <span className="font-semibold text-slate-900">{d.experienceYears ? `${d.experienceYears} Years` : 'N/A'}</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 mb-4 ${
                  isExpired ? 'bg-red-50 border-red-100 text-red-700' :
                  isExpiringSoon ? 'bg-amber-50 border-amber-100 text-amber-700' :
                  'bg-emerald-50 border-emerald-100 text-emerald-700'
                }`}>
                  {isExpired || isExpiringSoon ? <ShieldAlert className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                  <div className="text-xs">
                    <p className="font-bold">{isExpired ? 'License Expired!' : isExpiringSoon ? 'License Expiring Soon' : 'License Valid'}</p>
                    <p className="opacity-80 font-medium">Expires: {d.licenseExpiryDate || 'Unknown'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase border ${
                        d.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                    {d.status}
                  </span>
                  <button onClick={() => setSelectedProfile(d)} className="text-[13px] font-bold text-blue-600 hover:text-blue-700">View Profile &rarr;</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
