import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, Users, FileText, Landmark, GraduationCap } from 'lucide-react';
import api from '../../api/axios';

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ students: [], staff: [], transactions: [], pages: [] });
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults({ students: [], staff: [], transactions: [], pages: [] });
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ students: [], staff: [], transactions: [], pages: [] });
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get(`/search/global?q=${query}`);
        if (response.data && response.data.data) {
          setResults(response.data.data);
        }
      } catch (error) {
        console.error("Global search error", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  const hasResults =
    results.students?.length > 0 ||
    results.staff?.length > 0 ||
    results.transactions?.length > 0 ||
    results.pages?.length > 0;

  const handlePageClick = (route) => {
    navigate(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-start justify-center p-4 pt-[10vh]">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <Search size={18} className="text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type at least 2 characters to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-slate-800 text-sm focus:ring-0 outline-none placeholder:text-slate-400"
          />
          {loading ? (
            <Loader2 size={16} className="text-slate-400 animate-spin flex-shrink-0" />
          ) : (
            <button onClick={onClose} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-4 space-y-4">
          {query.trim().length < 2 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
              Search across Students, Staff, Finances, Pages and more
            </div>
          ) : !hasResults && !loading ? (
            <div className="text-center py-8 text-slate-500 text-sm font-medium">
              No results found matching "<span className="font-bold text-slate-800">{query}</span>"
            </div>
          ) : (
            <>
              {/* Pages & Navigation */}
              {results.pages?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <GraduationCap size={12} />
                    Quick Navigation
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.pages.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePageClick(p.route)}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-left transition-all"
                      >
                        <div>
                          <p className="text-xs font-black text-slate-700 leading-tight">{p.title}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{p.category}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Students Section */}
              {results.students?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Users size={12} />
                    Students ({results.students.length})
                  </h4>
                  <div className="space-y-1">
                    {results.students.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handlePageClick(`/admin/students/${s.id}`)}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {s.name[0]}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">{s.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">ID: {s.studentId} • Class: {s.classroom}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-500 font-bold">{s.email}</p>
                          <p className="text-[9px] text-slate-400 font-bold">{s.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff Section */}
              {results.staff?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Users size={12} />
                    Staff Directory ({results.staff.length})
                  </h4>
                  <div className="space-y-1">
                    {results.staff.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => handlePageClick(`/admin/teachers`)}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                            {st.name[0]}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">{st.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Code: {st.employeeCode} • {st.designation} • {st.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-500 font-bold">{st.email}</p>
                          <p className="text-[9px] text-slate-400 font-bold">{st.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transactions Section */}
              {results.transactions?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Landmark size={12} />
                    Fee Transactions ({results.transactions.length})
                  </h4>
                  <div className="space-y-1">
                    {results.transactions.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handlePageClick(`/admin/fees`)}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-xs font-black text-slate-800">{t.receiptNumber}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Student: {t.studentName} • Method: {t.paymentMethod}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-slate-800">₹ {t.amount.toLocaleString()}</p>
                          <p className="text-[9px] text-emerald-500 font-bold">{t.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(GlobalSearchModal);
