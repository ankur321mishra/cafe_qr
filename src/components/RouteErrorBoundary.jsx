import { Component } from 'react';

export default class RouteErrorBoundary extends Component {
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
    console.error('[CafeQR RouteErrorBoundary]', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-white dark:bg-stone-900 border border-red-100 dark:border-red-900 rounded-xl my-4 text-center">
          <svg
            className="w-10 h-10 text-red-400 mx-auto"
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
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100 mt-3">
            Failed to load this page.
          </h2>
          <button
            onClick={this.resetError}
            className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300 transition-colors"
          >
            Try again
          </button>

          {import.meta.env.DEV && (
            <div className="mt-6 w-full text-left">
              <button
                onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                {this.state.showDetails ? 'Hide error details' : 'Show error details'}
              </button>
              {this.state.showDetails && (
                <pre className="mt-3 text-xs bg-gray-50 border border-gray-200 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300 rounded p-3 overflow-auto">
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
