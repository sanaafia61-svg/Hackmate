import { supabase } from './supabaseClient';
import { developerFromProfile, publicProfileColumns, type ProfileRow } from './profileData';
import type { ConnectionRequestRecord, ConnectionRequestStatus } from '../types';

interface ConnectionRequestRow {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: ConnectionRequestStatus;
  created_at: string;
}

const missingProfile = (id: string): ProfileRow => ({
  id,
  full_name: null,
  college: null,
  bio: null,
  experience: null,
  skills: [],
  interests: [],
  preferred_role: null,
  github_url: null,
  linkedin_url: null,
  hackathon_experience: null,
  looking_for: null,
  avatar_url: null
});

export const loadConnectionRequests = async (userId: string): Promise<ConnectionRequestRecord[]> => {
  const { data, error } = await supabase
    .from('connection_requests')
    .select('id, sender_id, receiver_id, status, created_at')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  if (error) throw error;

  const requests = (data || []) as ConnectionRequestRow[];
  const developerIds = [...new Set(requests.map((request) =>
    request.sender_id === userId ? request.receiver_id : request.sender_id
  ))];
  const profilesById = new Map<string, ProfileRow>();

  if (developerIds.length > 0) {
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select(publicProfileColumns)
      .in('id', developerIds);
    if (profileError) throw profileError;
    for (const profile of (profiles || []) as ProfileRow[]) profilesById.set(profile.id, profile);
  }

  return requests.map((request) => {
    const developerId = request.sender_id === userId ? request.receiver_id : request.sender_id;
    const profile = profilesById.get(developerId) || missingProfile(developerId);
    return {
      id: request.id,
      senderId: request.sender_id,
      receiverId: request.receiver_id,
      status: request.status,
      developer: developerFromProfile(profile),
      createdAt: request.created_at
    };
  });
};