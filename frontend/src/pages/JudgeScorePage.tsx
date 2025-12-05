import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useScoring } from '../contexts/ScoringContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Slider } from '../components/ui/slider';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';

interface RubricItem {
  id: string;
  name: string;
  weight: number;
  description: string;
}

const RUBRIC: RubricItem[] = [
  { id: 'innovation', name: 'Innovation', weight: 25, description: 'Originality and creativity of the solution' },
  { id: 'technical', name: 'Technical Implementation', weight: 25, description: 'Quality of code and technical execution' },
  { id: 'design', name: 'Design & UX', weight: 25, description: 'User interface and user experience design' },
  { id: 'presentation', name: 'Presentation', weight: 25, description: 'Clarity and effectiveness of the pitch' },
];

export function JudgeScorePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, submitScore, isProjectScored } = useScoring();
  const projectId = location.state?.projectId || projects[0]?.id;
  
  const [currentProjectIndex, setCurrentProjectIndex] = useState(() => {
    const index = projects.findIndex(p => p.id === projectId);
    return index >= 0 ? index : 0;
  });
  const currentProject = projects[currentProjectIndex];
  
  const [scores, setScores] = useState<Record<string, number>>(
    RUBRIC.reduce((acc, item) => ({ ...acc, [item.id]: 5 }), {})
  );
  const [comments, setComments] = useState<Record<string, string>>(
    RUBRIC.reduce((acc, item) => ({ ...acc, [item.id]: '' }), {})
  );
  const [generalComments, setGeneralComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Safety check - redirect if no projects available
  if (!currentProject || projects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto p-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/judge')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No projects available to score</p>
            <Button onClick={() => navigate('/judge')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const calculateTotalScore = () => {
    return RUBRIC.reduce((total, item) => {
      return total + (scores[item.id] * item.weight / 10);
    }, 0);
  };

  const handleScoreChange = (rubricId: string, value: number[]) => {
    setScores({ ...scores, [rubricId]: value[0] });
  };

  const handleCommentChange = (rubricId: string, value: string) => {
    setComments({ ...comments, [rubricId]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Submit score to context
      submitScore({
        projectId: currentProject.id,
        scores,
        comments,
        generalComments,
        totalScore: calculateTotalScore(),
        submittedAt: new Date().toISOString(),
      });
      
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Move to next project after brief delay
      setTimeout(() => {
        if (currentProjectIndex < projects.length - 1) {
          setCurrentProjectIndex(currentProjectIndex + 1);
          resetForm();
        } else {
          navigate('/judge');
        }
      }, 1500);
    } catch (error) {
      console.error('Error submitting scores:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setScores(RUBRIC.reduce((acc, item) => ({ ...acc, [item.id]: 5 }), {}));
    setComments(RUBRIC.reduce((acc, item) => ({ ...acc, [item.id]: '' }), {}));
    setGeneralComments('');
    setSubmitSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/judge')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {submitSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Scores submitted successfully! {currentProjectIndex < projects.length - 1 ? 'Loading next project...' : 'Returning to dashboard...'}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{currentProject.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {currentProject.teamName} • {currentProject.track}
                    </CardDescription>
                  </div>
                  <div className="text-sm text-gray-500">
                    Project {currentProjectIndex + 1} of {projects.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm mb-2">Description</h3>
                    <p className="text-gray-700">{currentProject.description}</p>
                  </div>
                  
                  {(currentProject.githubUrl || currentProject.devpostUrl) && (
                    <div>
                      <h3 className="text-sm mb-2">Links</h3>
                      <div className="space-y-1">
                        {currentProject.githubUrl && (
                          <a 
                            href={currentProject.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:underline block"
                          >
                            GitHub Repository →
                          </a>
                        )}
                        {currentProject.devpostUrl && (
                          <a 
                            href={currentProject.devpostUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:underline block"
                          >
                            Devpost Submission →
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scoring Rubric</CardTitle>
                <CardDescription>
                  Rate each category from 0-10
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {RUBRIC.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Label className="text-base">
                          {item.name} ({item.weight}%)
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      </div>
                      <div className="text-2xl ml-4 min-w-[60px] text-right">
                        {scores[item.id]}/10
                      </div>
                    </div>
                    
                    <Slider
                      value={[scores[item.id]]}
                      onValueChange={(value) => handleScoreChange(item.id, value)}
                      max={10}
                      step={0.5}
                      className="w-full"
                    />
                    
                    <Textarea
                      placeholder={`Comments for ${item.name.toLowerCase()}...`}
                      value={comments[item.id]}
                      onChange={(e) => handleCommentChange(item.id, e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}

                <div className="space-y-2 pt-4 border-t">
                  <Label>General Comments</Label>
                  <Textarea
                    placeholder="Overall feedback for the team..."
                    value={generalComments}
                    onChange={(e) => setGeneralComments(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Score Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Total Score</div>
                  <div className="text-4xl">{calculateTotalScore().toFixed(1)}</div>
                  <div className="text-sm text-gray-500">out of 100</div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  {RUBRIC.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-medium">
                        {((scores[item.id] * item.weight) / 10).toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Scores'}
                  {currentProjectIndex < projects.length - 1 && !isSubmitting && (
                    <ArrowRight className="h-4 w-4 ml-2" />
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}