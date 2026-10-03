import React from 'react';
import { ArrowUpRight, Github, Linkedin, PencilLine, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { AnimalAvatar } from './AnimalAvatar';

interface ProfileViewProps {
  user: UserProfile;
  profileId: string;
  onEditProfile: () => void;
  onBrowseMatches: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  profileId,
  onEditProfile,
  onBrowseMatches,
}) => {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <AnimalAvatar profileId={profileId} name={user.name} className="h-20 w-20 border border-slate-200 text-4xl" />
              <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Developer profile</p>
              <h1 className="mt-1 text-[1.7rem] font-semibold tracking-[-0.05em] text-slate-900 sm:text-[2.1rem]">{user.name}</h1>
              <p className="mt-1 text-sm text-slate-500">{user.university || 'Add your college'}</p>
              <p className="mt-0.5 text-xs text-slate-400">{user.experienceLevel || 'Add your experience'} • {user.completionPercentage}% complete</p>
            </div>

            <button
              type="button"
              onClick={onEditProfile}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-xs font-medium text-white"
            >
              <PencilLine size={14} />
              Edit
            </button>
          </div>
        </section>

        <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">About</h2>
            <button type="button" onClick={onBrowseMatches} className="text-sm font-medium text-slate-700">Browse matches</button>
          </div>
          <p className="text-sm leading-6 text-slate-600">{user.bio || 'No bio added yet.'}</p>
        </section>

        <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.length > 0 ? (
              user.skills.map((skill) => (
                <span key={skill} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700">{skill}</span>
              ))
            ) : (
              <span className="text-sm text-slate-500">No skills added yet.</span>
            )}
          </div>
        </section>

        <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {user.interests.length > 0 ? (
              user.interests.map((interest) => (
                <span key={interest} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700">{interest}</span>
              ))
            ) : (
              <span className="text-sm text-slate-500">No interests added yet.</span>
            )}
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Looking for</h2>
            <p className="text-sm text-slate-600">{user.lookingFor || 'Not specified'}</p>
          </section>

          <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Experience</h2>
            <p className="text-sm text-slate-600">{user.hackathonExperience || 'Not added yet'}</p>
          </section>
        </div>

        <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Links</h2>
          <div className="flex flex-wrap gap-2">
            {user.githubUrl ? (
              <a href={user.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <Github size={14} />
                GitHub
                <ArrowUpRight size={14} />
              </a>
            ) : null}
            {user.linkedinUrl ? (
              <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <Linkedin size={14} />
                LinkedIn
                <ArrowUpRight size={14} />
              </a>
            ) : null}
            {!user.githubUrl && !user.linkedinUrl && <span className="text-sm text-slate-500">No links added yet.</span>}
          </div>
        </section>

        <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-slate-900" />
            <h2 className="text-base font-semibold text-slate-900">Build profile</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">Keep your public profile sharp with your current role, interest, and project focus.</p>
        </section>
      </div>
    </div>
  );
};
