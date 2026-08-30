import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
              An unexpected error occurred while rendering this page. You can refresh or return to the homepage.
            </p>

            {this.state.error && (
              <div className="bg-red-50 text-red-800 p-3 rounded-lg text-left text-xs font-mono mb-6 overflow-x-auto max-h-32 border border-red-200">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <RefreshCw size={15} /> Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#800000] hover:bg-[#680000] text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs transition"
              >
                <Home size={15} /> Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
