import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserProfile) => void | Promise<void>;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave
}) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [skills, setSkills] = useState<string[]>(user.skills);
  const [newSkill, setNewSkill] = useState('');
  const [interests, setInterests] = useState<string[]>(user.interests);
  const [newInterest, setNewInterest] = useState('');
  const [university, setUniversity] = useState(user.university);
  const [githubUrl, setGithubUrl] = useState(user.githubUrl);
  const [linkedinUrl, setLinkedinUrl] = useState(user.linkedinUrl);
  const [experienceLevel, setExperienceLevel] = useState(user.experienceLevel);
  const [seekingRole, setSeekingRole] = useState(user.seekingRole);
  const [hackathonExperience, setHackathonExperience] = useState(user.hackathonExperience);
  const [lookingFor, setLookingFor] = useState(user.lookingFor);
  const [bio, setBio] = useState(user.bio);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (s: string) => {
    setSkills(skills.filter((item) => item !== s));
  };

  const handleAddInterest = () => {
    const interest = newInterest.trim();
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
      setNewInterest('');
    }
  };

  const handleSave = async () => {
    setSaveError(null);
    setIsSaving(true);
    const updated: UserProfile = {
      ...user,
      name,
      avatar,
      university,
      githubUrl,
      linkedinUrl,
      experienceLevel,
      seekingRole,
      hackathonExperience,
      lookingFor,
      skills,
      interests,
      bio,
      completionPercentage: 0
    };
    try {
      await onSave(updated);
      onClose();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSaving(false);
    }
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
            <p className="text-xs text-zinc-400">Keep your public builder profile up to date.</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5" htmlFor="profile-full-name">Full name</label>
              <input id="profile-full-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5" htmlFor="profile-college">College</label>
              <input id="profile-college" value={university} onChange={(e) => setUniversity(e.target.value)} className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5" htmlFor="profile-avatar">Avatar URL</label>
              <input id="profile-avatar" type="url" value={avatar} onChange={(e) => setAvatar(e.target.value)} className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5" htmlFor="profile-experience">Experience</label>
              <select id="profile-experience" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500">
                <option value="">Select experience</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5" htmlFor="profile-role">Preferred role</label>
              <input id="profile-role" value={seekingRole} onChange={(e) => setSeekingRole(e.target.value)} className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5" htmlFor="profile-github">GitHub URL</label>
              <input id="profile-github" type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5" htmlFor="profile-linkedin">LinkedIn URL</label>
              <input id="profile-linkedin" type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500" />
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

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Interests</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {interests.map((interest) => (
                <span key={interest} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                  {interest}
                  <button type="button" aria-label={`Remove ${interest}`} onClick={() => setInterests(interests.filter((item) => item !== interest))} className="text-zinc-500 hover:text-red-400">
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddInterest(); } }} placeholder="Add an interest..." className="flex-1 px-3 py-1.5 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500" />
              <button type="button" onClick={handleAddInterest} className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded-xl cursor-pointer">Add</button>
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

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5" htmlFor="profile-hackathon-experience">Hackathon experience</label>
            <textarea id="profile-hackathon-experience" rows={2} value={hackathonExperience} onChange={(e) => setHackathonExperience(e.target.value)} className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5" htmlFor="profile-looking-for">Looking for</label>
            <textarea id="profile-looking-for" rows={2} value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500" />
          </div>

        </div>

        <div className="flex items-center justify-between pt-5 border-t border-zinc-800/80 mt-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-xs text-zinc-400">
              Profile Completion: based on your profile details
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
              disabled={isSaving}
              className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors shadow-md cursor-pointer disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
        {saveError && <p className="mt-3 text-right text-xs text-red-400" role="alert">Unable to save profile: {saveError}</p>}
      </div>
    </div>
  );
};
