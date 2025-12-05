import { Header } from './Header';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users, Gavel, Settings } from 'lucide-react';

interface ViewSelectorProps {
  onSelectView: (view: 'team' | 'judge' | 'admin') => void;
}

export function ViewSelector({ onSelectView }: ViewSelectorProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="InnovateHer Judging Portal" 
        subtitle="February 7-8, 2026 • Purdue University"
      />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome to InnovateHer 2026</h2>
          <p className="text-gray-600">Please select your role to continue</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col" onClick={() => onSelectView('team')}>
            <CardHeader className="flex-1">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>I'm a Team</CardTitle>
              <CardDescription>
                Register your team and project for the competition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => onSelectView('team')}>
                Register Team
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col" onClick={() => onSelectView('judge')}>
            <CardHeader className="flex-1">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Gavel className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>I'm a Judge</CardTitle>
              <CardDescription>
                Score and evaluate team projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => onSelectView('judge')}>
                Start Judging
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col" onClick={() => onSelectView('admin')}>
            <CardHeader className="flex-1">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>I'm an Organizer</CardTitle>
              <CardDescription>
                Configure event, manage teams and judges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => onSelectView('admin')}>
                Admin Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
