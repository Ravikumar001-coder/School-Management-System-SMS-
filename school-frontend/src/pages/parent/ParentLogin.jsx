import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Loader2 } from 'lucide-react';

const ParentLogin = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { login } = useAuth();
    
    const [step, setStep] = useState(1); // 1: Select Method/Enter Details, 2: OTP Entry
    const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' or 'password'
    
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        if (mobile.length !== 10) return toast.warning('Enter 10-digit mobile number.');
        setLoading(true);
        try {
            await api.post('/parent/auth/request-otp', { mobileNumber: mobile });
            toast.success('OTP sent successfully!');
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/parent/auth/verify-otp', { mobileNumber: mobile, otpCode: otp });
            const { token, parent } = res.data.data;
            login({ ...parent, roles: ['PARENT'] }, token);
            
            toast.success(`Welcome back, ${parent.name}!`);
            navigate('/parent/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        if (mobile.length !== 10) return toast.warning('Enter 10-digit mobile number.');
        if (!studentId) return toast.warning('Enter Student ID.');
        
        setLoading(true);
        try {
            const res = await api.post('/parent/auth/login-password', { 
                mobileNumber: mobile, 
                studentId: studentId.trim() 
            });
            const { token, parent } = res.data.data;
            
            login({ ...parent, roles: ['PARENT'] }, token);
            
            toast.success(`Welcome back, ${parent.name}!`);
            navigate('/parent/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid Mobile or Student ID.');
        } finally {
            setLoading(false);
        }
    };

    // Styling constants matching the provided CSS tokens
    const shadowNeumorphic = "shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8),15px_15px_30px_rgba(0,0,0,0.05)]";
    const shadowNeumorphicInset = "shadow-[inset_4px_4px_10px_rgba(0,0,0,0.05),inset_-4px_-4px_10px_rgba(255,255,255,0.8)]";
    const shadowNeumorphicBtn = "shadow-[4px_4px_10px_rgba(0,0,0,0.1),-2px_-2px_10px_rgba(255,255,255,0.9)]";

    return (
        <div className="bg-slate-50 font-sans text-slate-800 antialiased min-h-screen flex flex-col justify-center items-center p-4 md:p-8">
            <main className="w-full max-w-md mx-auto">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <h1 className="font-bold text-2xl md:text-3xl text-blue-800 mb-2">EduSMS</h1>
                    <h2 className="font-semibold text-xl text-slate-600">Parent Portal</h2>
                    <p className="text-sm text-slate-500 mt-1">Access your child's academic updates</p>
                </div>

                {/* Login Card */}
                <div className={`bg-white rounded-xl ${shadowNeumorphic} p-6 md:p-8 border border-slate-100`}>
                    
                    {/* Tabs */}
                    {step === 1 && (
                        <div className={`flex bg-slate-50 rounded-lg p-1 mb-8 ${shadowNeumorphicInset}`} role="tablist">
                            <button 
                                onClick={() => setLoginMethod('otp')}
                                className={`flex-1 py-2 px-4 rounded-md text-xs text-center transition-all duration-300 focus:outline-none ${loginMethod === 'otp' ? `bg-white ${shadowNeumorphic} text-blue-800 font-semibold` : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                OTP Login
                            </button>
                            <button 
                                onClick={() => setLoginMethod('password')}
                                className={`flex-1 py-2 px-4 rounded-md text-xs text-center transition-all duration-300 focus:outline-none ${loginMethod === 'password' ? `bg-white ${shadowNeumorphic} text-blue-800 font-semibold` : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                Student ID Login
                            </button>
                        </div>
                    )}

                    {step === 1 ? (
                        <>
                            {/* OTP Login Form */}
                            {loginMethod === 'otp' && (
                                <form onSubmit={handleRequestOtp} className="space-y-6 animate-fade-in">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-medium text-slate-600 ml-1">Registered Mobile Number</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 material-symbols-outlined">phone_iphone</span>
                                            <input 
                                                required
                                                type="tel"
                                                pattern="[0-9]{10}"
                                                value={mobile}
                                                onChange={e => setMobile(e.target.value)}
                                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 rounded-lg ${shadowNeumorphicInset} border-none focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm text-slate-800 transition-shadow`}
                                                placeholder="9876543210"
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className={`w-full py-3 bg-blue-800 text-white rounded-lg ${shadowNeumorphicBtn} hover:bg-blue-900 transition-all duration-200 font-semibold text-sm flex justify-center items-center gap-2 disabled:opacity-50`}
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                            <>
                                                <span>Send OTP</span>
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            {/* Password Login Form */}
                            {loginMethod === 'password' && (
                                <form onSubmit={handlePasswordLogin} className="space-y-6 animate-fade-in">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-medium text-slate-600 ml-1">Registered Mobile Number</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 material-symbols-outlined">phone_iphone</span>
                                            <input 
                                                required
                                                type="tel"
                                                pattern="[0-9]{10}"
                                                value={mobile}
                                                onChange={e => setMobile(e.target.value)}
                                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 rounded-lg ${shadowNeumorphicInset} border-none focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm text-slate-800 transition-shadow`}
                                                placeholder="9876543210"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center ml-1">
                                            <label className="block text-xs font-medium text-slate-600">Child's Student ID</label>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 material-symbols-outlined">badge</span>
                                            <input 
                                                required
                                                type={showPassword ? "text" : "password"}
                                                value={studentId}
                                                onChange={e => setStudentId(e.target.value)}
                                                className={`w-full pl-10 pr-10 py-3 bg-slate-50 rounded-lg ${shadowNeumorphicInset} border-none focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm text-slate-800 transition-shadow`}
                                                placeholder="STU-202X-XXX"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none material-symbols-outlined"
                                            >
                                                {showPassword ? 'visibility' : 'visibility_off'}
                                            </button>
                                        </div>
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className={`w-full py-3 bg-blue-800 text-white rounded-lg ${shadowNeumorphicBtn} hover:bg-blue-900 transition-all duration-200 font-semibold text-sm flex justify-center items-center gap-2 disabled:opacity-50`}
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                            <>
                                                <span>Login</span>
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>login</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </>
                    ) : (
                        /* OTP Verification Form */
                        <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
                            <div className="space-y-2 text-center">
                                <label className="block text-sm font-bold text-slate-800">Verification Code</label>
                                <p className="text-xs text-slate-500 mb-4">Enter 6-digit code sent to +91 {mobile}</p>
                                <input 
                                    required
                                    autoFocus
                                    type="text"
                                    maxLength="6"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    placeholder="000000"
                                    className={`w-full h-16 bg-slate-50 ${shadowNeumorphicInset} border-none rounded-lg text-center outline-none focus:ring-2 focus:ring-blue-800 transition-all text-2xl font-bold tracking-[0.5em] text-blue-800`}
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 bg-blue-800 text-white rounded-lg ${shadowNeumorphicBtn} hover:bg-blue-900 transition-all duration-200 font-semibold text-sm flex justify-center items-center gap-2 disabled:opacity-50`}
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Complete Login</>}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setStep(1)} 
                                className="w-full text-center text-xs font-medium text-slate-500 hover:text-blue-800 mt-2"
                            >
                                Change Mobile Number
                            </button>
                        </form>
                    )}

                    {/* Support Link */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-500">
                            Need help accessing your account? <br />
                            <a href="#" className="text-blue-800 hover:text-blue-900 font-semibold transition-colors mt-1 inline-block">Contact School Support</a>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-6 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-200 mt-auto bg-slate-50">
                <div className="font-semibold text-sm text-slate-900">EduSMS Admin Portal</div>
                <div className="flex gap-4 text-xs font-medium text-slate-500">
                    <a href="#" className="hover:text-blue-800 underline transition-all duration-200">Privacy Policy</a>
                    <a href="#" className="hover:text-blue-800 underline transition-all duration-200">Terms of Service</a>
                    <a href="#" className="hover:text-blue-800 underline transition-all duration-200">Support</a>
                </div>
                <div className="text-xs font-medium text-slate-500">© 2024 EduSMS Admin Portal. All rights reserved.</div>
            </footer>
        </div>
    );
};

export default ParentLogin;
