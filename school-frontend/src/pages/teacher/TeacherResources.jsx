import React, { useState, useEffect } from 'react';
import { FiFolder, FiFileText, FiDownload, FiCloud, FiChevronRight, FiSearch, FiMoreVertical, FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import { fileApi } from '../../api/fileApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const TeacherResources = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchResources = async () => {
    try {
      const res = await api.get('/teacher/resources');
      setResources(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadRes = await fileApi.upload(file);
      const fileUrl = uploadRes.data?.data;
      
      await api.post('/teacher/resources', {
        title: file.name,
        fileUrl: fileUrl,
        fileType: file.name.split('.').pop().toUpperCase(),
        fileSize: file.size
      });

      toast.success("Resource uploaded successfully");
      fetchResources();
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/teacher/resources/${id}`);
      toast.success("Deleted");
      fetchResources();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredResources = resources.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-20"><LoadingSpinner /></div>;

  return (
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-10 animate-fade-in pb-24 lg:pb-8">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Resource Library</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Shared Teaching Assets</p>
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-72">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search assets..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-12 bg-white rounded-2xl pl-11 pr-4 text-xs font-bold outline-none border border-slate-100 focus:border-indigo-500 shadow-sm"
              />
           </div>
           <label className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg shadow-indigo-100">
              {uploading ? <LoadingSpinner size="sm" /> : <FiPlus size={16} />}
              {uploading ? 'Uploading...' : 'Add New'}
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
           </label>
        </div>
      </div>

      {/* ── RESOURCE CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((r, i) => (
          <div key={r.id} className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-50 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
             <div className="flex items-center gap-5">
                <div className={`w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                   <FiFileText />
                </div>
                <div>
                   <h4 className="font-black text-slate-800 text-sm lg:text-base leading-tight">{r.name}</h4>
                   <p className="text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{r.type} • {r.size} • {r.subject}</p>
                </div>
             </div>
             <div className="flex gap-2">
                <a href={fileApi.toPublicUrl(r.url)} target="_blank" rel="noreferrer" className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                   <FiDownload size={18} />
                </a>
                <button onClick={() => handleDelete(r.id)} className="w-10 h-10 bg-rose-50 text-rose-400 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all">
                   <FiTrash2 size={18} />
                </button>
             </div>
          </div>
        ))}
        {filteredResources.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
             <p className="text-sm font-bold text-slate-400">No resources found in your library.</p>
          </div>
        )}
      </div>

      {/* ── LARGE CLOUD BANNER ── */}
      <div className="bg-[#1e293b] rounded-[2.5rem] lg:rounded-[3.5rem] p-10 lg:p-24 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl shadow-slate-900/20">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-2xl"></div>

         <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-indigo-400 mb-8 border border-white/10 shadow-inner">
               <FiCloud size={40} />
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white mb-4 tracking-tight">Cloud Storage Active</h2>
            <p className="text-sm lg:text-base font-bold text-slate-400 max-w-lg leading-relaxed">
               All your teaching materials are securely synced. You have {resources.length} files stored.
            </p>
         </div>
      </div>

    </div>
  );
};

export default TeacherResources;
