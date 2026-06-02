import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import { useToast } from '../../context/ToastContext';
import axios from '../../api/axios';
import { Trash2, Plus, Building2 } from 'lucide-react';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/departments');
      setDepartments(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await axios.post('/departments', { name });
      toast.success('Department created');
      setName('');
      fetchDepartments();
    } catch (err) {
      toast.error('Failed to create department');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await axios.delete(`/departments/${id}`);
      toast.success('Department deleted');
      fetchDepartments();
    } catch (err) {
      toast.error('Failed to delete department');
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Departments Management" 
        subtitle="Manage academic and administrative departments"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Add Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAdd} className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Plus size={20} className="text-[#1E40AF]" /> New Department
            </h3>
            <FormField label="Department Name" required>
              <input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Science, Arts, HR"
                className="input"
                required
              />
            </FormField>
            <Button type="submit" loading={saving} fullWidth>
              Add Department
            </Button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Existing Departments</h3>
              <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-500 font-bold uppercase tracking-wider">
                {departments.length} Units
              </span>
            </div>
            
            {loading ? (
              <div className="p-20 text-center text-slate-400">Loading...</div>
            ) : departments.length === 0 ? (
              <div className="p-20 text-center text-slate-400">No departments found.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {departments.map(dept => (
                  <div key={dept.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] text-[#1E40AF] flex items-center justify-center">
                        <Building2 size={20} />
                      </div>
                      <span className="font-semibold text-slate-700">{dept.name}</span>
                    </div>
                    <button 
                      onClick={() => handleDelete(dept.id)}
                      aria-label={`Delete department ${dept.name}`}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
