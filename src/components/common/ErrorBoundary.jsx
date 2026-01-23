import React from 'react';

/**
 * ErrorBoundary - Error Boundary Component
 * 
 * Features:
 * - Catch JavaScript errors in child component tree
 * - Log error information to console
 * - Display friendly error UI
 * - Provide error recovery options
 * 
 * Use Cases:
 * - Prevent entire application from crashing
 * - Provide better user experience in production
 * - Capture injected errors in chaos engineering
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  /**
   * Called when child component throws an error
   * Update state to display error UI
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * Capture error details
   * Log error information
   */
  componentDidCatch(error, errorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error location:', errorInfo.componentStack);

    // Update state
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // In production, errors can be sent to error tracking services
    // e.g.: Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // sendErrorToService(error, errorInfo);
    }
  }

  /**
   * Reset error state
   * Attempt to recover application
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  /**
   * Refresh page
   * Completely reset application state
   */
  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Oops! Something went wrong
            </h1>

            {/* Error Description */}
            <p className="text-gray-600 text-center mb-6">
              The application encountered an unexpected error. This may be due to a code issue or network problem.
            </p>

            {/* Error Details (Development Environment) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  Error Details (visible in development only):
                </h3>
                <pre className="text-xs text-red-700 overflow-x-auto whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <details className="mt-3">
                    <summary className="text-sm text-red-800 cursor-pointer hover:text-red-900">
                      View Component Stack
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 overflow-x-auto whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Error Statistics */}
            {this.state.errorCount > 1 && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  This error has occurred <strong>{this.state.errorCount}</strong> times
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="btn btn-primary px-6 py-3"
              >
                Try to Recover
              </button>
              <button
                onClick={this.handleReload}
                className="btn btn-secondary px-6 py-3"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="btn btn-secondary px-6 py-3"
              >
                Go Back
              </button>
            </div>

            {/* Help Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                If the problem persists, please contact technical support or
                <a href="/" className="text-primary-600 hover:text-primary-700 ml-1">
                  return to home page
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
