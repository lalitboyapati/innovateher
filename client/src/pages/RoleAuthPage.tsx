import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft } from 'lucide-react';

export function RoleAuthPage() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login, signup, isAuthenticated, user } = useAuth();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate role parameter
  const userRole: UserRole = 
    role === 'participant' ? 'participant' : 
    role === 'judge' ? 'judge' : 
    role === 'admin' ? 'admin' : 'participant';

  const roleConfig = {
    participant: {
      title: 'Participant Portal',
      description: 'Submit your innovative projects',
      color: 'bg-purple-600',
      lightColor: 'bg-purple-50',
    },
    judge: {
      title: 'Judge Portal',
      description: 'Evaluate and score projects',
      color: 'bg-pink-600',
      lightColor: 'bg-pink-50',
    },
    admin: {
      title: 'Admin Portal',
      description: 'Manage judges, participants, and scoring',
      color: 'bg-amber-600',
      lightColor: 'bg-amber-50',
    },
  };

  const config = roleConfig[userRole];

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectMap = {
        judge: '/judge',
        participant: '/dashboard',
        admin: '/admin',
      };
      navigate(redirectMap[user.role], { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateSignupForm = () => {
    if (!signupName.trim()) {
      setError('Name is required');
      return false;
    }
    if (!signupEmail.trim()) {
      setError('Email is required');
      return false;
    }
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateSignupForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(signupName, signupEmail, signupPassword, userRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#526478] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/portals')}
          className="mb-6 text-white hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Choose Different Role
        </Button>

        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-gray-800">{config.title}</CardTitle>
            <CardDescription className="text-gray-600">{config.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                <TabsTrigger value="login" className="data-[state=active]:bg-white">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="h-11"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm mb-2">
                      <strong>Demo Credentials:</strong>
                    </p>
                    <div className="text-sm text-gray-700">
                      {userRole === 'participant' && <p>participant@innovateher.com / participant123</p>}
                      {userRole === 'judge' && <p>judge@innovateher.com / judge123</p>}
                      {userRole === 'admin' && <p>admin@innovateher.com / admin123</p>}
                    </div>
                  </div>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your full name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="At least 6 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Re-enter your password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="h-11"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Creating a <strong>{userRole}</strong> account for InnovateHer 2026
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-white text-sm">
          InnovateHer 2026 • February 7-8 • Purdue University
        </div>
      </div>
    </div>
  );
}
