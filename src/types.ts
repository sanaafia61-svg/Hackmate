export interface Developer {
  id: string;
  name: string;
  avatar: string;
  university: string;
  classYear?: string;
  major?: string;
  location: string;
  matchScore: number;
  experienceLevel: string;
  hackathonCount: number;
  trophies?: string[];
  roles: string[];
  seekingRoles?: string;
  topSkills: string[];
  allSkills: string[];
  interests?: string[];
  hackathonExperience?: string;
  lookingFor?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  tracks: string[];
  bio: string;
  matchReasonType: 'Complementary' | 'Shared Interest' | 'Skill Complement' | 'Why you match' | 'Complementary role match' | 'Compatibility note' | 'Complementary profile';
  matchReasonText: string;
  weeklyHours: number;
  reposCount?: number;
  prCount?: number;
  discordHandle?: string;
  githubUsername?: string;
  isOnline: boolean;
  statusText?: string;
  connectionStatus?: 'none' | 'requested' | 'outgoing-pending' | 'incoming-pending' | 'connected';
  connectionRequestId?: string;
}

export type ConnectionRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type ConnectionAction = 'connect' | 'accept' | 'reject' | 'cancel';

export interface ConnectionRequestRecord {
  id: string;
  senderId: string;
  receiverId: string;
  status: ConnectionRequestStatus;
  developer: Developer;
  createdAt: string;
}

export interface PendingRequest {
  id: string;
  developer: Developer;
  category: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Connection {
  id: string;
  developer: Developer;
  status: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface FilterState {
  searchQuery: string;
  targetRoles: string[];
  skills: string[];
  experienceTier: string;
  universityGroup: string;
  preferredTrack: string;
  pastHackathonsRange: string;
  sortBy: string;
}

export interface UserProfile {
  name: string;
  university: string;
  major: string;
  avatar: string;
  completionPercentage: number;
  skills: string[];
  interests: string[];
  isCollegeVerified: boolean;
  trophies: string[];
  seekingRole: string;
  experienceLevel: string;
  hackathonExperience: string;
  lookingFor: string;
  bio: string;
  targetEvent: string;
  githubUrl: string;
  linkedinUrl: string;
}
