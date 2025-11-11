export interface Judge {
  _id: string;
  name: string;
  initials: string;
  specialty: string;
  assignedToProjectId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  category: string;
  description: string;
  assignedJudges: Judge[];
  createdAt?: string;
  updatedAt?: string;
}

