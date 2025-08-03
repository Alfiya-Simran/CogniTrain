import React, { useState } from 'react';
import { BrainIcon } from './icons';

interface LoginViewProps {
  onLogin: (credentials: { id: string; password?: string }) => boolean;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!id || !password) {
      setError('Please enter both username and password.');
      return;
    }
    const success = onLogin({ id, password });
    if (!success) {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center bg-sky-50 animate-fade-in">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
            <BrainIcon className="h-16 w-16 text-blue-600 mx-auto"/>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
             Cogni<span className="text-blue-600">Train</span> Login
            </h1>
            <p className="mt-4 text-lg text-slate-600">
                Welcome back! Please sign in to your account.
            </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                Username (Use your ID: e.g., 'alex', 'sarah', 'dr.miller')
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={id}
                  onChange={(e) => setId(e.target.value.toLowerCase())}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password (Hint: it's 'password')
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;