// src/components/feedback/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ERP Critical Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Interface Crash Detect</h1>
            <p className="text-slate-500 text-sm font-medium mb-8">
              A critical frontend exception occurred. The system state has been preserved for safety.
            </p>
            
            <div className="w-full space-y-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
              >
                <RefreshCcw size={18} />
                Attempt System Restart
              </button>
              <a 
                href="/"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                <Home size={18} />
                Return to Dashboard
              </a>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-slate-50 rounded-xl text-left w-full overflow-auto max-h-40">
                <p className="text-[10px] font-mono text-red-600 break-all">
                  {this.state.error?.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
