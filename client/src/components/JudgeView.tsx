import { useState } from 'react';
import { Header } from './Header';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { CheckCircle, Award } from 'lucide-react';
import { TeamSubmission } from './TeamRegistration';

interface Category {
  id: string;
  name: string;
  weight: number;
}

interface TeamScore {
  teamId: string;
  judgeId: string;
  categoryScores: Record<string, number>;
  comments: Record<string, string>;
  submittedAt: Date;
}

interface JudgeViewProps {
  judgeName: string;
  teams: TeamSubmission[];
  categories: Category[];
  onScoreSubmit: (score: TeamScore) => void;
  existingScores?: TeamScore[];
}

export function JudgeView({ judgeName, teams, categories, onScoreSubmit, existingScores = [] }: JudgeViewProps) {
  const [selectedTeam, setSelectedTeam] = useState<TeamSubmission | null>(null);
  const [categoryScores, setCategoryScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleScoreChange = (categoryId: string, value: number) => {
    setCategoryScores({ ...categoryScores, [categoryId]: value });
  };

  const handleCommentChange = (categoryId: string, value: string) => {
    setComments({ ...comments, [categoryId]: value });
  };

  const handleSubmit = () => {
    if (!selectedTeam) return;

    const score: TeamScore = {
      teamId: selectedTeam.id,
      judgeId: judgeName,
      categoryScores,
      comments,
      submittedAt: new Date(),
    };

    onScoreSubmit(score);
    setShowSuccess(true);
    
    // Reset after submission
    setTimeout(() => {
      setCategoryScores({});
      setComments({});
      setShowSuccess(false);
      
      // Move to next team
      const currentIndex = teams.findIndex(t => t.id === selectedTeam.id);
      const nextTeam = teams[currentIndex + 1] || null;
      setSelectedTeam(nextTeam);
    }, 1500);
  };

  const hasScored = (teamId: string) => {
    return existingScores.some(s => s.teamId === teamId);
  };

  const isScoreComplete = categories.every(cat => 
    categoryScores[cat.id] !== undefined && categoryScores[cat.id] > 0
  );

  const scoredCount = teams.filter(t => hasScored(t.id)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="InnovateHer Judging Portal" subtitle={`Judge: ${judgeName}`} />
      
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Progress Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-purple-600" />
                <div>
                  <CardTitle>Your Progress</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {scoredCount} of {teams.length} teams scored
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((scoredCount / teams.length) * 100)}%
                </div>
                <p className="text-sm text-gray-600">Complete</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Team List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="font-semibold">Teams to Judge</h2>
            <div className="space-y-2">
              {teams.map((team) => (
                <Button
                  key={team.id}
                  variant={selectedTeam?.id === team.id ? "default" : "outline"}
                  className="w-full h-auto p-4 justify-start"
                  onClick={() => {
                    setSelectedTeam(team);
                    setCategoryScores({});
                    setComments({});
                  }}
                >
                  <div className="text-left w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{team.teamName}</span>
                      {hasScored(team.id) && (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {team.track}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Scoring Panel */}
          <div className="lg:col-span-2">
            {!selectedTeam ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  Select a team to start judging
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{selectedTeam.teamName}</CardTitle>
                      {hasScored(selectedTeam.id) && (
                        <Badge className="bg-green-100 text-green-700">
                          Already Scored
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-100 text-purple-700">
                        {selectedTeam.track}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {selectedTeam.projectName}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Project Info */}
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div>
                      <h3 className="font-medium mb-1">Project Description</h3>
                      <p className="text-sm text-gray-700">{selectedTeam.projectDescription}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Team Members</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTeam.teamMembers.map((member, idx) => (
                          <Badge key={idx} variant="outline">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Scoring Categories */}
                  <div className="space-y-5">
                    <h3 className="font-semibold">Score Each Category</h3>
                    {categories.map((category) => (
                      <div key={category.id} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <Label className="text-base">
                            {category.name} <span className="text-sm text-gray-500">({category.weight}% weight)</span>
                          </Label>
                          <span className="text-lg font-semibold">
                            {categoryScores[category.id] || 0} / 10
                          </span>
                        </div>
                        <Slider
                          value={[categoryScores[category.id] || 0]}
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
                  </div>

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
          </div>
        </div>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Scores Submitted!
            </DialogTitle>
            <DialogDescription>
              Your scores for {selectedTeam?.teamName} have been recorded successfully.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
