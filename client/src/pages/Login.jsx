import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import {
  Layers,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Default to HR Admin credentials so the user can sign in with 1 click
  const [email, setEmail] = useState('hr@staffsync.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('hr');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const executeLogin = async (loginEmail, loginPassword) => {
    setError('');
    setStatusMsg('Authenticating credentials...');
    setLoading(true);

    try {
      const result = await login(loginEmail, loginPassword);
      if (result.success) {
        setStatusMsg('Success! Entering StaffSync...');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 200);
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
        setStatusMsg('');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Server connection error. Make sure the backend is active.');
      setStatusMsg('');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    await executeLogin(email, password);
  };

  const handleSelectRole = async (roleKey) => {
    const creds = DEMO_CREDENTIALS[roleKey];
    if (!creds) return;

    setSelectedRole(roleKey);
    setEmail(creds.email);
    setPassword(creds.password);
    setError('');

    // Trigger immediate login with selected persona
    await executeLogin(creds.email, creds.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 mb-4 ring-4 ring-indigo-500/20">
          <Layers className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Staff<span className="text-indigo-400">Sync</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Modern Human Resource Management Solution
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-100">
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to sign in</p>
                <p className="mt-0.5 text-rose-600">{error}</p>
              </div>
            </div>
          )}

          {statusMsg && !error && (
            <div className="mb-5 p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span className="font-semibold">{statusMsg}</span>
            </div>
          )}

          {/* Quick Demo Login Personas */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  1-Click Fast Login
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Select any persona:</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* HR Admin Card */}
              <button
                type="button"
                onClick={() => handleSelectRole('hr')}
                disabled={loading}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center group cursor-pointer ${
                  selectedRole === 'hr'
                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/20 shadow-sm'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-purple-50/60 hover:border-purple-200'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">HR Admin</span>
                <span className="text-[10px] text-purple-700 truncate w-full">Sarah Jenkins</span>
              </button>

              {/* Manager Card */}
              <button
                type="button"
                onClick={() => handleSelectRole('manager')}
                disabled={loading}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center group cursor-pointer ${
                  selectedRole === 'manager'
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-200'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Manager</span>
                <span className="text-[10px] text-blue-700 truncate w-full">Marcus Vance</span>
              </button>

              {/* Employee Card */}
              <button
                type="button"
                onClick={() => handleSelectRole('employee')}
                disabled={loading}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center group cursor-pointer ${
                  selectedRole === 'employee'
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-emerald-50/60 hover:border-emerald-200'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Employee</span>
                <span className="text-[10px] text-emerald-700 truncate w-full">Alex Rivera</span>
              </button>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
                Or sign in manually
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr@staffsync.com"
                  className="block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-slate-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123"
                  className="block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-slate-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/30 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {selectedRole.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick tips footer */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Demo Password: <strong className="font-mono text-slate-600">password123</strong></span>
            <span className="font-semibold text-indigo-600">MERN Stack HRMS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
