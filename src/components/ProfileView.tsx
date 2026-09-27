import React from 'react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onEditProfile: () => void;
  onBrowseMatches: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onEditProfile,
  onBrowseMatches
}) => {
  return (
    <div className="w-full pt-20 pb-16 bg-background min-h-[calc(100vh-64px)] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 pt-4">
        {/* Profile Header Dossier */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0c0d12] border border-zinc-800/80 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-zinc-800/70">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={user.avatar || undefined}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-zinc-700/80 shadow-md"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 ring-4 ring-[#0c0d12]"></span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">{user.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
                    {user.completionPercentage}% Complete
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
                  {user.university || 'Add your college'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                onClick={onEditProfile}
                className="px-4 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
              >
                Edit Dossier
              </button>
              <button
                onClick={onBrowseMatches}
                className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-mono text-xs transition-colors cursor-pointer"
              >
                View Matches
              </button>
            </div>
          </div>

          {/* Dossier Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500">Hackathon Experience</h3>
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <p className="text-sm font-semibold text-white">{user.hackathonExperience || 'Not added yet'}</p>
              </div>

              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 pt-2">Desired Squad Role</h3>
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <p className="text-sm font-semibold text-white">{user.seekingRole || 'No preferred role selected'}</p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500">Skills & Tech Stack</h3>
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-700/80 font-mono text-xs text-zinc-200"
                  >
                    {skill}
                  </span>
                ))}
                {user.skills.length === 0 && <span className="text-xs text-zinc-500">No skills added yet.</span>}
              </div>

              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 pt-2">Interests</h3>
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap gap-2">
                {user.interests.length > 0 ? user.interests.map((interest) => (
                  <span key={interest} className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-700/80 font-mono text-xs text-zinc-200">{interest}</span>
                )) : <span className="text-xs text-zinc-500">No interests added yet.</span>}
              </div>

              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 pt-2">Experience</h3>
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <p className="text-xs sm:text-sm text-zinc-300">{user.experienceLevel || 'Not specified'}</p>
              </div>

              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 pt-2">About & Bio</h3>
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">{user.bio || 'No bio added yet.'}</p>
              </div>

              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 pt-2">Looking for</h3>
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{user.lookingFor || 'Add what kind of teammates or projects you are looking for.'}</p>
              </div>

              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 pt-2">Links</h3>
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap gap-4 text-xs">
                {user.githubUrl && <a className="text-zinc-200 hover:text-white underline" href={user.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}
                {user.linkedinUrl && <a className="text-zinc-200 hover:text-white underline" href={user.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>}
                {!user.githubUrl && !user.linkedinUrl && <span className="text-zinc-500">No links added yet.</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
