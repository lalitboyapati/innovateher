import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Upload, CheckCircle } from 'lucide-react';

const TRACKS = ['AI/ML', 'Web Development', 'Mobile Apps', 'Social Impact', 'Cybersecurity', 'FinTech', 'HealthTech'];

interface ProjectSubmission {
  id: string;
  title: string;
  description: string;
  track: string;
  githubUrl: string;
  devpostUrl: string;
  teammates: string;
  submittedAt: Date;
}

export function SubmitProjectPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [track, setTrack] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [devpostUrl, setDevpostUrl] = useState('');
  const [teammates, setTeammates] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);

  const validateForm = () => {
    if (!title.trim()) {
      setError('Project title is required');
      return false;
    }
    if (!description.trim()) {
      setError('Project description is required');
      return false;
    }
    if (!track) {
      setError('Please select a track');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - replace with actual API endpoint
      // const response = await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({ title, description, track, githubUrl, devpostUrl, teammates }),
      // });

      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

      const newSubmission: ProjectSubmission = {
        id: `project-${Date.now()}`,
        title,
        description,
        track,
        githubUrl,
        devpostUrl,
        teammates,
        submittedAt: new Date(),
      };

      setSubmissions([...submissions, newSubmission]);
      setSuccess(true);

      // Reset form
      setTitle('');
      setDescription('');
      setTrack('');
      setGithubUrl('');
      setDevpostUrl('');
      setTeammates('');

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl mb-2">Submit Project</h1>
          <p className="text-gray-600">
            Share your innovative project with InnovateHer judges
          </p>
        </div>

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your project has been successfully submitted! You can view it in your dashboard.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Fill in all required fields to submit your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Smart Campus Navigator"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project, what problem it solves, and how it works..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="track">Track *</Label>
                    <Select value={track} onValueChange={setTrack} disabled={isSubmitting}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a track" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRACKS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub Repository URL</Label>
                    <Input
                      id="githubUrl"
                      type="url"
                      placeholder="https://github.com/username/repo"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="devpostUrl">Devpost URL</Label>
                    <Input
                      id="devpostUrl"
                      type="url"
                      placeholder="https://devpost.com/software/project-name"
                      value={devpostUrl}
                      onChange={(e) => setDevpostUrl(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teammates">Team Members</Label>
                    <Input
                      id="teammates"
                      placeholder="Comma-separated names (e.g., Alice Smith, Bob Johnson)"
                      value={teammates}
                      onChange={(e) => setTeammates(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Upload className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit Project'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Submissions</CardTitle>
                <CardDescription>
                  Projects you've submitted
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <p className="text-sm text-gray-500">No submissions yet</p>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((sub) => (
                      <div key={sub.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm mb-1">{sub.title}</p>
                        <p className="text-xs text-gray-500">{sub.track}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
