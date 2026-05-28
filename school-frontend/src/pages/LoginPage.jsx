// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import api from '../api/axios';
import Button from '../components/common/Button';

/**
 * Enterprise Login Page
 * Features:
 * - Multi-role aware routing
 * - Captcha / Brute-force protection
 * - Global Toast notifications
 * - Shared Component Library (Button)
 */
const LoginPage = () => {
  const [form, setForm]           = useState({ identifier: '', password: '', captchaAnswer: '', captchaChallenge: '' });
  const [showPassword, setShowPw] = useState(false);
  const [loading, setLoading]     = useState(false);
  
  // Security states
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaChallenge, setCaptchaChallenge] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(null);

  const { login }                 = useAuth();
  const navigate                  = useNavigate();
  const toast                     = useToast();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await api.post('/auth/login', {
        ...form,
        captchaChallenge: captchaChallenge
      });
      const data = res.data;
      
      login(
        {
          username:  data.username ?? data.email,
          email:     data.email,
          firstName: data.firstName,
          lastName:  data.lastName,
          role:      (data.roles || [])[0]?.replace(/^ROLE_/, '').toUpperCase(),
          roles:     data.roles,
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
      
      // Security metadata updates
      if (data?.captchaRequired) {
        setCaptchaRequired(true);
        setCaptchaChallenge(data.captchaChallenge || '');
      }
      
      if (data?.remainingAttempts !== undefined) {
        setRemainingAttempts(data.remainingAttempts);
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

  return (
    <div className="min-h-screen bg-[#e8eaed] flex flex-col animate-fade-in">

      {/* TOPBAR SIMULATION */}
      <nav className="bg-white h-14 flex items-center justify-end px-6 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center font-bold text-gray-400">
            ?
          </div>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm px-10 py-12 transform transition-all">
          
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold tracking-tight">
              <span className="text-blue-600">School</span>
              <span className="text-gray-400 font-medium"> Management</span>
            </h2>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Login</h1>
            <p className="text-gray-400 text-sm">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                name="identifier"
                value={form.identifier}
                onChange={handleChange}
                placeholder="Username or Email"
                required
                className="input"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
              </button>
            </div>

            {captchaRequired && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 animate-bounce-in">
                <label className="block text-xs font-bold text-blue-800 mb-2 uppercase tracking-widest">
                  Security Check
                </label>
                <div className="flex items-center gap-3">
                  <div className="bg-white px-3 py-2 rounded-lg border border-blue-200 font-mono font-extrabold text-blue-900 select-none shadow-sm">
                    {captchaChallenge} = ?
                  </div>
                  <input
                    type="text"
                    name="captchaAnswer"
                    value={form.captchaAnswer}
                    onChange={handleChange}
                    placeholder="Result"
                    required
                    className="flex-1 input !py-2"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full !py-3.5"
            >
              Sign In
            </Button>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="remember-me" className="ml-2 text-xs text-gray-500">Remember me</label>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.location.href = 'mailto:admin@school.com?subject=Password%20Reset%20Request';
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300">
          <span className="text-xl">💬</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
