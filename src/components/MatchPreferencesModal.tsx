import React, { useState } from 'react';

interface MatchPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePreferences: (prefs: any) => void;
}

export const MatchPreferencesModal: React.FC<MatchPreferencesModalProps> = ({
  isOpen,
  onClose,
  onSavePreferences
}) => {
  const [targetTrack, setTargetTrack] = useState('Open Source & Distributed AI');
  const [teamSize, setTeamSize] = useState('4 builders (Standard)');
  const [timezoneDelta, setTimezoneDelta] = useState('Within 2 Hours');
  const [rolePriority, setRolePriority] = useState('Complementary Skill Overlap');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSavePreferences({ targetTrack, teamSize, timezoneDelta, rolePriority });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0e0f14] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Match Preferences</h2>
            <p className="text-xs text-zinc-400">Calibrate the recommendation algorithm</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Target Track */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-mono uppercase tracking-wider">
              Priority Track
            </label>
            <select
              value={targetTrack}
              onChange={(e) => setTargetTrack(e.target.value)}
              className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500"
            >
              <option value="Open Source & Distributed AI">Open Source & Distributed AI</option>
              <option value="HealthTech & Bio Telemetry">HealthTech & Bio Telemetry</option>
              <option value="Mobile FinTech & Consumer Apps">Mobile FinTech & Consumer Apps</option>
              <option value="Hardware & Embedded Robotics">Hardware & Embedded Robotics</option>
            </select>
          </div>

          {/* Target Team Size */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-mono uppercase tracking-wider">
              Desired Squad Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['2 (Duo)', '3 (Trio)', '4 builders (Standard)'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setTeamSize(size)}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                    teamSize === size
                      ? 'bg-white text-black font-semibold'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Timezone Delta */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-mono uppercase tracking-wider">
              Maximum Timezone Delta
            </label>
            <select
              value={timezoneDelta}
              onChange={(e) => setTimezoneDelta(e.target.value)}
              className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500"
            >
              <option value="Exact Match (0 hrs)">Exact Match (0 hrs delta)</option>
              <option value="Within 2 Hours">Within 2 Hours (Recommended)</option>
              <option value="Within 4 Hours">Within 4 Hours</option>
              <option value="Global / Any Timezone">Global / Any Timezone</option>
            </select>
          </div>

          {/* Matchmaking Philosophy */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 font-mono uppercase tracking-wider">
              Algorithm Bias
            </label>
            <div className="flex flex-col gap-2">
              <label
                onClick={() => setRolePriority('Complementary Skill Overlap')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  rolePriority === 'Complementary Skill Overlap'
                    ? 'bg-zinc-900/80 border-emerald-500/40'
                    : 'bg-zinc-900/40 border-zinc-800'
                }`}
              >
                <div>
                  <p className="text-xs text-white font-medium">Complementary Skill Overlap</p>
                  <p className="text-[11px] text-zinc-400">Pairs frontend with backend, systems, and design</p>
                </div>
                {rolePriority === 'Complementary Skill Overlap' && (
                  <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                )}
              </label>

              <label
                onClick={() => setRolePriority('Same Domain Deep Stack')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  rolePriority === 'Same Domain Deep Stack'
                    ? 'bg-zinc-900/80 border-emerald-500/40'
                    : 'bg-zinc-900/40 border-zinc-800'
                }`}
              >
                <div>
                  <p className="text-xs text-white font-medium">Same Domain Deep Stack</p>
                  <p className="text-[11px] text-zinc-400">Pairs with same language stack for monolithic speed</p>
                </div>
                {rolePriority === 'Same Domain Deep Stack' && (
                  <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-5 border-t border-zinc-800/80 mt-6">
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
            {saved ? 'Saved ✓' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};
