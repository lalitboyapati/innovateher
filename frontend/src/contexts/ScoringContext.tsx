import { createContext, useContext, useState, ReactNode } from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  track: string;
  teamName: string;
  githubUrl?: string;
  devpostUrl?: string;
}

export interface ProjectScore {
  projectId: string;
  scores: Record<string, number>;
  comments: Record<string, string>;
  generalComments: string;
  totalScore: number;
  submittedAt: string;
}

interface ScoringContextType {
  projects: Project[];
  submittedScores: Record<string, ProjectScore>;
  submitScore: (score: ProjectScore) => void;
  isProjectScored: (projectId: string) => boolean;
  getProjectScore: (projectId: string) => ProjectScore | undefined;
}

const ScoringContext = createContext<ScoringContextType | undefined>(undefined);

// Mock project data
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Smart Campus Navigator',
    description: 'An AI-powered mobile app that helps students navigate the Purdue campus efficiently, providing real-time updates on building accessibility, dining hall wait times, and optimal routes between classes.',
    track: 'Mobile Apps',
    teamName: 'Team Alpha',
    githubUrl: 'https://github.com/example/campus-nav',
    devpostUrl: 'https://devpost.com/software/campus-nav',
  },
  {
    id: '2',
    title: 'AI Study Buddy',
    description: 'A machine learning platform that creates personalized study plans based on learning patterns and helps students prepare for exams more effectively.',
    track: 'AI/ML',
    teamName: 'Team Beta',
  },
  {
    id: '3',
    title: 'EcoTrack',
    description: 'A sustainability tracking app that helps users monitor their carbon footprint and provides personalized recommendations for reducing environmental impact.',
    track: 'Social Impact',
    teamName: 'Team Gamma',
    githubUrl: 'https://github.com/example/ecotrack',
  },
  {
    id: '4',
    title: 'SecureVault',
    description: 'An innovative password manager with blockchain-based encryption and multi-factor authentication for enhanced security.',
    track: 'Cybersecurity',
    teamName: 'Team Delta',
  },
  {
    id: '5',
    title: 'HealthHub',
    description: 'A telemedicine platform connecting patients with healthcare providers for virtual consultations and health monitoring.',
    track: 'HealthTech',
    teamName: 'Team Epsilon',
    devpostUrl: 'https://devpost.com/software/healthhub',
  },
];

export function ScoringProvider({ children }: { children: ReactNode }) {
  const [submittedScores, setSubmittedScores] = useState<Record<string, ProjectScore>>({});

  const submitScore = (score: ProjectScore) => {
    setSubmittedScores((prev) => ({
      ...prev,
      [score.projectId]: score,
    }));
  };

  const isProjectScored = (projectId: string): boolean => {
    return projectId in submittedScores;
  };

  const getProjectScore = (projectId: string): ProjectScore | undefined => {
    return submittedScores[projectId];
  };

  return (
    <ScoringContext.Provider
      value={{
        projects: MOCK_PROJECTS,
        submittedScores,
        submitScore,
        isProjectScored,
        getProjectScore,
      }}
    >
      {children}
    </ScoringContext.Provider>
  );
}

export function useScoring() {
  const context = useContext(ScoringContext);
  if (context === undefined) {
    throw new Error('useScoring must be used within a ScoringProvider');
  }
  return context;
}
