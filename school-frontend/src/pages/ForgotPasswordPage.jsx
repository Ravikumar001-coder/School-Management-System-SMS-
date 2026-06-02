import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form states
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    
    // OTP states
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    // Password states
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password/request', { email, role });
            toast.success('Recovery code sent to your email.');
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send recovery code.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length < 6) return toast.error('Please enter the full 6-digit code.');

        setLoading(true);
        try {
            await api.post('/auth/forgot-password/verify', { email, otpCode });
            toast.success('Code verified successfully.');
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid code.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) return toast.error('Password must be at least 6 characters.');
        if (newPassword !== confirmPassword) return toast.error('Passwords do not match.');

        setLoading(true);
        try {
            const otpCode = otp.join('');
            await api.post('/auth/forgot-password/reset', { email, otpCode, newPassword });
            toast.success('Password successfully reset! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    const cardStyle = "bg-white border border-slate-200 rounded-xl shadow-[4px_4px_15px_rgba(0,0,0,0.05),2px_2px_4px_rgba(0,0,0,0.02)]";
    const inputStyle = "w-full bg-slate-50 border border-slate-100 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all";
    const btnPrimary = "w-full bg-blue-800 text-white rounded-lg shadow-[0_4px_6px_-1px_rgba(30,64,175,0.3),0_2px_4px_-1px_rgba(30,64,175,0.2)] hover:bg-blue-700 active:scale-95 transition-all font-semibold py-3 px-6 flex justify-center items-center gap-2 disabled:opacity-50";

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white shadow-[4px_4px_15px_rgba(0,0,0,0.05)] h-16 w-full flex items-center px-4 md:px-8">
                <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-800 text-3xl">school</span>
                        <span className="font-bold text-xl text-blue-800">EduSMS Admin Portal</span>
                    </div>
                    <Link to="/login" className="text-slate-600 hover:text-blue-800 transition-colors flex items-center gap-1 text-sm font-medium">
                        Back to Login
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md relative z-10">
                    
                    {/* Step Indicators */}
                    <div className="flex justify-between items-center mb-6 px-4">
                        <div className={`w-1/3 h-1 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-blue-800' : 'bg-slate-200'}`}></div>
                        <div className="w-4"></div>
                        <div className={`w-1/3 h-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-blue-800' : 'bg-slate-200'}`}></div>
                        <div className="w-4"></div>
                        <div className={`w-1/3 h-1 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-blue-800' : 'bg-slate-200'}`}></div>
                    </div>

                    <div className={`${cardStyle} p-6 md:p-8 overflow-hidden relative`}>
                        
                        {/* Step 1: Email & Role */}
                        {step === 1 && (
                            <div className="w-full">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                        <span className="material-symbols-outlined text-blue-800 text-3xl">lock_reset</span>
                                    </div>
                                    <h2 className="font-bold text-2xl text-slate-900 mb-2">Reset Password</h2>
                                    <p className="text-slate-600 text-sm">Enter your email and role to receive a recovery code.</p>
                                </div>
                                <form className="space-y-4" onSubmit={handleRequestOtp}>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-slate-500 text-lg">mail</span>
                                            </div>
                                            <input 
                                                type="email" 
                                                required 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className={`${inputStyle} pl-10 pr-3 py-2 text-sm`}
                                                placeholder="admin@school.edu"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">Account Role</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-slate-500 text-lg">badge</span>
                                            </div>
                                            <select 
                                                required
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className={`${inputStyle} pl-10 pr-3 py-2 text-sm appearance-none`}
                                            >
                                                <option value="" disabled>Select your role</option>
                                                <option value="super_admin">Super Administrator</option>
                                                <option value="principal">Principal</option>
                                                <option value="staff">Administrative Staff</option>
                                                <option value="teacher">Teacher</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-slate-500">expand_more</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex flex-col gap-3">
                                        <button type="submit" disabled={loading} className={btnPrimary}>
                                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                                <>Send Recovery Code <span className="material-symbols-outlined text-lg">arrow_forward</span></>
                                            )}
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => navigate('/login')}
                                            className="w-full bg-slate-100 text-slate-700 rounded-lg shadow-sm hover:bg-slate-200 active:scale-95 transition-all font-medium text-sm py-3 px-6 flex justify-center items-center gap-2"
                                        >
                                            Back to Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Step 2: Verify Code */}
                        {step === 2 && (
                            <div className="w-full">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                        <span className="material-symbols-outlined text-blue-800 text-3xl">mark_email_read</span>
                                    </div>
                                    <h2 className="font-bold text-2xl text-slate-900 mb-2">Check Your Email</h2>
                                    <p className="text-slate-600 text-sm">We've sent a 6-digit code to <span className="font-bold text-slate-900">{email}</span>.</p>
                                </div>
                                <form className="space-y-4" onSubmit={handleVerifyOtp}>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-3 text-center">Enter Verification Code</label>
                                        <div className="flex justify-between gap-2 mb-2">
                                            {otp.map((digit, i) => (
                                                <input 
                                                    key={i}
                                                    id={`otp-${i}`}
                                                    type="text"
                                                    maxLength="1"
                                                    required
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                                    className={`${inputStyle} w-12 h-12 text-center text-xl font-bold text-blue-800`}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-center mt-2">
                                            <button type="button" onClick={handleRequestOtp} disabled={loading} className="text-blue-700 text-sm font-medium hover:underline">
                                                Resend Code
                                            </button>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex flex-col gap-3">
                                        <button type="submit" disabled={loading} className={btnPrimary}>
                                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                                <>Verify Code <span className="material-symbols-outlined text-lg">check_circle</span></>
                                            )}
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setStep(1)}
                                            className="text-slate-600 text-sm font-medium hover:text-blue-800 flex items-center justify-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">arrow_back</span> Back
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <div className="w-full">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                        <span className="material-symbols-outlined text-green-700 text-3xl">key</span>
                                    </div>
                                    <h2 className="font-bold text-2xl text-slate-900 mb-2">Create New Password</h2>
                                    <p className="text-slate-600 text-sm">Your new password must be different from previous passwords.</p>
                                </div>
                                <form className="space-y-4" onSubmit={handleResetPassword}>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">New Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-slate-500 text-lg">lock</span>
                                            </div>
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                required 
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className={`${inputStyle} pl-10 pr-10 py-2 text-sm`}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                                <span className="material-symbols-outlined text-slate-500 hover:text-slate-900 text-lg">
                                                    {showPassword ? 'visibility' : 'visibility_off'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">Confirm New Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-slate-500 text-lg">lock_clock</span>
                                            </div>
                                            <input 
                                                type="password" 
                                                required 
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className={`${inputStyle} pl-10 pr-3 py-2 text-sm`}
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button type="submit" disabled={loading} className={`${btnPrimary} !bg-green-700 hover:!bg-green-800 shadow-[0_4px_6px_-1px_rgba(21,128,61,0.3),0_2px_4px_-1px_rgba(21,128,61,0.2)]`}>
                                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                                <>Reset Password <span className="material-symbols-outlined text-lg">login</span></>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </main>
            
            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-6 px-4 md:px-8 w-full mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                        EduSMS Admin Portal
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="text-slate-500 hover:text-blue-800 underline transition-all text-xs font-medium">Privacy Policy</a>
                        <a href="#" className="text-slate-500 hover:text-blue-800 underline transition-all text-xs font-medium">Terms of Service</a>
                        <a href="#" className="text-slate-500 hover:text-blue-800 underline transition-all text-xs font-medium">Support</a>
                    </div>
                    <div className="text-xs font-medium text-slate-500">
                        © 2024 EduSMS Admin Portal. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ForgotPasswordPage;
