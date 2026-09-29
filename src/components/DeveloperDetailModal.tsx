import React from 'react';
import { ConnectionAction, Developer } from '../types';
import { AnimalAvatar } from './AnimalAvatar';

interface DeveloperDetailModalProps {
  developer: Developer | null;
  onClose: () => void;
  onConnectionAction: (action: ConnectionAction) => void;
  isAuthenticated: boolean;
  isActionPending: boolean;
}

export const DeveloperDetailModal: React.FC<DeveloperDetailModalProps> = ({
  developer,
  onClose,
  onConnectionAction,
  isAuthenticated,
  isActionPending
}) => {
  if (!developer) return null;
  const status = developer.connectionStatus || 'none';
  const primaryAction: ConnectionAction = status === 'incoming-pending' ? 'accept'
    : status === 'outgoing-pending' || status === 'requested' ? 'cancel' : 'connect';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0e0f14] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header Profile Info */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
          <div className="relative">
            <AnimalAvatar profileId={developer.id} name={developer.name} className="h-[72px] w-[72px] border border-zinc-700/80 text-5xl sm:h-20 sm:w-20" />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-2 ring-black ${
                developer.isOnline ? 'bg-emerald-400' : 'bg-zinc-500'
              }`}
            ></span>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                {developer.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-semibold">
                {developer.matchScore}% Compatibility
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              {developer.university}{developer.major ? ` • ${developer.major}` : ''}
            </p>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              <span>{developer.experienceLevel}</span>
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Builder Background</h4>
          <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
            {developer.bio || 'This builder has not added a bio yet.'}
          </p>
        </div>

        {/* Compatibility Deep Dive */}
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider font-mono">
              Compatibility estimate
            </span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            This simple estimate compares skills, interests, experience, and preferred role. It is not authoritative.
          </p>
        </div>

        {/* Skills & Frameworks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Technical Core</h4>
            <div className="flex flex-wrap gap-1.5">
              {developer.allSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Hackathon Tracks</h4>
            <div className="flex flex-wrap gap-1.5">
                {(developer.interests || []).map((interest) => (
                <span
                    key={interest}
                  className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-xs"
                >
                    {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Looking For</h4>
            <p className="text-sm text-zinc-300">{developer.lookingFor || 'Not specified'}</p>
          </div>
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Hackathon Experience</h4>
            <p className="text-sm text-zinc-300">{developer.hackathonExperience || 'Not specified'}</p>
          </div>
        </div>

        {(developer.githubUrl || developer.linkedinUrl) && (
          <div className="flex gap-4 mb-6 text-sm">
            {developer.githubUrl && <a href={developer.githubUrl} target="_blank" rel="noreferrer" className="text-zinc-200 underline hover:text-white">GitHub</a>}
            {developer.linkedinUrl && <a href={developer.linkedinUrl} target="_blank" rel="noreferrer" className="text-zinc-200 underline hover:text-white">LinkedIn</a>}
          </div>
        )}

        {/* Trophies & Past Record */}
        {developer.trophies && developer.trophies.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Past Accolades</h4>
            <div className="flex flex-wrap gap-2">
              {developer.trophies.map((trophy, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-200"
                >
                  <span className="material-symbols-outlined text-[16px] text-amber-400">emoji_events</span>
                  <span>{trophy}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
          {(status === 'outgoing-pending' || status === 'requested') && <span className="font-mono text-xs text-zinc-400">Pending</span>}
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          {status === 'incoming-pending' && <button disabled={isActionPending} onClick={() => onConnectionAction('reject')} className="px-5 py-2 rounded-full border border-zinc-700 text-xs text-zinc-200 disabled:opacity-50" type="button">Reject</button>}
          <button
            disabled={isActionPending || status === 'connected'}
            onClick={() => onConnectionAction(primaryAction)}
            type="button"
            className="px-6 py-2 rounded-full bg-white text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-emerald-400 font-mono text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <span>{isActionPending ? 'Saving...' : status === 'connected' ? 'Connected' : status === 'incoming-pending' ? 'Accept' : status === 'outgoing-pending' || status === 'requested' ? 'Cancel' : isAuthenticated ? 'Connect' : 'Sign in to connect'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
