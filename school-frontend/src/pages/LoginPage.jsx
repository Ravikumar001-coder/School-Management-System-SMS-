import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { Loader2 } from 'lucide-react';
import api from '../api/axios';

const LoginPage = () => {
    const [form, setForm] = useState({ identifier: '', password: '', captchaAnswer: '', role: 'admin' });
    const [showPassword, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Security states
    const [captchaRequired, setCaptchaRequired] = useState(false);
    const [captchaChallenge, setCaptchaChallenge] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', {
                identifier: form.identifier,
                password: form.password,
                captchaAnswer: form.captchaAnswer,
                captchaChallenge: captchaChallenge
            });
            const data = res.data;
            
            login(
                {
                    username: data.username ?? data.email,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: (data.roles || [])[0]?.replace(/^ROLE_/, '').toUpperCase(),
                    roles: data.roles,
                    permissions: data.permissions,
                    studentId: data.studentId ?? null,
                    teacherId: data.teacherId ?? null,
                    firstLogin: !!data.firstLogin,
                },
                data.token
            );

            toast.success(`Welcome back, ${data.firstName}!`);

            if (data.firstLogin) {
                navigate('/change-password');
            } else {
                const rawRoles = data.roles || [];
                const roles = rawRoles.map(r => r.replace(/^ROLE_/, '').toUpperCase());
                
                if (roles.includes('SUPERADMIN') || roles.includes('ADMIN')) navigate('/admin/dashboard');
                else if (roles.includes('TEACHER')) navigate('/teacher/dashboard');
                else navigate('/student/dashboard');
            }
        } catch (err) {
            const data = err.response?.data;
            const errorMsg = data?.message || 'Invalid username or password!';
            
            if (data?.captchaRequired) {
                setCaptchaRequired(true);
                setCaptchaChallenge(data.captchaChallenge || '');
            }
            
            if (data?.remainingAttempts !== undefined) {
                if (data.remainingAttempts > 0 && data.remainingAttempts <= 3) {
                    toast.warning(`${errorMsg} ${data.remainingAttempts} attempts remaining.`);
                } else {
                    toast.error(errorMsg);
                }
            } else {
                toast.error(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    const shadowNeumorphic = "shadow-[4px_4px_15px_rgba(0,0,0,0.05),2px_2px_4px_rgba(0,0,0,0.02),-4px_-4px_15px_rgba(255,255,255,0.9)]";
    const shadowNeumorphicInset = "shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.9)]";
    const shadowNeumorphicBtn = "shadow-[4px_4px_10px_rgba(0,0,0,0.1),-2px_-2px_10px_rgba(255,255,255,0.8)]";

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-800 antialiased bg-slate-50 relative overflow-hidden">
            {/* Decorative Neumorphic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-slate-50 shadow-[20px_20px_60px_#d1d5db,-20px_-20px_60px_#ffffff] opacity-50 pointer-events-none hidden md:block"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-slate-50 shadow-[20px_20px_60px_#d1d5db,-20px_-20px_60px_#ffffff] opacity-40 pointer-events-none hidden md:block"></div>
            
            <main className="flex-grow flex items-center justify-center p-4 md:p-8 relative z-10">
                {/* Login Card */}
                <div className={`w-full max-w-[440px] bg-white rounded-xl ${shadowNeumorphic} p-8 md:p-10 border border-slate-100`}>
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white ${shadowNeumorphic} mb-6 border border-slate-100`}>
                            <span className="material-symbols-outlined text-[32px] text-blue-800" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                        </div>
                        <h1 className="font-bold text-[24px] md:text-[28px] text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-[14px] text-slate-600">Sign in to EduSMS Admin Portal</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Role Selector */}
                        <div className="space-y-2">
                            <label className="block text-[12px] font-medium text-slate-600" htmlFor="role">Select Role</label>
                            <div className="relative">
                                <select 
                                    id="role" 
                                    name="role" 
                                    value={form.role}
                                    onChange={handleChange}
                                    className={`w-full h-[48px] bg-slate-50 border border-slate-100 rounded-lg px-4 appearance-none ${shadowNeumorphicInset} focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent text-slate-800 text-[14px] transition-shadow cursor-pointer`}
                                >
                                    <option value="admin">Administrator</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="staff">Support Staff</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                </div>
                            </div>
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <label className="block text-[12px] font-medium text-slate-600" htmlFor="identifier">Username or Email</label>
                            <input 
                                id="identifier" 
                                name="identifier" 
                                type="text" 
                                required
                                value={form.identifier}
                                onChange={handleChange}
                                placeholder="Enter your username" 
                                className={`w-full h-[48px] bg-slate-50 border border-slate-100 rounded-lg px-4 ${shadowNeumorphicInset} focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent text-slate-800 text-[14px] transition-shadow placeholder-slate-400`}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="block text-[12px] font-medium text-slate-600" htmlFor="password">Password</label>
                                <Link to="/forgot-password" className="text-[12px] font-medium text-blue-800 hover:text-blue-900 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800 rounded">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input 
                                    id="password" 
                                    name="password" 
                                    type={showPassword ? "text" : "password"} 
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password" 
                                    className={`w-full h-[48px] bg-slate-50 border border-slate-100 rounded-lg pl-4 pr-12 ${shadowNeumorphicInset} focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent text-slate-800 text-[14px] transition-shadow placeholder-slate-400`}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPw(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 hover:text-slate-800 transition-colors focus:outline-none rounded-r-lg"
                                >
                                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Captcha */}
                        {captchaRequired && (
                            <div className="space-y-2">
                                <label className="block text-[12px] font-medium text-orange-700">Security Check: {captchaChallenge} = ?</label>
                                <input 
                                    name="captchaAnswer" 
                                    type="text" 
                                    required
                                    value={form.captchaAnswer}
                                    onChange={handleChange}
                                    placeholder="Result" 
                                    className={`w-full h-[48px] bg-orange-50 border border-orange-100 rounded-lg px-4 ${shadowNeumorphicInset} focus:outline-none focus:ring-2 focus:ring-orange-800 focus:border-transparent text-orange-900 text-[14px] transition-shadow`}
                                />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-4 space-y-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`w-full h-[48px] bg-blue-800 text-white font-semibold text-[16px] rounded-lg ${shadowNeumorphicBtn} hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-slate-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70`}
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>
                                        <span>Login</span>
                                        <span className="material-symbols-outlined text-[20px]">login</span>
                                    </>
                                )}
                            </button>
                            
                            <Link to="/parent/login" className="block text-center text-sm text-slate-600 hover:text-blue-800 font-medium mt-4">
                                I am a Parent (OTP Login)
                            </Link>
                        </div>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-8 px-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-200 bg-white mt-auto z-10 relative">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-[16px] text-slate-900">EduSMS</span>
                    <span className="text-[12px] font-medium text-slate-500">© 2024 EduSMS Admin Portal. All rights reserved.</span>
                </div>
                <nav className="flex gap-6">
                    <a href="#" className="text-[12px] font-medium text-slate-500 hover:text-blue-800 underline transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-800 rounded">Privacy Policy</a>
                    <a href="#" className="text-[12px] font-medium text-slate-500 hover:text-blue-800 underline transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-800 rounded">Terms of Service</a>
                    <a href="#" className="text-[12px] font-medium text-slate-500 hover:text-blue-800 underline transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-800 rounded">Support</a>
                </nav>
            </footer>
        </div>
    );
};

export default LoginPage;
