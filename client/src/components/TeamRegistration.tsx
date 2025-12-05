import { useState } from 'react';
import { Header } from './Header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { CheckCircle, Users } from 'lucide-react';

export interface TeamSubmission {
  id: string;
  teamName: string;
  track: string;
  projectName: string;
  projectDescription: string;
  teamMembers: string[];
  submittedAt: Date;
}

interface TeamRegistrationProps {
  tracks: string[];
  onSubmit: (team: TeamSubmission) => void;
}

export function TeamRegistration({ tracks, onSubmit }: TeamRegistrationProps) {
  const [teamName, setTeamName] = useState('');
  const [track, setTrack] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [teamMembers, setTeamMembers] = useState(['']);
  const [showSuccess, setShowSuccess] = useState(false);

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, '']);
  };

  const updateTeamMember = (index: number, value: string) => {
    const updated = [...teamMembers];
    updated[index] = value;
    setTeamMembers(updated);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validMembers = teamMembers.filter(m => m.trim() !== '');
    
    const submission: TeamSubmission = {
      id: Date.now().toString(),
      teamName,
      track,
      projectName,
      projectDescription,
      teamMembers: validMembers,
      submittedAt: new Date(),
    };

    onSubmit(submission);
    setShowSuccess(true);
    
    // Reset form
    setTimeout(() => {
      setTeamName('');
      setTrack('');
      setProjectName('');
      setProjectDescription('');
      setTeamMembers(['']);
      setShowSuccess(false);
    }, 2000);
  };

  const isValid = teamName.trim() && track && projectName.trim() && teamMembers.filter(m => m.trim()).length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="InnovateHer Judging Portal" 
        subtitle="February 7-8, 2026 • Purdue University"
      />
      
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Registration</CardTitle>
            <CardDescription>
              Register your team and project for InnovateHer 2026
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name *</Label>
                <Input
                  id="teamName"
                  placeholder="Enter your team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="track">Track *</Label>
                <Select value={track} onValueChange={setTrack} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a track" />
                  </SelectTrigger>
                  <SelectContent>
                    {tracks.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  placeholder="What's your project called?"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Project Description *</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Describe your project (what it does, the problem it solves, etc.)"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Team Members *</Label>
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Team member ${index + 1} name`}
                      value={member}
                      onChange={(e) => updateTeamMember(index, e.target.value)}
                      className="flex-1"
                    />
                    {teamMembers.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeTeamMember(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTeamMember}
                  className="w-full"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={!isValid}>
                Submit Registration
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Registration Successful!
            </DialogTitle>
            <DialogDescription>
              Your team "{teamName}" has been registered for {track}. Good luck!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
