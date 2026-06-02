// src/pages/admin/SessionDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DEVICE_ICONS = { Mobile: '📱', Tablet: '📟', Desktop: '🖥️' };

const SessionCard = ({ session, onRevoke, revoking }) => {
  const ago = (ts) => {
    if (!ts) return 'Unknown';
    const seconds = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (seconds < 60)   return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className={`relative bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border p-5 transition-all
      ${session.currentSession ? 'border-blue-400 ring-1 ring-blue-200' : 'border-[#f1f5f9]'}`}>

      {session.currentSession && (
        <span className="absolute top-3 right-3 text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
          THIS SESSION
        </span>
      )}

      <div className="flex items-start gap-4">
        <div className="text-3xl mt-1">{DEVICE_ICONS[session.deviceType] || '💻'}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-800">
              {session.username ? <span className="text-blue-600 mr-2">[{session.username}]</span> : ''}
              {session.deviceName || 'Unknown Device'}
            </h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {session.browser || 'Unknown Browser'}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-500">
            <span>🌐 IP: {session.ip || 'Unknown'}</span>
            <span>📅 Created: {session.loginTime || session.createdAt ? new Date(session.loginTime || session.createdAt).toLocaleDateString() : '—'}</span>
            <span className="col-span-2 text-[10px] text-gray-300 font-mono truncate">{session.sessionId}</span>
          </div>
        </div>
      </div>

      {!session.currentSession && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          <button
            onClick={() => onRevoke(session.sessionId)}
            disabled={revoking === session.sessionId}
            className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-40"
          >
            {revoking === session.sessionId ? 'Revoking...' : '🔒 Revoke this session'}
          </button>
        </div>
      )}
    </div>
  );
};

const SessionDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [sessions,  setSessions]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [revoking,  setRevoking]  = useState(null);
  const [revokeAll, setRevokeAll] = useState(false);

  const isAdmin = user?.roles?.some(r => ['ADMIN', 'SUPERADMIN'].includes(r.replace(/^ROLE_/, '')));

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      // Admin sees everything, others see only theirs
      const endpoint = isAdmin ? '/admin/sessions/active' : '/sessions';
      const res = await api.get(endpoint);
      const data = res.data?.data ?? res.data ?? [];
      setSessions(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load active sessions.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, toast]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const handleRevoke = async (sessionId) => {
    setRevoking(sessionId);
    try {
      const endpoint = isAdmin ? `/admin/sessions/${sessionId}` : `/sessions/${sessionId}`;
      await api.delete(endpoint);
      toast.success('Session revoked.');
      fetchSessions();
    } catch {
      toast.error('Failed to revoke session.');
    } finally {
      setRevoking(null);
    }
  };

  const handleRevokeAll = async () => {
    setRevokeAll(true);
    try {
      const res = await api.delete('/sessions/others');
      const count = res.data?.revokedCount ?? 0;
      toast.success(`${count} other session(s) revoked.`);
      fetchSessions();
    } catch {
      toast.error('Failed to revoke sessions.');
    } finally {
      setRevokeAll(false);
    }
  };

  const otherSessions = sessions.filter(s => !s.currentSession);

  return (
    <>
      <PageHeader
        title={isAdmin ? "System Session Audit" : "Active Sessions"}
        subtitle={isAdmin 
          ? `Monitoring ${sessions.length} active JWT sessions across the entire system`
          : `${sessions.length} active session${sessions.length !== 1 ? 's' : ''} across your devices`}
        actions={
          isAdmin ? (
            <button 
              onClick={() => navigate(-1)}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-[16px] min-h-[44px] text-sm font-bold hover:bg-gray-200"
            >
              Back
            </button>
          ) : (
            otherSessions.length > 0 && (
              <button
                onClick={handleRevokeAll}
                disabled={revokeAll}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-[16px] min-h-[44px] font-bold text-sm hover:bg-red-700 shadow-md transition disabled:opacity-50"
              >
                {revokeAll ? 'Revoking...' : `🔒 Logout ${otherSessions.length} other device(s)`}
              </button>
            )
          )
        }
      />

      {/* Security tip */}
      <div className="bg-amber-50 rounded-[16px] border border-amber-200 px-5 py-3 mb-5 text-sm text-amber-700 flex justify-between items-center">
        <span>
          {isAdmin 
            ? "🛡️ Administrative Mode: You are viewing all active logins. Terminating a session will instantly invalidate the user's JWT."
            : "⚠️ If you see a session you don't recognise, revoke it immediately and change your password."}
        </span>
        {isAdmin && (
           <button onClick={fetchSessions} className="text-amber-800 font-bold hover:underline">Refresh List</button>
        )}
      </div>

      {loading ? (
        <div className="py-16"><LoadingSpinner /></div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🔐</div>
          <p className="font-medium">No active sessions found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Current session first */}
          {sessions.filter(s => s.currentSession).map(s => (
            <SessionCard key={s.sessionId} session={s} onRevoke={handleRevoke} revoking={revoking} />
          ))}
          {sessions.filter(s => !s.currentSession).map(s => (
            <SessionCard key={s.sessionId} session={s} onRevoke={handleRevoke} revoking={revoking} />
          ))}
        </div>
      )}

      {/* Summary */}
      {!loading && sessions.length > 0 && (
        <div className="mt-6 bg-white rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] p-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-2xl font-bold text-gray-800">{sessions.length}</p>
              <p className="text-gray-500 text-xs mt-1">Total Sessions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {sessions.filter(s => s.deviceType === 'Desktop').length}
              </p>
              <p className="text-gray-500 text-xs mt-1">Desktop</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {sessions.filter(s => s.deviceType === 'Mobile' || s.deviceType === 'Tablet').length}
              </p>
              <p className="text-gray-500 text-xs mt-1">Mobile / Tablet</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionDashboard;
