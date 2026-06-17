import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Coffee, Lock, Mail, User, Store, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SignupPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await register(name, email, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cafe-gradient">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
          <Coffee size={32} className="text-brown" />
        </div>
        <h2 className="text-center text-3xl font-serif font-bold text-gray-900 leading-9">
          Join The Brew House
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create your admin account to get started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md slide-up">
        <div className="bg-white py-8 px-4 shadow-xl shadow-brown/5 sm:rounded-2xl sm:px-10 border border-beige/40">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="focus:ring-brown focus:border-brown block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 border bg-gray-50/50"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-brown focus:border-brown block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 border bg-gray-50/50"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-brown focus:border-brown block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 border bg-gray-50/50"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brown-gradient hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown disabled:opacity-70 transition-all gap-2 items-center"
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/admin/login" className="font-medium text-brown hover:text-brown-dark transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
