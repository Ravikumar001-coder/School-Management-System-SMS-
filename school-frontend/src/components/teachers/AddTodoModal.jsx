import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const AddTodoModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [todoInput, setTodoInput] = useState({ title: '', priority: 'MEDIUM' });

  useEffect(() => {
    if (initialData) {
      setTodoInput({ 
        title: initialData.title || '', 
        priority: initialData.priority?.toUpperCase() || 'MEDIUM' 
      });
    } else {
      setTodoInput({ title: '', priority: 'MEDIUM' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-0">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white rounded-[2.5rem] w-full max-w-md relative z-10 shadow-2xl overflow-hidden animate-slide-up">
        <div className="p-8 pb-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-slate-900">{initialData ? 'Edit Task' : 'New Task'}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
              <FiX size={20} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Task Title</label>
              <input 
                autoFocus
                type="text" 
                value={todoInput.title}
                onChange={(e) => setTodoInput({...todoInput, title: e.target.value})}
                placeholder="e.g. Check Grade 10-A assignments"
                className="w-full h-14 bg-slate-50 rounded-2xl px-6 outline-none border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Priority Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                  <button 
                    key={p}
                    onClick={() => setTodoInput({...todoInput, priority: p})}
                    className={`py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all border-2 
                      ${todoInput.priority === p 
                        ? (p === 'HIGH' ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20' : 
                           p === 'MEDIUM' ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 
                           'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20')
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-8 pt-6 bg-slate-50">
          <button 
            onClick={() => onSave(todoInput)}
            disabled={!todoInput.title.trim()}
            className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-3xl font-black text-sm tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
          >
            {initialData ? 'UPDATE TASK' : 'CREATE TASK'} &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTodoModal;
