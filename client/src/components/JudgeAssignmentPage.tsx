import { useState } from 'react';
import { Header } from './Header';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowRight, ArrowLeft, Info, X } from 'lucide-react';
import { Team } from './AddTeamsPage';
import { Judge } from './AddJudgesPage';

interface JudgeAssignmentPageProps {
  teams: Team[];
  judges: Judge[];
  onNext: (updatedTeams: Team[]) => void;
  onBack: () => void;
}

export function JudgeAssignmentPage({ teams, judges, onNext, onBack }: JudgeAssignmentPageProps) {
  const [updatedTeams, setUpdatedTeams] = useState<Team[]>(teams);
  const [draggedJudge, setDraggedJudge] = useState<string | null>(null);

  const assignedJudgeIds = updatedTeams.flatMap(team => team.assignedJudges);
  const unassignedJudges = judges.filter(judge => !assignedJudgeIds.includes(judge.id));

  const handleDragStart = (judgeId: string) => {
    setDraggedJudge(judgeId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (teamId: string) => {
    if (!draggedJudge) return;

    setUpdatedTeams(updatedTeams.map(team => {
      if (team.id === teamId && !team.assignedJudges.includes(draggedJudge)) {
        return {
          ...team,
          assignedJudges: [...team.assignedJudges, draggedJudge],
        };
      }
      return team;
    }));

    setDraggedJudge(null);
  };

  const removeJudgeFromTeam = (teamId: string, judgeId: string) => {
    setUpdatedTeams(updatedTeams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          assignedJudges: team.assignedJudges.filter(id => id !== judgeId),
        };
      }
      return team;
    }));
  };

  const getJudgeById = (judgeId: string) => judges.find(j => j.id === judgeId);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const allTeamsHaveMinJudges = updatedTeams.every(team => team.assignedJudges.length >= 2);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Judge Assignment" />
      
      <div className="max-w-7xl mx-auto p-6">
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            Each team must have at least 2 judges. Drag and drop judges from the right panel to assign them to teams.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Teams */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">Teams & Projects</h2>
            {updatedTeams.map((team) => (
              <Card 
                key={team.id}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(team.id)}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <Badge className="mt-2 bg-purple-100 text-purple-700 hover:bg-purple-100">
                        {team.track}
                      </Badge>
                    </div>
                    {team.assignedJudges.length < 2 && (
                      <Badge variant="outline" className="text-amber-600 border-amber-600">
                        Needs {2 - team.assignedJudges.length} more
                      </Badge>
                    )}
                  </div>
                  {team.description && (
                    <p className="text-sm text-gray-600 mt-2">{team.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Assigned Judges ({team.assignedJudges.length})
                    </p>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-gray-50 rounded-lg border-2 border-dashed">
                      {team.assignedJudges.length === 0 ? (
                        <p className="text-sm text-gray-400">Drop judges here</p>
                      ) : (
                        team.assignedJudges.map(judgeId => {
                          const judge = getJudgeById(judgeId);
                          if (!judge) return null;
                          return (
                            <div
                              key={judgeId}
                              className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border shadow-sm"
                            >
                              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs">
                                {getInitials(judge.name)}
                              </div>
                              <span className="text-sm">{judge.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {judge.specialization}
                              </Badge>
                              <button
                                onClick={() => removeJudgeFromTeam(team.id, judgeId)}
                                className="hover:bg-gray-100 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Panel - Unassigned Judges */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Unassigned Judges ({unassignedJudges.length})</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {unassignedJudges.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">All judges assigned</p>
                  ) : (
                    unassignedJudges.map((judge) => (
                      <div
                        key={judge.id}
                        draggable
                        onDragStart={() => handleDragStart(judge.id)}
                        className="flex items-center gap-3 p-3 bg-white border rounded-lg cursor-move hover:shadow-md transition-shadow"
                      >
                        <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center">
                          {getInitials(judge.name)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{judge.name}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {judge.specialization}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => onNext(updatedTeams)} disabled={!allTeamsHaveMinJudges}>
            Proceed to Scoring
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
