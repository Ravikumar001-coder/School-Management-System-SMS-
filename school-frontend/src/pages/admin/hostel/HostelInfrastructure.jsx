import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, Settings, Home, CheckCircle, XCircle } from 'lucide-react';
import { getHostelBlocks, createHostelBlock, updateHostelBlock, deleteHostelBlock } from '../../../api/hostelApi';
import { useToast } from '../../../hooks/useToast';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function HostelInfrastructure() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const toast = useToast();

  const [formData, setFormData] = useState({
    blockName: '',
    blockCode: '',
    description: '',
    genderType: 'BOYS',
    buildingType: 'OWNED',
    status: 'ACTIVE',
    capacity: 0,
    totalFloors: 0,
    wardenId: '',
    emergencyContact: '',
    rfidEnabled: false,
    biometricEnabled: false,
    messAttached: false,
    academicYearId: 1, // Defaulting to 1 for MVP
    remarks: ''
  });

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const branchId = 1; // Default
      const data = await getHostelBlocks(branchId);
      setBlocks(data || []);
    } catch (error) {
      toast.error('Failed to load hostel blocks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const branchId = 1;
      
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity) || 0,
        totalFloors: parseInt(formData.totalFloors) || 0,
        academicYearId: parseInt(formData.academicYearId) || null,
        wardenId: formData.wardenId ? parseInt(formData.wardenId) : null
      };

      if (editingBlock) {
        await updateHostelBlock(editingBlock.id, payload);
        toast.success('Block updated successfully');
      } else {
        await createHostelBlock(branchId, payload);
        toast.success('Block created successfully');
      }
      setIsModalOpen(false);
      fetchBlocks();
    } catch (error) {
      toast.error(editingBlock ? 'Failed to update block' : 'Failed to create block');
    }
  };

  const openModal = (block = null) => {
    if (block) {
      setEditingBlock(block);
      setFormData({
        blockName: block.blockName || '',
        blockCode: block.blockCode || '',
        description: block.description || '',
        genderType: block.genderType || 'BOYS',
        buildingType: block.buildingType || 'OWNED',
        status: block.status || 'ACTIVE',
        capacity: block.capacity || 0,
        totalFloors: block.totalFloors || 0,
        wardenId: block.warden ? block.warden.id : '',
        emergencyContact: block.emergencyContact || '',
        rfidEnabled: block.rfidEnabled || false,
        biometricEnabled: block.biometricEnabled || false,
        messAttached: block.messAttached || false,
        academicYearId: block.academicYear ? block.academicYear.id : 1,
        remarks: block.remarks || ''
      });
    } else {
      setEditingBlock(null);
      setFormData({
        blockName: '',
        blockCode: '',
        description: '',
        genderType: 'BOYS',
        buildingType: 'OWNED',
        status: 'ACTIVE',
        capacity: 0,
        totalFloors: 0,
        wardenId: '',
        emergencyContact: '',
        rfidEnabled: false,
        biometricEnabled: false,
        messAttached: false,
        academicYearId: 1,
        remarks: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      try {
        await deleteHostelBlock(id);
        toast.success('Block deleted successfully');
        fetchBlocks();
      } catch (error) {
        toast.error('Failed to delete block. Ensure it has no dependent floors.');
      }
    }
  };

  const SectionHeader = ({ title }) => (
    <div className="col-span-full mt-4 mb-2">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">{title}</h3>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Hostel Infrastructure"
        subtitle="Manage hostel blocks, floors, and rooms"
        actions={
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
          >
            <Plus size={16} /> Add Block
          </button>
        }
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hidden sm:block">
        {loading ? (
          <div className="py-20 text-center"><LoadingSpinner /></div>
        ) : blocks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏢</div>
            <p className="text-slate-400 font-medium">No blocks found. Add your first block.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Block Code & Name</th>
                <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Warden</th>
                <th className="text-right px-6 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {blocks.map((block) => (
                <tr key={block.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 text-[10px] uppercase tracking-widest shrink-0">
                        {block.blockCode || 'BLK'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{block.blockName}</span>
                        <span className="text-xs text-slate-500 font-medium mt-0.5">{block.capacity} Beds • {block.totalFloors} Floors</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase w-max ${
                        block.genderType === 'BOYS' ? 'bg-blue-100 text-blue-700' : 
                        block.genderType === 'GIRLS' ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {block.genderType}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{block.buildingType || 'OWNED'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      {block.status === 'ACTIVE' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-400" />
                      )}
                      <span className={`text-xs font-bold tracking-wider uppercase ${block.status === 'ACTIVE' ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {block.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-slate-700">
                      {block.warden ? `${block.warden.firstName} ${block.warden.lastName}` : 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-indigo-600 hover:text-indigo-900 text-xs font-semibold">Manage Floors</button>
                      <button onClick={() => openModal(block)} className="text-emerald-600 hover:text-emerald-900 text-xs font-semibold">Edit</button>
                      <button onClick={() => handleDelete(block.id)} className="text-rose-500 hover:text-rose-700 text-xs font-semibold">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {loading && <div className="py-10 text-center"><LoadingSpinner /></div>}
        {!loading && blocks.map(block => (
          <div key={block.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0 text-xs border border-blue-100">
                  {block.blockCode || 'BLK'}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{block.blockName}</p>
                  <p className="text-[11px] font-semibold text-slate-500">{block.capacity} Beds • {block.totalFloors} Floors</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                block.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-200'
              }`}>
                {block.status}
              </span>
            </div>
            <div className="mt-4 flex gap-2 pt-3 border-t border-slate-50">
              <button className="flex-1 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg">Floors</button>
              <button onClick={() => openModal(block)} className="flex-1 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg">Edit</button>
              <button onClick={() => handleDelete(block.id)} className="flex-1 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600"/>
                {editingBlock ? 'Edit Hostel Block' : 'Add New Hostel Block'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  
                  <SectionHeader title="Section 1 — Basic Information" />
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Block Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.blockName}
                      onChange={(e) => setFormData({ ...formData, blockName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. Ganga Boys Hostel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Block Code <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.blockCode}
                      onChange={(e) => setFormData({ ...formData, blockCode: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase"
                      placeholder="e.g. BLK-A"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Enter a brief description of the block"
                      rows={2}
                    />
                  </div>

                  <SectionHeader title="Section 2 — Classification" />

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Gender Type <span className="text-red-500">*</span></label>
                    <select
                      value={formData.genderType}
                      onChange={(e) => setFormData({ ...formData, genderType: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="BOYS">Boys Only</option>
                      <option value="GIRLS">Girls Only</option>
                      <option value="MIXED">Mixed (Co-ed)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Building Type <span className="text-red-500">*</span></label>
                    <select
                      value={formData.buildingType}
                      onChange={(e) => setFormData({ ...formData, buildingType: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="OWNED">Owned Property</option>
                      <option value="LEASED">Leased Property</option>
                      <option value="TEMPORARY">Temporary Setup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Status <span className="text-red-500">*</span></label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="ACTIVE">Active & Operational</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="MAINTENANCE">Under Maintenance</option>
                    </select>
                  </div>

                  <SectionHeader title="Section 3 — Capacity & Structure" />

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Capacity (Beds) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Total Floors <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.totalFloors}
                      onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Warden Assignment ID <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1"
                      value={formData.wardenId}
                      onChange={(e) => setFormData({ ...formData, wardenId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <SectionHeader title="Section 4 — Operations" />

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Emergency Contact Number</label>
                    <input
                      type="tel"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="+91..."
                    />
                  </div>
                  <div className="col-span-full grid grid-cols-3 gap-4 pt-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={formData.rfidEnabled}
                        onChange={(e) => setFormData({...formData, rfidEnabled: e.target.checked})}
                      />
                      RFID Enabled
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={formData.biometricEnabled}
                        onChange={(e) => setFormData({...formData, biometricEnabled: e.target.checked})}
                      />
                      Biometric Enabled
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={formData.messAttached}
                        onChange={(e) => setFormData({...formData, messAttached: e.target.checked})}
                      />
                      Mess Attached
                    </label>
                  </div>

                  <SectionHeader title="Section 5 — System" />

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Academic Year ID <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.academicYearId}
                      onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Remarks</label>
                    <textarea
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Any system remarks or internal notes"
                      rows={2}
                    />
                  </div>

                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors shadow-sm"
                >
                  {editingBlock ? 'Save Changes' : 'Create Block Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
