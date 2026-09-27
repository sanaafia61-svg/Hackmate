import React, { useState } from 'react';
import { NeuralShaderBackground } from './NeuralShaderBackground';

interface LandingPageProps {
  onFindTeammates: () => void;
  onExploreDevelopers: () => void;
  onViewHackathons: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onFindTeammates,
  onExploreDevelopers,
  onViewHackathons
}) => {
  const [discordSynced, setDiscordSynced] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'tracks' | 'languages'>('all');

  return (
    <div className="w-full pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-12 sm:gap-20">
      {/* Cinematic Framed Hero Section with WebGL Shader Background */}
      <section className="relative w-full rounded-3xl border border-white/10 bg-[#09090b]/80 overflow-hidden px-6 py-16 sm:py-24 md:py-28 text-center flex flex-col items-center justify-center shadow-2xl">
        {/* Neural Network Wireframe WebGL Shader Background */}
        <NeuralShaderBackground className="absolute inset-0 w-full h-full pointer-events-none opacity-40" opacity={0.4} />

        {/* Vignette and subtle glow overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900/90 border border-white/10 shadow-inner mb-6 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-mono text-xs text-zinc-300 font-medium tracking-wide">
              Over 12,000+ hackathon builders connected across 450+ colleges
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white mb-6 leading-[1.1]">
            Find your people.<br />
            <span className="text-zinc-400">Build something amazing.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-xl mx-auto mb-8 font-normal leading-relaxed">
            Discover developers with complementary skills, connect with potential teammates, and build your next hackathon project together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12">
            <button
              onClick={onFindTeammates}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-medium text-xs sm:text-sm hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-lg shadow-white/5 cursor-pointer font-sans"
            >
              <span>Find Your HackMate</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={onExploreDevelopers}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5 font-medium text-xs sm:text-sm transition-all cursor-pointer font-sans"
            >
              <span className="material-symbols-outlined text-[16px] text-zinc-400">search</span>
              <span>Explore Developers</span>
            </button>
          </div>

          {/* Tech Stack Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-white/10 w-full max-w-xl">
            <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest mr-2">Built for developers</span>
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-white/5 font-mono text-[11px] text-zinc-400">React</span>
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-white/5 font-mono text-[11px] text-zinc-400">Next.js</span>
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-white/5 font-mono text-[11px] text-zinc-400">Python</span>
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-white/5 font-mono text-[11px] text-zinc-400">Node.js</span>
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-white/5 font-mono text-[11px] text-zinc-400">Figma</span>
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-white/5 font-mono text-[11px] text-zinc-400">GitHub</span>
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-white/5 font-mono text-[11px] text-zinc-400">AI</span>
          </div>
        </div>

        {/* Stats Strip inside Hero bottom frame */}
        <div className="relative z-10 w-full max-w-4xl mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-black/60 border border-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
            <p className="font-mono text-2xl font-semibold text-white tracking-tight">98.4%</p>
            <p className="text-xs text-zinc-400 mt-0.5">Submission Rate</p>
          </div>
          <div className="bg-black/60 border border-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
            <p className="font-mono text-2xl font-semibold text-white tracking-tight">&lt; 14 hrs</p>
            <p className="text-xs text-zinc-400 mt-0.5">Avg. Team Match</p>
          </div>
          <div className="bg-black/60 border border-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
            <p className="font-mono text-2xl font-semibold text-white tracking-tight">$1.8M+</p>
            <p className="text-xs text-zinc-400 mt-0.5">Prizes Won &lsquo;24</p>
          </div>
        </div>
      </section>

      {/* HOW HACKMATE WORKS SECTION */}
      <section className="w-full" id="how-it-works">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">Simple &amp; Fast</span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mt-1 mb-2 tracking-tight">How HackMate Works</h2>
          <p className="text-sm text-zinc-400">Form your dream team in 3 simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="group relative flex flex-col bg-[#0d0e12] rounded-2xl p-6 sm:p-7 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">badge</span>
              </div>
              <span className="font-mono text-xs font-semibold text-zinc-500">01</span>
            </div>
            <h3 className="text-base font-medium text-white mb-2">Create your profile</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
              Tell us your skills, interests, experience, and what kind of teammate you&apos;re looking for. Sync your GitHub in seconds.
            </p>
            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Under 2 minutes</span>
              <span className="material-symbols-outlined text-[16px] text-zinc-300">check_circle</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group relative flex flex-col bg-[#0d0e12] rounded-2xl p-6 sm:p-7 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">troubleshoot</span>
              </div>
              <span className="font-mono text-xs font-semibold text-zinc-500">02</span>
            </div>
            <h3 className="text-base font-medium text-white mb-2">Discover your matches</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
              Explore developers whose skills and interests complement yours with real-time synergy ratings and track alignments.
            </p>
            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>AI compatibility engine</span>
              <span className="material-symbols-outlined text-[16px] text-emerald-400">auto_awesome</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group relative flex flex-col bg-[#0d0e12] rounded-2xl p-6 sm:p-7 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
              <span className="font-mono text-xs font-semibold text-zinc-500">03</span>
            </div>
            <h3 className="text-base font-medium text-white mb-2">Build your team</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
              Connect with people and start building together. Share project scopes, initiate direct chats, and ship winning prototypes.
            </p>
            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Instant Discord handshake</span>
              <span className="material-symbols-outlined text-[16px] text-zinc-300">bolt</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS SECTION */}
      <section className="w-full" id="features">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">Built for Builders</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-1">
              Engineering high-synergy hackathon squads
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            Zero friction discovery designed specifically for high-velocity competitive product sprints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Feature 1: Smart Matching */}
          <div className="bg-[#0d0e12] rounded-2xl p-6 sm:p-8 border border-zinc-800/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white mb-5">
                <span className="material-symbols-outlined text-[20px]">psychology</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Smart Matching</h3>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                Our algorithm evaluates complementary skill overlaps, timezone compatibility, and hackathon domain interests to maximize team output.
              </p>
            </div>
            <div className="bg-black/60 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-300 font-medium">Full-Stack + AI Synergy Score</span>
                <span className="font-mono text-xs text-emerald-400 px-2 py-0.5 rounded border border-emerald-950 bg-emerald-950/40">
                  96.8% MATCH
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-zinc-200 rounded-full" style={{ width: '96.8%' }}></div>
              </div>
              <div className="flex items-center justify-between mt-2.5 font-mono text-[11px] text-zinc-500">
                <span>Timezone Delta: 0 hrs</span>
                <span>Hardware + API Track</span>
              </div>
            </div>
          </div>

          {/* Feature 2: Developer Profiles */}
          <div className="bg-[#0d0e12] rounded-2xl p-6 sm:p-8 border border-zinc-800/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white mb-5">
                <span className="material-symbols-outlined text-[20px]">folder_shared</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Developer Profiles</h3>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                Rich builder resumes showing GitHub repos, past hackathon trophies, verified tech stacks, and peer team reviews from previous sprints.
              </p>
            </div>
            <div className="bg-black/60 rounded-xl p-4 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-zinc-300 text-[22px]">emoji_events</span>
                <div>
                  <p className="text-xs font-medium text-white">3x First Place Finisher</p>
                  <p className="text-[11px] text-zinc-400 font-mono">TreeHacks • CalHacks • PennApps</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-zinc-900 border border-white/10 text-zinc-300 rounded font-mono text-[10px]">
                Verified
              </span>
            </div>
          </div>

          {/* Feature 3: Skill Discovery */}
          <div className="bg-[#0d0e12] rounded-2xl p-6 sm:p-8 border border-zinc-800/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white mb-5">
                <span className="material-symbols-outlined text-[20px]">filter_alt</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Skill Discovery</h3>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                Filter by 50+ languages, frameworks, AI/ML tools, and design disciplines to fill exactly what your project needs.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-white text-black font-mono text-xs font-medium">Rust</span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-white/10 text-zinc-300 font-mono text-xs">LangChain</span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-white/10 text-zinc-300 font-mono text-xs">SwiftUI</span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-white/10 text-zinc-300 font-mono text-xs">Solidity</span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-white/10 text-zinc-300 font-mono text-xs">WebRTC</span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-900/60 border border-white/5 text-zinc-500 font-mono text-xs">+45 more</span>
            </div>
          </div>

          {/* Feature 4: Easy Connections */}
          <div className="bg-[#0d0e12] rounded-2xl p-6 sm:p-8 border border-zinc-800/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white mb-5">
                <span className="material-symbols-outlined text-[20px]">forum</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Easy Connections</h3>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                Instant chat requests, team invites, and frictionless Discord integration so you can transition from match to sprint without delay.
              </p>
            </div>
            <div className="bg-black/60 rounded-xl p-4 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${discordSynced ? 'bg-emerald-400' : 'bg-emerald-400 animate-pulse'}`}></span>
                <span className="text-xs text-zinc-300 font-mono">
                  {discordSynced ? 'Discord Handshake Verified' : 'Discord Server Synced'}
                </span>
              </div>
              <button
                onClick={() => setDiscordSynced(!discordSynced)}
                type="button"
                className={`px-3 py-1 rounded-full font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                  discordSynced
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/40'
                    : 'bg-white text-black hover:bg-zinc-200'
                }`}
              >
                {discordSynced ? 'Synced ✓' : 'Accept Invite'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING SPRINT HUBS */}
      <section className="w-full">
        <div className="bg-[#0d0e12] rounded-2xl p-6 sm:p-7 border border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-medium text-white">
                Assembling for CalHacks, HackMIT &amp; TreeHacks?
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400">
                Over 240+ squads currently recruiting builders for upcoming collegiate deadlines.
              </p>
            </div>
          </div>
          <button
            onClick={onViewHackathons}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white hover:text-zinc-300 transition-colors shrink-0 cursor-pointer"
          >
            <span>View Active Hackathons</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="w-full">
        <div className="relative bg-[#09090b] rounded-3xl p-8 sm:p-14 border border-white/10 overflow-hidden text-center flex flex-col items-center justify-center">
          {/* Subtle noise background accent */}
          <div className="absolute inset-0 bg-radial from-white/5 via-transparent to-transparent pointer-events-none"></div>

          <span className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 font-mono text-[11px] uppercase tracking-wider mb-5">
            Next Cohort Starting Now
          </span>

          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight max-w-xl mb-4">
            Ready to find your HackMate?
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mb-8 leading-relaxed">
            Join thousands of builders assembling winning teams for CalHacks, HackMIT, TreeHacks, and global online jams.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <button
              onClick={onFindTeammates}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all active:scale-[0.98] cursor-pointer"
              type="button"
            >
              Get Started
            </button>
            <button
              onClick={onExploreDevelopers}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5 font-medium text-sm transition-colors cursor-pointer"
              type="button"
            >
              Browse Public Teams
            </button>
          </div>

          <p className="text-xs text-zinc-500 font-mono">
            Free for students &amp; builders. No credit card required.
          </p>
        </div>
      </section>
    </div>
  );
};
