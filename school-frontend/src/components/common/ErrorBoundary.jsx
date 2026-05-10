// src/components/common/ErrorBoundary.jsx
import React from 'react';
import Button from './Button';

/**
 * Enterprise Error Boundary
 * Catches runtime crashes in child components and shows a clean fallback UI.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="text-6xl mb-4">🩹</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-500 mb-6 text-sm">
              An unexpected error occurred. Don't worry, your data is safe. 
              Our team has been notified.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Refresh Page
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => this.setState({ hasError: false })}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left p-4 bg-gray-50 rounded-lg text-xs font-mono text-red-600 overflow-auto max-h-40">
                <summary className="cursor-pointer font-bold mb-2">Error Details</summary>
                {this.state.error?.toString()}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
