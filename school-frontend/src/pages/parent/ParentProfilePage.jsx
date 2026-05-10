import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Phone, MapPin, LogOut, ShieldCheck, Smartphone, BellRing, ChevronRight } from 'lucide-react';

const ParentProfilePage = () => {
    const { user, logout } = useAuth();
    const toast = useToast();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
    };

    const profileSections = [
        {
            title: 'Account Settings',
            items: [
                { icon: Smartphone, label: 'Push Notifications', value: 'Enabled', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { icon: BellRing, label: 'Email Alerts', value: 'On', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { icon: ShieldCheck, label: 'Privacy & Security', value: 'High', color: 'text-amber-600', bg: 'bg-amber-50' }
            ]
        }
    ];

    return (
        <div className="px-6 py-8 pb-32 animate-fade-in">
            {/* Parent Info Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16"></div>
                <div className="relative flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center text-3xl font-black mb-4 shadow-xl shadow-slate-900/20">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user?.firstName} {user?.lastName}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Authorized Parent Account</p>
                </div>

                <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                            <Mail size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                            <p className="text-sm font-bold text-slate-700 truncate">{user?.email || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                            <Phone size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                            <p className="text-sm font-bold text-slate-700">{user?.phoneNumber || '+91 98765 43210'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Sections */}
            {profileSections.map((section, idx) => (
                <div key={idx} className="mb-8">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">{section.title}</h3>
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-50 overflow-hidden">
                        {section.items.map((item, i) => (
                            <button key={i} className={`w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                                        <item.icon size={20} />
                                    </div>
                                    <span className="text-sm font-black text-slate-700">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-400">{item.value}</span>
                                    <ChevronRight size={16} className="text-slate-300" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {/* Logout Button */}
            <button 
                onClick={handleLogout}
                className="w-full h-16 bg-rose-50 text-rose-600 rounded-[2rem] flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-rose-100 active:scale-95 transition-all mt-4 border border-rose-100"
            >
                <LogOut size={20} />
                Sign Out from Portal
            </button>
        </div>
    );
};

export default ParentProfilePage;
