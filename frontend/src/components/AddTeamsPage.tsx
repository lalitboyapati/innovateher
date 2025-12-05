import { useState } from 'react';
import { Header } from './Header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

export interface Team {
  id: string;
  name: string;
  track: string;
  description: string;
  assignedJudges: string[];
  scores: Record<string, { score: number; comment: string }>;
}

interface AddTeamsPageProps {
  tracks: string[];
  onNext: (teams: Team[]) => void;
  onBack: () => void;
  initialTeams?: Team[];
}

export function AddTeamsPage({ tracks, onNext, onBack, initialTeams }: AddTeamsPageProps) {
  const [teams, setTeams] = useState<Team[]>(initialTeams || []);
  const [currentTeam, setCurrentTeam] = useState({
    name: '',
    track: '',
    description: '',
  });

  const addTeam = () => {
    if (currentTeam.name.trim() && currentTeam.track) {
      const newTeam: Team = {
        id: Date.now().toString(),
        name: currentTeam.name,
        track: currentTeam.track,
        description: currentTeam.description,
        assignedJudges: [],
        scores: {},
      };
      setTeams([...teams, newTeam]);
      setCurrentTeam({ name: '', track: '', description: '' });
    }
  };

  const removeTeam = (id: string) => {
    setTeams(teams.filter(team => team.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Competing Teams" />
      
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name *</Label>
              <Input
                id="teamName"
                placeholder="Enter team name"
                value={currentTeam.name}
                onChange={(e) => setCurrentTeam({ ...currentTeam, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="track">Track *</Label>
              <Select value={currentTeam.track} onValueChange={(value) => setCurrentTeam({ ...currentTeam, track: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a track" />
                </SelectTrigger>
                <SelectContent>
                  {tracks.map((track) => (
                    <SelectItem key={track} value={track}>
                      {track}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the project"
                value={currentTeam.description}
                onChange={(e) => setCurrentTeam({ ...currentTeam, description: e.target.value })}
                rows={3}
              />
            </div>

            <Button onClick={addTeam} disabled={!currentTeam.name.trim() || !currentTeam.track}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          </CardContent>
        </Card>

        {teams.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Teams Added ({teams.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teams.map((team) => (
                  <div key={team.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{team.name}</h3>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                          {team.track}
                        </span>
                      </div>
                      {team.description && (
                        <p className="text-sm text-gray-600">{team.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTeam(team.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => onNext(teams)} disabled={teams.length === 0}>
            Next: Add Judges
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
