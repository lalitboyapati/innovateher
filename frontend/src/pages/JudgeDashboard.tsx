import { useNavigate } from 'react-router-dom';
import { useScoring } from '../contexts/ScoringContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Gavel, CheckCircle, Clock } from 'lucide-react';

export function JudgeDashboard() {
  const navigate = useNavigate();
  const { projects, isProjectScored, getProjectScore } = useScoring();

  const completedCount = projects.filter(p => isProjectScored(p.id)).length;
  const pendingCount = projects.length - completedCount;

  const getStatusBadge = (projectId: string) => {
    const scored = isProjectScored(projectId);
    if (scored) {
      const score = getProjectScore(projectId);
      return (
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-700">Completed</Badge>
          <span className="text-sm text-gray-600">{score?.totalScore.toFixed(1)}/100</span>
        </div>
      );
    }
    return <Badge variant="secondary">Not Scored</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl mb-2">Judge Dashboard</h1>
            <p className="text-gray-600">
              Score assigned projects and track your progress
            </p>
          </div>
          <Button onClick={() => navigate('/judge/score')}>
            <Gavel className="h-4 w-4 mr-2" />
            Start Scoring
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{projects.length}</div>
              <p className="text-xs text-gray-500 mt-1">Projects to evaluate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-600">{completedCount}</div>
              <p className="text-xs text-gray-500 mt-1">
                {projects.length > 0 ? Math.round((completedCount / projects.length) * 100) : 0}% done
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-orange-600">{pendingCount}</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting your scores</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Projects</CardTitle>
            <CardDescription>
              Projects assigned to you for evaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Track</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  const scored = isProjectScored(project.id);
                  return (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell>{project.teamName}</TableCell>
                      <TableCell>{project.track}</TableCell>
                      <TableCell>{getStatusBadge(project.id)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={scored ? 'outline' : 'default'}
                          size="sm"
                          onClick={() => navigate('/judge/score', { state: { projectId: project.id } })}
                        >
                          <Gavel className="h-4 w-4 mr-2" />
                          {scored ? 'View/Edit' : 'Score Now'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}