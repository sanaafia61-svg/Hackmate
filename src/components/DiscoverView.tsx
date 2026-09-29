import React, { useState, useMemo, useEffect } from 'react';
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
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [showTip, setShowTip] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [activeQuickRole, setActiveQuickRole] = useState<string>('All Roles');

  // Handle Cmd+K keyboard shortcut to focus search bar
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
    setActiveQuickRole('All Roles');
  };

  const filteredDevelopers = useMemo(() => {
    let result = [...developers];

    const includesText = (values: string[], query: string) =>
      values.some((value) => value.toLocaleLowerCase().includes(query.toLocaleLowerCase()));

    if (activeQuickRole !== 'All Roles') {
      result = result.filter((d) => includesText(d.roles, activeQuickRole));
    }

    // Search query
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

    // Role filtering from sidebar
    if (selectedRoles.length > 0 && activeQuickRole === 'All Roles') {
      result = result.filter((d) => selectedRoles.some((role) => includesText(d.roles, role)));
    }

    // Experience filter
    if (selectedExp) {
      result = result.filter((d) => d.experienceLevel.toLocaleLowerCase() === selectedExp.toLocaleLowerCase());
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      result = result.filter((d) => d.allSkills.some((skill) =>
        selectedSkills.some((selected) => skill.toLocaleLowerCase() === selected.toLocaleLowerCase())
      ));
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

    // Sort
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
    <div className="w-full pt-20 bg-background min-h-[calc(100vh-64px)] max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-16">
      <div className="flex flex-col w-full">
        {/* Discover Engine Page Header */}
        <section className="relative w-full pt-4 pb-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[11px] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{isAuthenticated ? `${developers.length} developer profiles` : 'Demo developer profiles'}</span>
              </div>
              <h1 className="text-3xl md:text-4xl text-white tracking-tight font-semibold">
                Find your HackMate
              </h1>
              <p className="text-sm md:text-base text-zinc-400 max-w-2xl mt-1.5">
                Discover developers who complement your skills, align on tech stacks, and share your hackathon ambitions.
              </p>
            </div>

            {/* Quick Status Metric Summary */}
            <div className="hidden lg:flex items-center gap-5 bg-[#0c0d12] px-5 py-3 rounded-2xl border border-white/[0.08]">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Profiles Shown</span>
                <span className="text-lg text-emerald-400 font-semibold font-mono">{developers.length}</span>
              </div>
              <div className="w-px h-7 bg-zinc-800"></div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Matches</span>
                <span className="text-sm text-zinc-200 font-medium">{filteredDevelopers.length} found</span>
              </div>
            </div>
          </div>

          {/* Search Bar & Controls Bar */}
          <div className="mt-6 bg-[#0c0d12] p-2.5 md:p-3 rounded-2xl border border-white/[0.08] flex flex-col gap-2.5">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[20px]">
                  search
                </span>
                <input
                  id="builderSearch"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 bg-zinc-900/90 rounded-xl text-white placeholder:text-zinc-500 text-sm border border-zinc-800 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all font-sans"
                  placeholder="Search developers, skills (e.g. React, PyTorch) or hackathon interests..."
                  type="text"
                />
                <kbd className="hidden sm:inline-block absolute right-3.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800 border border-zinc-700 rounded">
                  ⌘K
                </kbd>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative min-w-[220px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-zinc-900/90 px-3.5 py-2 pr-9 rounded-xl text-xs font-medium text-zinc-200 border border-zinc-800 focus:outline-none focus:border-zinc-500 cursor-pointer transition-all"
                  >
                    <option value="Compatibility (Highest)">Sort: Compatibility (Highest)</option>
                    <option value="Hackathons Attended">Sort: Hackathons Attended</option>
                    <option value="Preferred Role">Sort: Preferred Role</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none text-[18px]">
                    unfold_more
                  </span>
                </div>

                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden flex items-center justify-center gap-1.5 px-3.5 py-2 bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-xl text-xs font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 text-nowrap">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest pl-1 mr-1">Quick:</span>
              {['All Roles', 'Frontend', 'Backend', 'Machine Learning', 'UI/UX'].map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveQuickRole(role)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    activeQuickRole === role
                      ? 'bg-white text-black'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800/80'
                  }`}
                >
                  {role}
                </button>
              ))}
              <div className="h-3.5 w-px bg-zinc-800 mx-1"></div>
              <button
                onClick={() => resetFilters()}
                className="px-3 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 text-xs font-medium transition-colors cursor-pointer"
              >
                College: All
              </button>
              <button
                onClick={() => setSelectedExp('')}
                className="px-3 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 text-xs font-medium transition-colors cursor-pointer"
              >
                Experience: All
              </button>
            </div>
          </div>
        </section>

        {/* Main Content Layout (12-Column Grid) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Filter Sidebar (Left Column - 4 Cols) */}
          <aside
            className={`${
              showMobileFilters ? 'flex' : 'hidden'
            } lg:flex flex-col lg:col-span-4 bg-[#0a0a0e] p-5 rounded-2xl border border-white/[0.08] gap-5`}
            id="filterSidebar"
          >
            <div className="flex items-center justify-between pb-1 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-white text-[18px]">tune</span>
                <h2 className="text-sm font-semibold text-white tracking-tight">Refine Builders</h2>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                type="button"
              >
                Reset Filters
              </button>
            </div>

            {/* Filter Group: Primary Roles */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-zinc-300">Target Role</label>
              <div className="grid grid-cols-2 gap-2 mt-0.5">
                {['Frontend', 'Backend', 'Full Stack', 'ML / AI', 'UI/UX Design', 'Mobile'].map((role) => (
                  <label
                    key={role}
                    className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/70 cursor-pointer hover:border-zinc-700 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="w-3.5 h-3.5 accent-white rounded bg-zinc-800 border-zinc-700 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-300">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Technical Skills (Multi-Select Chips) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300">Skills &amp; Frameworks</label>
                <span className="font-mono text-[10px] text-zinc-500">Selected ({selectedSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {['React', 'Python', 'PyTorch', 'Node.js', 'Figma', 'Rust', 'Go', 'Flutter', 'Solidity'].map(
                  (skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white text-black shadow-sm'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                        }`}
                      >
                        <span>{skill}</span>
                        {isSelected && <span className="material-symbols-outlined text-[13px]">check</span>}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Filter Group: Experience Level */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-zinc-300">Experience Tier</label>
              <div className="flex flex-col gap-1.5 mt-0.5">
                <label
                  onClick={() => setSelectedExp('Beginner')}
                  className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-colors ${
                    selectedExp === 'Beginner'
                      ? 'bg-zinc-900/80 border-zinc-600/70'
                      : 'bg-zinc-900/60 border-zinc-800/70 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="exp"
                      checked={selectedExp === 'Beginner'}
                      onChange={() => setSelectedExp('Beginner')}
                      className="w-3.5 h-3.5 accent-white cursor-pointer"
                    />
                    <span className="text-xs text-zinc-300">Beginner</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500">18</span>
                </label>

                <label
                  onClick={() => setSelectedExp('Intermediate')}
                  className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-colors ${
                    selectedExp === 'Intermediate'
                      ? 'bg-zinc-900/80 border-zinc-600/70'
                      : 'bg-zinc-900/60 border-zinc-800/70 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="exp"
                      checked={selectedExp === 'Intermediate'}
                      onChange={() => setSelectedExp('Intermediate')}
                      className="w-3.5 h-3.5 accent-white cursor-pointer"
                    />
                    <span className="text-xs text-white font-medium">Intermediate</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-400 font-medium">84</span>
                </label>

                <label
                  onClick={() => setSelectedExp('Advanced')}
                  className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-colors ${
                    selectedExp === 'Advanced'
                      ? 'bg-zinc-900/80 border-zinc-600/70'
                      : 'bg-zinc-900/60 border-zinc-800/70 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="exp"
                      checked={selectedExp === 'Advanced'}
                      onChange={() => setSelectedExp('Advanced')}
                      className="w-3.5 h-3.5 accent-white cursor-pointer"
                    />
                    <span className="text-xs text-zinc-300">Advanced (Winner Club)</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500">40</span>
                </label>
              </div>
            </div>

            {/* Filter Group: College / University Cluster */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-zinc-300">College / University</label>
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full bg-zinc-900/90 p-2.5 rounded-xl text-xs text-zinc-200 border border-zinc-800 focus:outline-none focus:border-zinc-500 cursor-pointer mt-0.5"
              >
                <option value="Any Affiliation">Any Affiliation</option>
                <option value="Top Hackathon Schools (Tier 1)">Top Hackathon Schools (Tier 1)</option>
                <option value="UC System (Berkeley, UCLA, UCSD)">UC System (Berkeley, UCLA, UCSD)</option>
                <option value="Ivy League + MIT/Stanford">Ivy League + MIT/Stanford</option>
                <option value="Any Affiliation">Any Affiliation</option>
              </select>
            </div>

            {/* Filter Group: Preferred Track */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-zinc-300">Preferred Track</label>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {['Any Interest', 'Generative AI', 'FinTech', 'HealthTech', 'ClimateTech', 'Web3', 'EdTech'].map((track) => {
                  const isTrackActive = selectedTrack === track;
                  return (
                    <button
                      key={track}
                      onClick={() => setSelectedTrack(track)}
                      className={`px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-colors flex items-center gap-1 ${
                        isTrackActive
                          ? 'bg-white text-black border border-white font-medium'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <span>{track}</span>
                      {isTrackActive && <span className="material-symbols-outlined text-[13px]">check</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Group: Past Hackathon Experience Count */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-zinc-300">Past Hackathons</label>
              <div className="grid grid-cols-3 gap-1.5 mt-0.5 text-center font-mono text-xs">
                {['Any', '1 - 2', '3 - 5', '6+'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setPastHackathons(range)}
                    className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                      pastHackathons === range
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Action CTA */}
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-1 py-2.5 bg-white hover:bg-zinc-200 text-black font-medium text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Apply Filters ({filteredDevelopers.length} matches)</span>
            </button>
          </aside>

          {/* Developer Cards Grid Area (Right Column - 8 Cols) */}
          <div className="flex flex-col lg:col-span-8 gap-5">
            {/* UX Tip / Helper Alert Box */}
            {showTip && (
              <div className="flex items-start gap-3 p-3.5 bg-[#0a0a0e] border border-white/[0.08] rounded-2xl">
                <span className="material-symbols-outlined text-zinc-400 text-[20px] mt-0.5">
                  tips_and_updates
                </span>
                <div className="flex-1">
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    <strong className="text-white font-medium">Pro tip:</strong> Looking for a specific technical stack? Use quotes like{' '}
                    <span className="font-mono text-[11px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-200">
                      &quot;FastAPI&quot;
                    </span>{' '}
                    or combine tags with{' '}
                    <span className="font-mono text-[11px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-200">
                      +
                    </span>{' '}
                    to compute strict intersection compatibility.
                  </p>
                </div>
                <button
                  onClick={() => setShowTip(false)}
                  className="text-zinc-500 hover:text-zinc-300 text-[16px] cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}

            {isLoading && <div className="rounded-2xl bg-[#0c0d12] p-8 text-center text-sm text-zinc-400" role="status">Loading developer profiles...</div>}
            {error && (
              <div className="rounded-2xl border border-red-900/60 bg-[#0c0d12] p-8 text-center" role="alert">
                <h3 className="text-sm font-medium text-red-300">Unable to load developer profiles</h3>
                <p className="mt-2 break-words text-xs text-zinc-400">{error}</p>
              </div>
            )}

            {/* Candidate Cards */}
            {!isLoading && !error && displayedDevelopers.map((dev) => (
              <article
                key={dev.id}
                className="bg-[#0c0d12] rounded-2xl p-5 border border-white/[0.08] hover:border-zinc-700 transition-all flex flex-col gap-4 shadow-sm group"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <AnimalAvatar profileId={dev.id} name={dev.name} className="h-14 w-14 text-3xl ring-1 ring-white/10" />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-black ${
                          dev.isOnline ? 'bg-emerald-500' : 'bg-zinc-500'
                        }`}
                      ></span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base text-white font-semibold tracking-tight">{dev.name}</h3>
                        <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-400">
                          {dev.university.split(' ')[0]} {dev.classYear || ''}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[14px] text-zinc-500">location_on</span>
                        {dev.university}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-xs">
                        <span className="inline-flex items-center gap-1 text-zinc-300 font-medium">
                          <span className="material-symbols-outlined text-[13px] text-zinc-400">
                            {dev.experienceLevel === 'Advanced' ? 'emoji_events' : 'military_tech'}
                          </span>
                          {dev.experienceLevel}{dev.hackathonExperience ? ` • ${dev.hackathonExperience}` : ''}
                        </span>
                        {dev.seekingRoles && (
                          <>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-400">
                              Seeking: <strong className="text-zinc-200 font-medium">{dev.seekingRoles}</strong>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Score Pill */}
                  <div className="self-start sm:self-auto flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 font-mono text-xs">
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                    <span className="font-semibold">{dev.matchScore}%</span>
                    <span className="text-[10px] uppercase tracking-wide">Compatibility</span>
                  </div>
                </div>

                {/* Bio Paragraph */}
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">{dev.bio}</p>

                {/* Compatibility Breakdown Highlight Sub-Panel */}
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-emerald-400 text-[18px] mt-0.5">check_circle</span>
                  <p className="text-xs text-zinc-400 leading-normal">
                    <strong className="text-zinc-200 font-medium">Compatibility: </strong>
                    This simple estimate compares profile skills, interests, experience, and preferred role.
                  </p>
                </div>

                {/* Skills and Interests Chips Shelves */}
                <div className="flex flex-col gap-2 pt-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest w-14">Stack:</span>
                    {dev.topSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono text-[11px]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest w-14">Interests:</span>
                    {(dev.interests || []).map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-0.5 rounded-md bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400"
                      >
                        {interest}
                      </span>
                    ))}
                    {(dev.interests || []).length === 0 && <span className="text-xs text-zinc-500">No interests listed</span>}
                  </div>
                </div>

                {/* Card Footprint & Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                    {dev.weeklyHours > 0 && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {dev.weeklyHours} hrs/wk</span>}
                    {dev.reposCount && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">terminal</span> {dev.reposCount} repos
                        </span>
                      </>
                    )}
                    {dev.prCount && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">code</span> {dev.prCount}+ GitHub PRs
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDeveloper(dev)}
                      className="px-3.5 py-1.5 rounded-full bg-transparent hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 hover:border-zinc-500 text-xs font-medium transition-all cursor-pointer"
                    >
                      View Profile
                    </button>
                    {(() => {
                      const status = dev.connectionStatus || 'none';
                      const action = status === 'incoming-pending' ? 'accept'
                        : status === 'outgoing-pending' || status === 'requested' ? 'cancel' : 'connect';
                      const requestPending = pendingActionIds.includes(dev.connectionRequestId || dev.id);
                      const label = status === 'connected' ? 'Connected'
                        : status === 'incoming-pending' ? 'Accept'
                        : action === 'cancel' ? 'Cancel' : isAuthenticated ? 'Connect' : 'Sign in to connect';
                      return <>
                        {status === 'incoming-pending' && <button disabled={requestPending} onClick={() => onConnectionAction(dev.id, 'reject', dev.connectionRequestId)} className="px-3 py-1.5 rounded-full text-xs text-zinc-300 border border-zinc-700 disabled:opacity-50" type="button">Reject</button>}
                        {(status === 'outgoing-pending' || status === 'requested') && <span className="px-2 py-1.5 font-mono text-[11px] text-zinc-400">Pending</span>}
                        <button
                          disabled={requestPending || status === 'connected'}
                          onClick={() => onConnectionAction(dev.id, action, dev.connectionRequestId)}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${status === 'outgoing-pending' || status === 'requested' || status === 'connected' ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30' : 'bg-white hover:bg-zinc-200 text-black'}`}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">{requestPending ? 'hourglass_top' : status === 'connected' || action === 'accept' ? 'check' : action === 'cancel' ? 'schedule' : 'person_add'}</span>
                          <span>{requestPending ? 'Saving...' : label}</span>
                        </button>
                      </>;
                    })()}
                  </div>
                </div>
              </article>
            ))}

            {!isLoading && !error && displayedDevelopers.length === 0 && (
              <div className="bg-[#0c0d12] rounded-2xl p-12 border border-white/[0.08] text-center flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-zinc-500 text-4xl mb-3">search_off</span>
                <h3 className="text-base text-white font-medium">No developers match your current filters</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                  Try broadening your skill selections, clearing the search query, or resetting filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-white text-black text-xs font-semibold rounded-full hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination / Infinite Scroll Bar Indicator */}
            {displayedDevelopers.length > 0 && (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#0a0a0e] rounded-2xl border border-white/[0.08] mt-2">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <p className="text-zinc-400">
                    Showing <strong className="text-white font-semibold">{displayedDevelopers.length}</strong> of{' '}
                    <strong className="text-white font-semibold">{filteredDevelopers.length}</strong> matching profiles
                  </p>
                </div>
                {visibleCount < filteredDevelopers.length && (
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 3)}
                    className="w-full sm:w-auto px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                    <span>Load More Developers</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
