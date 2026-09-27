import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave
}) => {
  const [trophies, setTrophies] = useState<string[]>(
    user.trophies.length > 0
      ? user.trophies
      : ['CalHacks 10.0 Best Frontend', 'HackMIT 2024 Finalist']
  );
  const [newTrophy, setNewTrophy] = useState('');
  const [skills, setSkills] = useState<string[]>(user.skills);
  const [newSkill, setNewSkill] = useState('');
  const [bio, setBio] = useState(user.bio);
  const [targetEvent, setTargetEvent] = useState(user.targetEvent);

  if (!isOpen) return null;

  const handleAddTrophy = () => {
    if (newTrophy.trim() && !trophies.includes(newTrophy.trim())) {
      setTrophies([...trophies, newTrophy.trim()]);
      setNewTrophy('');
    }
  };

  const handleRemoveTrophy = (t: string) => {
    setTrophies(trophies.filter((item) => item !== t));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (s: string) => {
    setSkills(skills.filter((item) => item !== s));
  };

  const handleSave = () => {
    const updated: UserProfile = {
      ...user,
      trophies,
      skills,
      bio,
      targetEvent,
      completionPercentage: trophies.length > 0 ? 100 : 80
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0e0f14] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]">badge</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Complete Builder Dossier</h2>
            <p className="text-xs text-zinc-400">Unlock 100% Priority Matching for CalHacks 2025</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 max-h-[60vh] overflow-y-auto pr-1">
          {/* Trophies Section */}
          <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-400">emoji_events</span>
                <span>Hackathon Trophies (+20% Completion)</span>
              </label>
              <span className="text-[10px] font-mono text-emerald-400">Required for 100%</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {trophies.map((trophy) => (
                <span
                  key={trophy}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                >
                  <span>{trophy}</span>
                  <button
                    onClick={() => handleRemoveTrophy(trophy)}
                    className="hover:text-red-400 text-zinc-500 cursor-pointer ml-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTrophy}
                onChange={(e) => setNewTrophy(e.target.value)}
                placeholder="e.g. TreeHacks 2024 AI Track Winner..."
                className="flex-1 px-3 py-1.5 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
              />
              <button
                type="button"
                onClick={handleAddTrophy}
                className="px-3.5 py-1.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-200 cursor-pointer"
              >
                Add Trophy
              </button>
            </div>
          </div>

          {/* Core Skills */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Verified Skills & Frameworks</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-400 text-zinc-500 cursor-pointer ml-1"
                  >
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill (e.g. Docker, GraphQL)..."
                className="flex-1 px-3 py-1.5 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 font-mono"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded-xl cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Personal Bio & Project Ambition</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 leading-relaxed font-sans"
            />
          </div>

          {/* Target Event */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Primary Target Hackathon</label>
            <select
              value={targetEvent}
              onChange={(e) => setTargetEvent(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500"
            >
              <option value="CalHacks Spring 2025">CalHacks Spring 2025 (San Francisco, CA)</option>
              <option value="HackMIT 2025">HackMIT 2025 (Cambridge, MA)</option>
              <option value="TreeHacks 2025">TreeHacks 2025 (Stanford, CA)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-zinc-800/80 mt-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-xs text-zinc-400">
              Projected Score: {trophies.length > 0 ? '100% (Priority Match Ready)' : '80%'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors shadow-md cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
