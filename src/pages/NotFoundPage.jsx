import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4">
      <h1 className="text-8xl font-light text-gray-200 dark:text-gray-700">404</h1>
      <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mt-4">Page not found</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2">The page you're looking for doesn't exist.</p>
      <Link 
        to="/menu" 
        className="mt-8 bg-gray-900 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 transition-colors"
      >
        Back to menu
      </Link>
    </div>
  );
}
