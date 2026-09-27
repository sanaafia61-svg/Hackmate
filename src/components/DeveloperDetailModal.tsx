import React, { useState } from 'react';
import { Developer } from '../types';

interface DeveloperDetailModalProps {
  developer: Developer | null;
  onClose: () => void;
  onConnect: (devId: string, customNote?: string) => void;
}

export const DeveloperDetailModal: React.FC<DeveloperDetailModalProps> = ({
  developer,
  onClose,
  onConnect
}) => {
  const [customNote, setCustomNote] = useState('');
  const [invited, setInvited] = useState(false);

  if (!developer) return null;

  const handleSendInvite = () => {
    onConnect(developer.id, customNote);
    setInvited(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

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
            <img
              src={developer.avatar}
              alt={developer.name}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-zinc-700/80"
            />
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
                {developer.matchScore}% MATCH
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              {developer.major || 'Computer Science'} • {developer.university} ({developer.classYear || "'26"})
            </p>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              <span>{developer.location}</span>
              <span className="mx-1">•</span>
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>{developer.weeklyHours} hrs/wk available</span>
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Builder Background</h4>
          <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
            {developer.bio}
          </p>
        </div>

        {/* Compatibility Deep Dive */}
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider font-mono">
              Synergy Assessment
            </span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            <strong className="text-white font-medium">{developer.matchReasonType}: </strong>
            {developer.matchReasonText}
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
              {developer.tracks.map((track) => (
                <span
                  key={track}
                  className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-xs"
                >
                  {track}
                </span>
              ))}
            </div>
          </div>
        </div>

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

        {/* Note input for invite */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Include a custom project pitch / invitation note (Optional):
          </label>
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="e.g. Building an autonomous agent platform for CalHacks, want to team up?"
            className="w-full px-3.5 py-2.5 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSendInvite}
            type="button"
            className={`px-6 py-2 rounded-full font-mono text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              invited || developer.connectionStatus === 'requested'
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/40'
                : 'bg-white text-black hover:bg-zinc-200 shadow-md'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {invited || developer.connectionStatus === 'requested' ? 'check' : 'send'}
            </span>
            <span>
              {invited || developer.connectionStatus === 'requested' ? 'Invitation Sent ✓' : 'Send Team Invitation'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
