import type { User } from '@supabase/supabase-js';
import type { Developer, UserProfile } from '../types';

export interface ProfileRow {
  id: string;
  full_name: string | null;
  college: string | null;
  bio: string | null;
  experience: string | null;
  skills: string[] | null;
  interests: string[] | null;
  preferred_role: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  hackathon_experience: string | null;
  looking_for: string | null;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export const emptyProfile = (authUser: User): UserProfile => ({
  name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Builder',
  university: '',
  major: '',
  avatar: '',
  completionPercentage: 0,
  skills: [],
  interests: [],
  isCollegeVerified: false,
  trophies: [],
  seekingRole: '',
  experienceLevel: '',
  hackathonExperience: '',
  lookingFor: '',
  bio: '',
  targetEvent: '',
  githubUrl: '',
  linkedinUrl: ''
});

export const profileFromRow = (row: ProfileRow, authUser: User): UserProfile => ({
  ...emptyProfile(authUser),
  name: row.full_name || authUser.email?.split('@')[0] || 'Builder',
  university: row.college || '',
  avatar: row.avatar_url || '',
  skills: row.skills || [],
  interests: row.interests || [],
  seekingRole: row.preferred_role || '',
  experienceLevel: row.experience || '',
  hackathonExperience: row.hackathon_experience || '',
  lookingFor: row.looking_for || '',
  bio: row.bio || ''
});

export const profileToRow = (profile: UserProfile) => ({
  full_name: profile.name,
  college: profile.university,
  bio: profile.bio,
  experience: profile.experienceLevel,
  skills: profile.skills,
  interests: profile.interests,
  preferred_role: profile.seekingRole,
  github_url: profile.githubUrl,
  linkedin_url: profile.linkedinUrl,
  hackathon_experience: profile.hackathonExperience,
  looking_for: profile.lookingFor,
  avatar_url: profile.avatar
});

export const hackathonCountFromText = (value: string) => {
  const explicitCount = value.match(/(?:^|\b)(\d+)\s*(?:past\s+)?hackathons?\b/i);
  const leadingCount = explicitCount || value.match(/^\s*(\d+)\b/);
  return leadingCount ? Number(leadingCount[1]) : 0;
};

export const profileCompletion = (profile: UserProfile) => {
  const completedFields = [
    profile.name,
    profile.university,
    profile.bio,
    profile.skills.length > 0,
    profile.interests.length > 0,
    profile.seekingRole,
    profile.githubUrl,
    profile.linkedinUrl,
    profile.hackathonExperience,
    profile.lookingFor
  ].filter((value) => typeof value === 'boolean' ? value : value.trim().length > 0).length;

  return Math.round((completedFields / 10) * 100);
};

export const developerFromProfile = (row: ProfileRow): Developer => {
  const allSkills = row.skills || [];
  const interests = row.interests || [];
  const role = row.preferred_role || '';

  return {
    id: row.id,
    name: row.full_name || 'HackMate builder',
    avatar: row.avatar_url || '',
    university: row.college || 'College not listed',
    major: '',
    location: row.college || 'Location not listed',
    matchScore: 0,
    experienceLevel: row.experience || 'Not specified',
    hackathonCount: hackathonCountFromText(row.hackathon_experience || ''),
    roles: role ? [role] : [],
    seekingRoles: role,
    topSkills: allSkills.slice(0, 5),
    allSkills,
    interests,
    hackathonExperience: row.hackathon_experience || '',
    lookingFor: row.looking_for || '',
    githubUrl: row.github_url || '',
    linkedinUrl: row.linkedin_url || '',
    tracks: interests,
    bio: row.bio || '',
    matchReasonType: 'Compatibility note',
    matchReasonText: 'A simple profile-based compatibility estimate, not an authoritative rating.',
    weeklyHours: 0,
    githubUsername: row.github_url || undefined,
    isOnline: false,
    statusText: 'Profile on HackMate',
    connectionStatus: 'none'
  };
};

export const publicProfileColumns = 'id, full_name, college, bio, experience, skills, interests, preferred_role, github_url, linkedin_url, hackathon_experience, looking_for, avatar_url';
