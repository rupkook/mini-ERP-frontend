import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';
import { Lock } from 'lucide-react';
import api from '../../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        dispatch(login({ token: data.data.token, user: data.data.user }));
        navigate('/');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 sm:rounded-3xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 border border-purple-100">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Admin Access
            </h2>
            <p className="text-sm text-slate-500 mt-2 text-center">
              Please log in to manage your Mini ERP dashboard.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@erp.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-700">Forgot?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500" />
              <label className="ml-2 block text-sm text-slate-600">Remember me</label>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-black hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </div>
            
            <div className="text-xs text-slate-400 text-center mt-4 leading-relaxed">
              Demo Credentials: <br/>
              admin@erp.com / admin <br/>
              manager@erp.com / admin <br/>
              employee@erp.com / admin
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
