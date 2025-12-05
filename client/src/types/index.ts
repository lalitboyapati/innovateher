export interface Judge {
  _id: string;
  name: string;
  initials: string;
  specialty: string;
  userId?: string | null;
  trackId?: string | null;
  maxProjects?: number;
  currentProjectsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  category: string;
  description: string;
  participantId?: string | User;
  trackId?: string | Track;
  githubUrl?: string;
  demoUrl?: string;
  assignedJudges: Judge[];
  status?: 'submitted' | 'under_review' | 'judged' | 'winner';
  averageScore?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id?: string;
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'judge' | 'participant';
  firstName?: string;
  lastName?: string;
  fullName?: string;
  specialty?: string;
  initials?: string;
  judgeProfile?: string | Judge;
  projects?: string[] | Project[];
  trackId?: string | Track;
  createdAt?: string;
  updatedAt?: string;
}

export interface Track {
  _id: string;
  name: string;
  description?: string;
  category: string;
  minJudges?: number;
  maxJudges?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Score {
  _id: string;
  projectId: string | Project;
  judgeId: string | Judge;
  rubricScores: {
    innovation: { score: number; weight: number };
    technical: { score: number; weight: number };
    presentation: { score: number; weight: number };
    impact: { score: number; weight: number };
  };
  totalScore: number;
  feedback?: string;
  sentimentScore?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaderboardEntry {
  projectId: string;
  projectName: string;
  category: string;
  participant: {
    name: string;
    email: string;
  };
  track?: {
    name: string;
    category: string;
  } | null;
  averageScore: number;
  judgesCount: number;
}
