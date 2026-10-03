import React, { useState, useMemo, useEffect } from 'react';
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
import { ConnectionAction, Developer } from '../types';
import { hackathonCountFromText } from '../lib/profileData';
import { AnimalAvatar } from './AnimalAvatar';

interface DiscoverViewProps {
  developers: Developer[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pendingActionIds: string[];
  onConnectionAction: (devId: string, action: ConnectionAction, requestId?: string) => void;
  onViewDeveloper: (dev: Developer) => void;
}

const quickFilters = ['All', 'Frontend', 'Backend', 'Design', 'AI', 'Mobile'];

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  developers,
  isAuthenticated,
  isLoading,
  error,
  pendingActionIds,
  onConnectionAction,
  onViewDeveloper,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedExp, setSelectedExp] = useState<string>('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('Any Affiliation');
  const [selectedTrack, setSelectedTrack] = useState<string>('Any Interest');
  const [pastHackathons, setPastHackathons] = useState<string>('Any');
  const [sortBy, setSortBy] = useState<string>('Compatibility (Highest)');
  const [activeQuickRole, setActiveQuickRole] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('builderSearch')?.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRoles([]);
    setSelectedSkills([]);
    setSelectedExp('');
    setSelectedUniversity('Any Affiliation');
    setSelectedTrack('Any Interest');
    setPastHackathons('Any');
    setActiveQuickRole('All');
    setShowFilters(false);
  };

  const filteredDevelopers = useMemo(() => {
    let result = [...developers];

    const includesText = (values: string[], query: string) =>
      values.some((value) => value.toLocaleLowerCase().includes(query.toLocaleLowerCase()));

    if (activeQuickRole !== 'All') {
      result = result.filter((d) => includesText(d.roles, activeQuickRole));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.university.toLowerCase().includes(q) ||
          d.allSkills.some((s) => s.toLowerCase().includes(q)) ||
          (d.interests || []).some((interest) => interest.toLowerCase().includes(q)) ||
          d.bio.toLowerCase().includes(q) ||
          (d.lookingFor || '').toLowerCase().includes(q) ||
          (d.hackathonExperience || '').toLowerCase().includes(q)
      );
    }

    if (selectedRoles.length > 0 && activeQuickRole === 'All') {
      result = result.filter((d) => selectedRoles.some((role) => includesText(d.roles, role)));
    }

    if (selectedExp) {
      result = result.filter((d) => d.experienceLevel.toLocaleLowerCase() === selectedExp.toLocaleLowerCase());
    }

    if (selectedSkills.length > 0) {
      result = result.filter((d) =>
        d.allSkills.some((skill) =>
          selectedSkills.some((selected) => skill.toLocaleLowerCase() === selected.toLocaleLowerCase())
        )
      );
    }

    if (selectedUniversity === 'UC System (Berkeley, UCLA, UCSD)') {
      result = result.filter((developer) => /berkeley|ucla|ucsd|university of california/i.test(developer.university));
    } else if (selectedUniversity === 'Ivy League + MIT/Stanford') {
      result = result.filter((developer) => /harvard|yale|princeton|columbia|penn|brown|cornell|dartmouth|mit|stanford/i.test(developer.university));
    } else if (selectedUniversity === 'Top Hackathon Schools (Tier 1)') {
      result = result.filter((developer) => /stanford|mit|berkeley|waterloo|georgia tech|cmu|caltech|ut austin/i.test(developer.university));
    }

    if (selectedTrack !== 'Any Interest') {
      result = result.filter((developer) => includesText(developer.interests || [], selectedTrack));
    }

    if (pastHackathons !== 'Any') {
      result = result.filter((developer) => {
        const count = hackathonCountFromText(developer.hackathonExperience || '');
        if (pastHackathons === '1 - 2') return count >= 1 && count <= 2;
        if (pastHackathons === '3 - 5') return count >= 3 && count <= 5;
        return count >= 6;
      });
    }

    if (sortBy === 'Compatibility (Highest)') {
      result.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === 'Hackathons Attended') {
      result.sort((a, b) => b.hackathonCount - a.hackathonCount);
    } else if (sortBy === 'Preferred Role') {
      result.sort((a, b) => (a.seekingRoles || '').localeCompare(b.seekingRoles || ''));
    }

    return result;
  }, [developers, searchQuery, selectedRoles, selectedSkills, selectedExp, selectedUniversity, selectedTrack, pastHackathons, activeQuickRole, sortBy]);

  const displayedDevelopers = filteredDevelopers.slice(0, visibleCount);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {isAuthenticated ? `${developers.length} profiles` : 'Demo profiles'}
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-[1.7rem] font-semibold tracking-[-0.05em] text-slate-900 sm:text-[2rem]">Discover</h1>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700"
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-500">Find developers who complement your skills.</p>
        </section>

        <section className="rounded-[22px] border border-slate-200 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <label htmlFor="builderSearch" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Search developers
          </label>
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="builderSearch"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, college, or role"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
              type="text"
            />
          </div>
        </section>

        <section className="rounded-[22px] border border-slate-200 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Quick roles</p>
            <button type="button" onClick={resetFilters} className="text-xs font-medium text-slate-600">Reset</button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {quickFilters.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setActiveQuickRole(role);
                  if (role !== 'All') setSelectedRoles([role]);
                  if (role === 'All') setSelectedRoles([]);
                }}
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-medium ${
                  activeQuickRole === role ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <SlidersHorizontal size={15} />
              <span>Sort</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="Compatibility (Highest)">Compatibility</option>
              <option value="Hackathons Attended">Hackathons</option>
              <option value="Preferred Role">Role</option>
            </select>
          </div>
        </section>

        {showFilters && (
          <div className="fixed inset-0 z-40 bg-slate-950/40 p-4 backdrop-blur-sm md:hidden">
            <div className="mx-auto mt-16 max-w-md rounded-[28px] border border-slate-200 bg-white p-4 shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">Advanced filters</h2>
                <button type="button" onClick={() => setShowFilters(false)} className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600">
                  Close
                </button>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Experience</p>
                  <div className="flex flex-wrap gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((exp) => (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => {
                          setSelectedExp((current) => (current === exp ? '' : exp));
                        }}
                        className={`rounded-full px-2.5 py-1.5 text-xs ${selectedExp === exp ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-slate-50 text-slate-600'}`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="button" onClick={resetFilters} className="w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                  Reset filters
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading && <p className="text-sm text-slate-500" role="status">Loading developer profiles...</p>}
        {error && <p className="text-sm text-red-600" role="alert">Unable to load developer profiles: {error}</p>}

        <div className="space-y-3">
          {displayedDevelopers.map((dev) => (
            <article key={dev.id} className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <AnimalAvatar profileId={dev.id} name={dev.name} className="h-12 w-12 border border-slate-200 text-xl" />
                  <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${dev.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-[15px] font-semibold text-slate-900">{dev.name}</h3>
                      <p className="truncate text-xs text-slate-500">{dev.university}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                      {dev.matchScore}%
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-500">{dev.experienceLevel} • {dev.hackathonExperience || 'New builder'}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {dev.topSkills.slice(0, 3).map((skill) => (
                  <span key={skill} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-600">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-[11px] text-slate-500">
                  Looking for: <span className="text-slate-700">{dev.lookingFor || 'Frontend teammate'}</span>
                </p>
                <button type="button" onClick={() => onViewDeveloper(dev)} className="text-xs font-medium text-slate-600">
                  View profile
                </button>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => onConnectionAction(dev.id, 'connect')}
                  className="flex-1 rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                >
                  {dev.connectionStatus === 'outgoing-pending' ? 'Pending' : 'Connect'}
                </button>
                <button
                  type="button"
                  onClick={() => onViewDeveloper(dev)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  View
                </button>
              </div>
            </article>
          ))}
        </div>

        {!isLoading && filteredDevelopers.length > displayedDevelopers.length && (
          <button type="button" onClick={() => setVisibleCount((count) => count + 4)} className="mx-auto mt-2 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            Load more
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};