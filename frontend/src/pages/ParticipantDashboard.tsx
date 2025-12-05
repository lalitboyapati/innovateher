import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Upload, Eye, Edit } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  track: string;
  status: 'Submitted' | 'Under Review' | 'Scored';
  submittedAt: string;
  score?: number;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Smart Campus Navigator',
    track: 'Mobile Apps',
    status: 'Submitted',
    submittedAt: '2026-02-07',
  },
  {
    id: '2',
    title: 'AI Study Buddy',
    track: 'AI/ML',
    status: 'Under Review',
    submittedAt: '2026-02-07',
  },
];

export function ParticipantDashboard() {
  const navigate = useNavigate();
  const [projects] = useState<Project[]>(mockProjects);

  const getStatusBadge = (status: Project['status']) => {
    const variants: Record<Project['status'], 'default' | 'secondary' | 'outline'> = {
      'Submitted': 'secondary',
      'Under Review': 'default',
      'Scored': 'outline',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl mb-2">Participant Dashboard</h1>
            <p className="text-gray-600">
              Track your project submissions and scores
            </p>
          </div>
          <Button onClick={() => navigate('/submit')}>
            <Upload className="h-4 w-4 mr-2" />
            Submit New Project
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{projects.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {projects.filter(p => p.status === 'Under Review').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Scored</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {projects.filter(p => p.status === 'Scored').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Projects</CardTitle>
            <CardDescription>
              View and manage your submitted projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">You haven't submitted any projects yet</p>
                <Button onClick={() => navigate('/submit')}>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Your First Project
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Track</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell>{project.track}</TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>{project.submittedAt}</TableCell>
                      <TableCell>
                        {project.score ? (
                          <span className="font-medium">{project.score}/100</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {project.status === 'Submitted' && (
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
