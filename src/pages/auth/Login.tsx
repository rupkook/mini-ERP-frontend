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
    <div className="min-h-screen bg-[#F9F9F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-sm border border-slate-200 sm:rounded-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 border border-green-100">
              <Lock className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#0A2518]">
              Admin Access
            </h2>
            <p className="text-sm text-slate-500 mt-2 text-center">
              Please log in to manage your Mini ERP dashboard.
            </p>
          </div>


          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-[#0A2518] mb-2">Email Address</label>
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="admin@erp.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-[#0A2518]">Password</label>
                <a href="#" className="text-sm font-medium text-orange-500 hover:text-orange-600">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500" />
              <label className="ml-2 block text-sm text-slate-600">Remember me</label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </div>
            
            <div className="text-sm text-slate-500 text-center mt-4">
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
