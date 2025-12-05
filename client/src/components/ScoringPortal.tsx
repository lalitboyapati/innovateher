import { useState } from 'react';
import { Header } from './Header';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Team } from './AddTeamsPage';
import { Judge } from './AddJudgesPage';

interface Category {
  id: string;
  name: string;
  weight: number;
}

interface ScoringPortalProps {
  teams: Team[];
  judges: Judge[];
  categories: Category[];
  onBack: () => void;
  onComplete: (updatedTeams: Team[]) => void;
}

export function ScoringPortal({ teams, judges, categories, onBack, onComplete }: ScoringPortalProps) {
  const [selectedJudge, setSelectedJudge] = useState<Judge | null>(judges[0] || null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [updatedTeams, setUpdatedTeams] = useState<Team[]>(teams);

  const teamsForJudge = updatedTeams.filter(team => 
    team.assignedJudges.includes(selectedJudge?.id || '')
  );

  const handleScoreChange = (categoryId: string, value: number) => {
    setScores({ ...scores, [categoryId]: value });
  };

  const handleCommentChange = (categoryId: string, value: string) => {
    setComments({ ...comments, [categoryId]: value });
  };

  const handleSubmit = () => {
    if (!selectedJudge || !selectedTeam) return;

    const newUpdatedTeams = updatedTeams.map(team => {
      if (team.id === selectedTeam.id) {
        return {
          ...team,
          scores: {
            ...team.scores,
            [selectedJudge.id]: {
              score: scores,
              comment: comments,
            },
          },
        };
      }
      return team;
    });

    setUpdatedTeams(newUpdatedTeams);
    setShowSuccessModal(true);
    setScores({});
    setComments({});
    
    // Reset to next team or null
    const currentIndex = teamsForJudge.findIndex(t => t.id === selectedTeam.id);
    const nextTeam = teamsForJudge[currentIndex + 1] || null;
    setSelectedTeam(nextTeam);
  };

  const isScoreComplete = categories.every(cat => scores[cat.id] !== undefined && scores[cat.id] > 0);

  const hasAlreadyScored = (team: Team) => {
    return selectedJudge && team.scores[selectedJudge.id];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Scoring Portal" subtitle="Judge View" />
      
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Judge Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Judge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {judges.map((judge) => (
                <Button
                  key={judge.id}
                  variant={selectedJudge?.id === judge.id ? "default" : "outline"}
                  onClick={() => {
                    setSelectedJudge(judge);
                    setSelectedTeam(null);
                    setScores({});
                    setComments({});
                  }}
                >
                  {judge.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedJudge && (
          <>
            {/* Team Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Select Team to Score ({teamsForJudge.length} teams)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {teamsForJudge.map((team) => (
                    <Button
                      key={team.id}
                      variant={selectedTeam?.id === team.id ? "default" : "outline"}
                      className="h-auto p-4 justify-start"
                      onClick={() => {
                        setSelectedTeam(team);
                        setScores({});
                        setComments({});
                      }}
                    >
                      <div className="text-left w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{team.name}</span>
                          {hasAlreadyScored(team) && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <Badge className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-100">
                          {team.track}
                        </Badge>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scoring Form */}
            {selectedTeam && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedTeam.name}</CardTitle>
                      <Badge className="mt-2 bg-purple-100 text-purple-700 hover:bg-purple-100">
                        {selectedTeam.track}
                      </Badge>
                    </div>
                  </div>
                  {selectedTeam.description && (
                    <p className="text-sm text-gray-600 mt-2">{selectedTeam.description}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {categories.map((category) => (
                    <div key={category.id} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <Label className="text-base">
                          {category.name} ({category.weight}%)
                        </Label>
                        <span className="text-lg font-semibold">
                          {scores[category.id] || 0} / 10
                        </span>
                      </div>
                      <Slider
                        value={[scores[category.id] || 0]}
                        onValueChange={(value: number[]) => handleScoreChange(category.id, value[0])}
                        max={10}
                        min={0}
                        step={1}
                        className="py-2"
                      />
                      <Textarea
                        placeholder="Add your feedback (optional)"
                        value={comments[category.id] || ''}
                        onChange={(e) => handleCommentChange(category.id, e.target.value)}
                        rows={2}
                      />
                    </div>
                  ))}

                  <Button 
                    onClick={handleSubmit} 
                    disabled={!isScoreComplete}
                    size="lg"
                    className="w-full"
                  >
                    Submit Scores
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignment
          </Button>
          <Button onClick={() => onComplete(updatedTeams)}>
            View Results
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Thank you!
            </DialogTitle>
            <DialogDescription>
              Your scores have been submitted successfully.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowSuccessModal(false)}>
            Continue Scoring
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
