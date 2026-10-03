import React, { useState } from 'react';
import { Plus, Save, Trash2, X } from 'lucide-react';
import { UserProfile } from '../types';
import { AnimalAvatar } from './AnimalAvatar';

interface ProfileModalProps {
  user: UserProfile;
  profileId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserProfile) => void | Promise<void>;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  profileId,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(user.name);
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
    const skill = newSkill.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((item) => item !== skill));
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
      completionPercentage: 0,
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
    <div className="fixed inset-0 z-50 bg-slate-950/50 p-0 sm:p-4">
      <div className="flex h-full w-full flex-col bg-white sm:mx-auto sm:mt-6 sm:max-h-[92vh] sm:w-full sm:max-w-2xl sm:rounded-[30px] sm:border sm:border-slate-200 sm:shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-5">
          <div className="flex items-center gap-3">
            <AnimalAvatar profileId={profileId} name={user.name} className="h-10 w-10 border border-slate-200 text-lg" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Builder profile</p>
              <h2 className="text-base font-semibold text-slate-900">Edit details</h2>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close profile editor"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="space-y-5">
            <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-3">
              <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Basic info</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="profile-full-name" className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
                  <input id="profile-full-name" value={name} onChange={(e) => setName(e.target.value)} className="min-h-[44px] w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="profile-college" className="mb-1.5 block text-sm font-medium text-slate-700">College</label>
                  <input id="profile-college" value={university} onChange={(e) => setUniversity(e.target.value)} className="min-h-[44px] w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none" />
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-3">
              <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Developer info</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="profile-experience" className="mb-1.5 block text-sm font-medium text-slate-700">Experience</label>
                  <select id="profile-experience" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="min-h-[44px] w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none">
                    <option value="">Select experience</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="profile-role" className="mb-1.5 block text-sm font-medium text-slate-700">Preferred role</label>
                  <input id="profile-role" value={seekingRole} onChange={(e) => setSeekingRole(e.target.value)} className="min-h-[44px] w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none" />
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-3">
              <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700">
                    {skill}
                    <button type="button" aria-label={`Remove ${skill}`} onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-red-600">
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                  placeholder="Add a skill"
                  className="min-h-[44px] flex-1 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                />
                <button type="button" onClick={handleAddSkill} className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-3 text-white">
                  <Plus size={16} />
                </button>
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-3">
              <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span key={interest} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700">
                    {interest}
                    <button type="button" aria-label={`Remove ${interest}`} onClick={() => setInterests(interests.filter((item) => item !== interest))} className="text-slate-400 hover:text-red-600">
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddInterest(); } }}
                  placeholder="Add an interest"
                  className="min-h-[44px] flex-1 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                />
                <button type="button" onClick={handleAddInterest} className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-3 text-white">
                  <Plus size={16} />
                </button>
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-3">
              <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Links</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="profile-github" className="mb-1.5 block text-sm font-medium text-slate-700">GitHub</label>
                  <input id="profile-github" type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="min-h-[44px] w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none" placeholder="https://github.com/..." />
                </div>
                <div>
                  <label htmlFor="profile-linkedin" className="mb-1.5 block text-sm font-medium text-slate-700">LinkedIn</label>
                  <input id="profile-linkedin" type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="min-h-[44px] w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none" placeholder="https://linkedin.com/..." />
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-3">
              <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">About</h3>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="min-h-[88px] w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none" placeholder="Tell people what you enjoy building" />
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-3">
              <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Hackathon info</h3>
              <div className="grid gap-3">
                <div>
                  <label htmlFor="profile-hackathon-experience" className="mb-1.5 block text-sm font-medium text-slate-700">Hackathon experience</label>
                  <textarea id="profile-hackathon-experience" rows={2} value={hackathonExperience} onChange={(e) => setHackathonExperience(e.target.value)} className="min-h-[66px] w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="profile-looking-for" className="mb-1.5 block text-sm font-medium text-slate-700">Looking for</label>
                  <textarea id="profile-looking-for" rows={2} value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} className="min-h-[66px] w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none" />
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-5">
          <div className="flex items-center justify-between gap-2">
            <button type="button" onClick={onClose} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={isSaving} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              <Save size={15} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
          {saveError && <p className="mt-2 text-right text-xs text-red-600" role="alert">Unable to save profile: {saveError}</p>}
        </div>
      </div>
    </div>
  );
};
