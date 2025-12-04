import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'participant';
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if registration is allowed for this role
  const canRegister = role !== 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await login(email, password);
        // Navigate to the role-specific dashboard based on actual user role
        const userRole = response?.user?.role || role;
        navigate(`/${userRole}`);
      } else {
        // Registration
        if (!canRegister) {
          setError('Admin accounts cannot be created through registration. Please contact an administrator.');
          setLoading(false);
          return;
        }

        if (!name.trim()) {
          setError('Name is required for registration.');
          setLoading(false);
          return;
        }

        await register(name, email, password, role, specialty || undefined);
        // Navigate to the role-specific dashboard after successful registration
        navigate(`/${role}`);
      }
    } catch (err: any) {
      setError(err.message || (isLogin ? 'Login failed. Please try again.' : 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#d4a5a5' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-white mb-4" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '3.5rem', lineHeight: '1' }}>
            innovate
          </h1>
          <h2 className="text-white" style={{ fontFamily: 'Georgia, serif', fontWeight: '700', fontSize: '2.5rem', lineHeight: '1', letterSpacing: '0.05em' }}>
            {'</HER>'}
          </h2>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg p-8 relative" style={{ border: '3px solid #000' }}>
          {/* Decorative corner elements */}
          <div className="absolute top-4 left-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>
          <div className="absolute top-4 right-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>

          {/* Crown decoration */}
          <div className="flex justify-center mb-6">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 35L15 20L22 30L30 15L38 30L45 20L50 35H10Z" fill="#c89999" />
              <circle cx="15" cy="20" r="3" fill="#c89999" />
              <circle cx="30" cy="15" r="3" fill="#c89999" />
              <circle cx="45" cy="20" r="3" fill="#c89999" />
            </svg>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h3 className="mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#333' }}>
              {isLogin ? 'welcome back' : 'join us'}
            </h3>
            <p className="text-sm" style={{ fontFamily: 'Georgia, serif', color: '#666', fontStyle: 'italic' }}>
              signing in as {getRoleDisplayName(role)}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: '#fee', border: '1px solid #fcc', color: '#c33' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem' }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input (only for registration) */}
            {!isLogin && canRegister && (
              <div>
                <label htmlFor="name" className="block mb-2" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-md focus:outline-none transition"
                  style={{ 
                    border: '2px solid #000',
                    fontFamily: 'Georgia, serif'
                  }}
                  required
                />
              </div>
            )}

            {/* Specialty Input (only for judge registration) */}
            {!isLogin && canRegister && role === 'judge' && (
              <div>
                <label htmlFor="specialty" className="block mb-2" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                  Specialty (optional)
                </label>
                <input
                  type="text"
                  id="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g., AI & ML, Healthcare, UX Design"
                  className="w-full px-4 py-3 rounded-md focus:outline-none transition"
                  style={{ 
                    border: '2px solid #000',
                    fontFamily: 'Georgia, serif'
                  }}
                />
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block mb-2" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-md focus:outline-none transition"
                style={{ 
                  border: '2px solid #000',
                  fontFamily: 'Georgia, serif'
                }}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block mb-2" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-md focus:outline-none transition"
                  style={{ 
                    border: '2px solid #000',
                    fontFamily: 'Georgia, serif'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                  style={{ color: '#666' }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password (only show on login) */}
            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="transition"
                  style={{ 
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic',
                    color: '#d4a5a5'
                  }}
                >
                  forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md transition hover:opacity-90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: '#c89999',
                color: '#fff',
                border: '2px solid #000',
                fontFamily: 'Georgia, serif',
                fontWeight: '600',
                letterSpacing: '0.05em'
              }}
            >
              {loading ? 'SIGNING IN...' : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
            </button>
          </form>

          {/* Toggle between login/signup (only show if registration is allowed) */}
          {canRegister && (
            <div className="mt-6 text-center">
              <p style={{ fontFamily: 'Georgia, serif', color: '#666' }}>
                {isLogin ? "don't have an account? " : 'already have an account? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setName('');
                    setSpecialty('');
                  }}
                  className="transition"
                  style={{ 
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic',
                    color: '#d4a5a5',
                    fontWeight: '600'
                  }}
                >
                  {isLogin ? 'create one' : 'sign in'}
                </button>
              </p>
            </div>
          )}

          {/* Admin registration notice */}
          {!canRegister && isLogin && (
            <div className="mt-6 text-center">
              <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.875rem', fontStyle: 'italic' }}>
                Admin accounts must be created by existing administrators.
              </p>
            </div>
          )}

          {/* Back to landing page */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="transition"
              style={{ 
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                color: '#d4a5a5',
                fontSize: '0.9rem'
              }}
            >
              ← back to home
            </button>
          </div>
        </div>

        {/* Footer text */}
        <div className="text-center mt-8">
          <p className="text-white" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.25rem' }}>
            are you ready?
          </p>
        </div>
      </div>
    </div>
  );
}

