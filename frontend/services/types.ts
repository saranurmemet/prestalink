export type UserRole = 'user' | 'recruiter' | 'admin' | 'superadmin';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  languages: string[];
  profilePhoto?: string;
  bio?: string;
  certifications?: string[];
  cvUrl?: string;
  createdAt?: string;
  googleId?: string;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  salary?: string;
  location: string;
  requiredExperience?: string;
  requiredLanguage?: string;
  workType?: string;
  createdAt?: string;
  employerId?: string | { _id: string; name?: string; companyName?: string };
  closed?: boolean;
}

export interface Application {
  _id: string;
  userId: string | User;
  jobId: string | Job;
  cvUrl: string;
  certificates: string[];
  status: 'pending' | 'reviewing' | 'viewed' | 'interview' | 'accepted' | 'rejected';
  messages: Array<{
    sender: string;
    body: string;
    createdAt?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  _id: string;
  targetUserId: string;
  targetRole?: 'user' | 'recruiter' | 'employer' | 'admin' | 'superadmin';
  title: string;
  message: string;
  read: boolean;
  createdAt?: string;
}

