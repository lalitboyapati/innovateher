import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { LogIn } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      const redirectMap = {
        admin: '/admin',
        judge: '/judge',
        participant: '/dashboard',
      };
      navigate(redirectMap[user.role], { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      // Navigation handled by useEffect above
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="InnovateHer Judging Portal" 
        subtitle="February 7-8, 2026 • Purdue University"
      />
      
      <div className="max-w-md mx-auto p-6 mt-12">
        <Card>
          <CardHeader className="space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
              <LogIn className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription className="mt-2">
                Sign in to access your portal
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{' '}
                <Link to="/signup" className="text-purple-600 hover:underline">
                  Sign up here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm mb-2">
            <strong>Demo Credentials:</strong>
          </p>
          <div className="text-sm text-gray-700 space-y-2">
            <div>
              <p className="font-medium">Participant:</p>
              <p>participant@innovateher.com / participant123</p>
            </div>
            <div>
              <p className="font-medium">Judge:</p>
              <p>judge@innovateher.com / judge123</p>
            </div>
            <div>
              <p className="font-medium">Admin:</p>
              <p>admin@innovateher.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
