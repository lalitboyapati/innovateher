import { useMemo, useState } from 'react';
import { Users, UserPlus, Menu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

type Judge = {
  id: string;
  name: string;
  specialty: string;
};

type Team = {
  id: string;
  name: string;
  track: string;
  description: string;
  assignedJudgeIds: string[];
};

const initialJudges: Judge[] = [
  { id: '1', name: 'Dr. Amanda Foster', specialty: 'AI & ML' },
  { id: '2', name: 'Kevin Zhang', specialty: 'Full Stack' },
  { id: '3', name: 'Priya Patel', specialty: 'UX Design' },
  { id: '4', name: 'Dr. Sarah Chen', specialty: 'AI & ML' },
  { id: '5', name: 'Michael Rodriguez', specialty: 'Data Science' },
  { id: '6', name: 'Emily Watson', specialty: 'Product Strategy' },
  { id: '7', name: 'James Park', specialty: 'Security' },
  { id: '8', name: 'Lisa Thompson', specialty: 'Cloud' },
  { id: '9', name: 'David Kumar', specialty: 'Sustainability' },
];

const initialTeams: Team[] = [
  {
    id: 't1',
    name: 'CodeCrafters',
    track: 'AI & Machine Learning',
    description: 'An intelligent code review assistant that uses machine learning to detect bugs and suggest improvements in real-time.',
    assignedJudgeIds: ['4', '5'],
  },
  {
    id: 't2',
    name: 'DataDynamos',
    track: 'Healthcare Innovation',
    description: 'A telemedicine platform that connects rural patients with specialists using AI-powered diagnostics and real-time video consultations.',
    assignedJudgeIds: ['6', '7', '8'],
  },
  {
    id: 't3',
    name: 'EcoTech Solutions',
    track: 'Sustainability',
    description: 'A carbon footprint tracking app that gamifies sustainable living and connects users with local eco-friendly businesses.',
    assignedJudgeIds: ['9'],
  },
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export function AdminDashboard() {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [judges] = useState<Judge[]>(initialJudges);

  const assignedIds = useMemo(
    () => teams.flatMap((team) => team.assignedJudgeIds),
    [teams]
  );

  const unassignedJudges = useMemo(
    () => judges.filter((judge) => !assignedIds.includes(judge.id)),
    [judges, assignedIds]
  );

  const assignJudge = (teamId: string, judgeId: string) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId && !team.assignedJudgeIds.includes(judgeId)
          ? { ...team, assignedJudgeIds: [...team.assignedJudgeIds, judgeId] }
          : team
      )
    );
  };

  const unassignJudge = (teamId: string, judgeId: string) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? { ...team, assignedJudgeIds: team.assignedJudgeIds.filter((id) => id !== judgeId) }
          : team
      )
    );
  };

  const teamCount = teams.length;

  return (
    <div className="min-h-screen bg-[#f7f5f3] text-[#1f1f1f]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hackathon Judging Portal</h1>
            <p className="text-gray-600">Manage team assignments and judge allocations</p>
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white gap-2">
            <Users className="h-5 w-5" />
            {teamCount} {teamCount === 1 ? 'Team' : 'Teams'}
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-[2fr,1fr] gap-8">
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Competing Teams</h2>
            <p className="text-gray-600">Review team details and assigned judges</p>
          </div>

          <div className="space-y-4">
            {teams.map((team) => {
              const assigned = team.assignedJudgeIds
                .map((id) => judges.find((j) => j.id === id))
                .filter(Boolean) as Judge[];

              return (
                <Card key={team.id} className="shadow-sm border-gray-200">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{team.name}</CardTitle>
                      <Badge variant="secondary" className="rounded-full bg-gray-100 text-gray-800">
                        {team.track}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      <Users className="h-4 w-4" />
                      {assigned.length} {assigned.length === 1 ? 'Judge' : 'Judges'}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Project Description</p>
                      <p className="text-gray-700 mt-1 leading-relaxed">{team.description}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Assigned Judges</p>
                      {assigned.length === 0 ? (
                        <p className="text-sm text-gray-500">No judges assigned yet.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {assigned.map((judge) => (
                            <button
                              key={judge.id}
                              onClick={() => unassignJudge(team.id, judge.id)}
                              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm hover:shadow-sm transition"
                            >
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white text-xs">
                                {getInitials(judge.name)}
                              </span>
                              <span>{judge.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {unassignedJudges.length > 0 && (
                      <div className="flex items-center gap-3">
                        <Select onValueChange={(judgeId: string) => assignJudge(team.id, judgeId)}>
                          <SelectTrigger className="w-60">
                            <SelectValue placeholder="Assign a judge" />
                          </SelectTrigger>
                          <SelectContent>
                            {unassignedJudges.map((judge) => (
                              <SelectItem key={judge.id} value={judge.id}>
                                {judge.name} ({judge.specialty})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-gray-500">Choose from unassigned judges</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <aside className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Unassigned Judges</CardTitle>
                  <p className="text-sm text-gray-500">{unassignedJudges.length} available</p>
                </div>
                <UserPlus className="h-5 w-5 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {unassignedJudges.length === 0 && (
                <p className="text-sm text-gray-500">All judges are assigned.</p>
              )}
              {unassignedJudges.map((judge) => (
                <div
                  key={judge.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white text-sm">
                      {getInitials(judge.name)}
                    </span>
                    <div>
                      <p className="font-semibold leading-tight">{judge.name}</p>
                      <p className="text-xs text-gray-600">{judge.specialty}</p>
                    </div>
                  </div>
                  <Select onValueChange={(teamId: string) => assignJudge(teamId, judge.id)}>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Assign" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 space-y-2">
              <p>• Drag judges to assign them to teams (coming soon)</p>
              <p>• Click a judge pill to unassign</p>
              <p>• Teams need at least 2 judges</p>
              <div className="flex items-center gap-2 pt-2 text-gray-500">
                <Menu className="h-4 w-4" />
                Interactive drag-and-drop can be wired to the backend API later.
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}
