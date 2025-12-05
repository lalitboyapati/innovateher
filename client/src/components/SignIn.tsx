import { useState } from 'react';
import { Header } from './Header';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Users, Gavel, Settings, ArrowLeft } from 'lucide-react';

export type UserRole = 'team' | 'judge' | 'admin';

interface SignInProps {
  role: UserRole;
  onSignIn: (email: string, password: string) => void;
  onBack: () => void;
  error?: string;
}

export function SignIn({ role, onSignIn, onBack, error }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  const roleConfig = {
    team: {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      iconBg: 'bg-purple-100',
      title: 'Team Sign In',
      description: 'Sign in to register your team and project',
      color: 'purple'
    },
    judge: {
      icon: <Gavel className="h-8 w-8 text-pink-600" />,
      iconBg: 'bg-pink-100',
      title: 'Judge Sign In',
      description: 'Sign in to access the judging portal',
      color: 'pink'
    },
    admin: {
      icon: <Settings className="h-8 w-8 text-blue-600" />,
      iconBg: 'bg-blue-100',
      title: 'Admin Sign In',
      description: 'Sign in to access the admin portal',
      color: 'blue'
    }
  };

  const config = roleConfig[role];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="InnovateHer Judging Portal" 
        subtitle="February 7-8, 2026 • Purdue University"
      />
      
      <div className="max-w-md mx-auto p-6 mt-12">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Role Selection
        </Button>

        <Card>
          <CardHeader className="space-y-4">
            <div className={`w-16 h-16 ${config.iconBg} rounded-lg flex items-center justify-center mx-auto`}>
              {config.icon}
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl">{config.title}</CardTitle>
              <CardDescription className="mt-2">
                {config.description}
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
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full">
                Sign In
              </Button>

              <div className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Contact your event organizer
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm mb-2">
            <strong>Demo Credentials:</strong>
          </p>
          <div className="text-sm text-gray-700 space-y-1">
            {role === 'team' && (
              <>
                <p>Email: team@innovateher.com</p>
                <p>Password: team123</p>
              </>
            )}
            {role === 'judge' && (
              <>
                <p>Email: judge@innovateher.com</p>
                <p>Password: judge123</p>
              </>
            )}
            {role === 'admin' && (
              <>
                <p>Email: admin@innovateher.com</p>
                <p>Password: admin123</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
