// src/pages/parent/ParentLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const ParentLogin = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Mobile/Main, 2: OTP Entry
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' or 'password'
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) return toast.warning('Enter 10-digit mobile.');
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
    if (mobile.length !== 10) return toast.warning('Enter 10-digit mobile.');
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[440px] animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20 rotate-3">
             <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Parent Portal</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">India's First Secure Parent Ecosystem</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8">
          {/* Login Method Toggle */}
          {step === 1 && (
            <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
              <button 
                onClick={() => setLoginMethod('otp')}
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${loginMethod === 'otp' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                OTP LOGIN
              </button>
              <button 
                onClick={() => setLoginMethod('password')}
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${loginMethod === 'password' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                STUDENT ID
              </button>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={loginMethod === 'otp' ? handleRequestOtp : handlePasswordLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Registered Mobile</label>
                <div className="relative group">
                  <Smartphone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    required
                    type="tel"
                    pattern="[0-9]{10}"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="Mobile Number"
                    className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-6 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold tracking-widest"
                  />
                </div>
              </div>

              {loginMethod === 'password' && (
                <div className="space-y-2 animate-slide-up">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Child Student ID</label>
                  <div className="relative group">
                    <ShieldCheck size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      required
                      type="text"
                      value={studentId}
                      onChange={e => setStudentId(e.target.value)}
                      placeholder="STU-202X-XXX"
                      className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-6 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold tracking-wider uppercase"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 px-1 italic">Use any child's Student ID as password.</p>
                </div>
              )}

              <button 
                disabled={loading}
                className={`w-full h-14 ${loginMethod === 'otp' ? 'bg-indigo-600 shadow-indigo-500/30' : 'bg-emerald-600 shadow-emerald-500/30'} text-white rounded-2xl font-black text-base shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    {loginMethod === 'otp' ? 'Get OTP' : 'Login Securely'} 
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-slide-up">
              <div className="space-y-2 text-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verification Code</label>
                <p className="text-xs text-slate-500 mb-4 font-medium">Enter 6-digit code sent to +91 {mobile}</p>
                <input 
                  required
                  autoFocus
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="000000"
                  className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-2xl text-center outline-none focus:bg-white focus:border-indigo-600 transition-all text-3xl font-black tracking-[0.5em] text-indigo-600"
                />
              </div>

              <button 
                disabled={loading}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-base shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Complete Login</>}
              </button>

              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="w-full text-center text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest"
              >
                Change Details
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered by Antigravity ERP</p>
        </div>
      </div>
    </div>
  );
};

export default ParentLogin;
