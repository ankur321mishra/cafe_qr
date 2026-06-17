import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[CafeQR ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-stone-900">
          <svg
            className="w-12 h-12 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-xl font-medium text-gray-800 dark:text-gray-100 mt-4">
            Something went wrong
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            An unexpected error occurred. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300 transition-colors"
          >
            Refresh page
          </button>

          {import.meta.env.DEV && (
            <div className="mt-8 w-full max-w-lg">
              <button
                onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                {this.state.showDetails ? 'Hide error details' : 'Show error details'}
              </button>
              {this.state.showDetails && (
                <pre className="mt-4 text-xs text-left bg-gray-50 border border-gray-200 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300 rounded p-3 overflow-auto">
                  <strong>{this.state.error && this.state.error.toString()}</strong>
                  <br />
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
