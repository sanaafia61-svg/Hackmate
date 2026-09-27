import React from 'react';
import { ConnectionAction, Developer, PendingRequest, Connection, UserProfile } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  matches: Developer[];
  pendingRequests: PendingRequest[];
  connections: Connection[];
  outgoingRequestCount: number;
  isAuthenticated: boolean;
  networkStatus: 'loading' | 'ready' | 'error';
  networkError: string | null;
  matchesLoading: boolean;
  matchesError: string | null;
  pendingActionIds: string[];
  onBrowseAll: () => void;
  onOpenMatchPreferences: () => void;
  onCompleteProfile: () => void;
  onViewDeveloper: (dev: Developer) => void;
  onConnectionAction: (devId: string, action: ConnectionAction, requestId?: string) => void;
  onAcceptRequest: (reqId: string) => void;
  onDeclineRequest: (reqId: string) => void;
  onViewConnectionProfile: (conn: Connection) => void;
  onManageConnections: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  matches,
  pendingRequests,
  connections,
  outgoingRequestCount,
  isAuthenticated,
  networkStatus,
  networkError,
  matchesLoading,
  matchesError,
  pendingActionIds,
  onBrowseAll,
  onOpenMatchPreferences,
  onCompleteProfile,
  onViewDeveloper,
  onConnectionAction,
  onAcceptRequest,
  onDeclineRequest,
  onViewConnectionProfile,
  onManageConnections
}) => {
  return (
    <div className="w-full pt-20 pb-16 bg-background min-h-[calc(100vh-64px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col w-full gap-8">
        {/* Top Welcome & Status Banner */}
        <section className="w-full pt-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800/90 text-zinc-300 font-mono text-[11px] tracking-wide mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="uppercase tracking-widest text-zinc-400">{isAuthenticated ? 'Your HackMate dashboard' : 'HackMate demo dashboard'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                Welcome back, {user.name} 👋
              </h1>
              <p className="text-sm text-zinc-400 mt-1.5 font-normal">
                Let&apos;s find your next teammate. There are{' '}
                <span className="text-zinc-100 font-medium underline underline-offset-4 decoration-emerald-500/50">
                  {matches.length} developer suggestions
                </span>{' '}
                tailored to your technical profile.
              </p>
            </div>
            <div className="flex items-center gap-2.5 self-start lg:self-auto">
              <button
                onClick={onOpenMatchPreferences}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs rounded-xl border border-zinc-800 transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Match Preferences</span>
              </button>
              <button
                onClick={onBrowseAll}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black hover:bg-zinc-200 font-mono text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">explore</span>
                <span>Browse All ({matches.length})</span>
              </button>
            </div>
          </div>
        </section>

        {/* Profile Completion Section */}
        <section className="w-full">
          <div className="relative overflow-hidden rounded-2xl bg-[#0c0d12] border border-zinc-800/80 p-6 sm:p-7 shadow-2xl">
            {/* Subtle Glow Accent */}
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>
            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1 max-w-3xl">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-white text-[20px]">verified_user</span>
                    <span className="text-base font-medium text-white tracking-tight">Profile Completion</span>
                  </div>
                  <span className="font-mono text-sm font-semibold text-emerald-400 tracking-wider">
                    {user.completionPercentage}%
                  </span>
                </div>
                {/* Sleek Progress Bar */}
                <div className="relative w-full h-1.5 bg-zinc-800/90 rounded-full overflow-hidden my-3">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-white rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${user.completionPercentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-xs mb-4">
                  <span className="material-symbols-outlined text-[15px] text-zinc-400">info</span>
                  <span>
                    {user.completionPercentage === 100
                      ? 'Your profile fields are complete.'
                      : 'Add more profile details to improve your profile completion.'}
                  </span>
                </div>
                {/* Verification / Readiness Checklist Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                    <span className="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span>
                    {user.skills.length > 0 ? `Skills Added (${user.skills.length})` : 'No skills added'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                    <span className="material-symbols-outlined text-[14px] text-emerald-400">school</span>
                    {user.university ? `College: ${user.university}` : 'College not added'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[11px]">
                    {user.interests.length} interests listed
                  </span>
                </div>
              </div>

              {/* Complete Profile Action */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-2 shrink-0">
                <button
                  onClick={onCompleteProfile}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-zinc-200 font-mono text-xs font-semibold rounded-full transition-all shadow-md group cursor-pointer"
                  type="button"
                >
                  <span>{user.completionPercentage === 100 ? 'Edit Profile' : 'Complete Profile'}</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </button>
                <span className="text-center lg:text-right font-mono text-[11px] text-zinc-400">
                  {user.completionPercentage === 100 ? 'Status: Max Synergy' : 'Takes ~2 mins to finish'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Top Matches Section */}
        <section className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-semibold text-white tracking-tight">Your Top Matches</h2>
                <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[11px]">
                  {matches.length} Recommended
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Sorted using a simple profile-based compatibility estimate.</p>
            </div>
            <div className="inline-flex items-center self-start sm:self-auto gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[11px]">
              <span className="material-symbols-outlined text-[14px] text-emerald-400">auto_awesome</span>
              <span>Sorted by Complementary Compatibility</span>
            </div>
          </div>

          {matchesLoading && <p className="text-sm text-zinc-400" role="status">Loading developer profiles...</p>}
          {matchesError && <p className="text-sm text-red-300" role="alert">Unable to load developer profiles: {matchesError}</p>}
          {!matchesLoading && !matchesError && matches.length === 0 && <p className="rounded-xl border border-zinc-800 bg-[#0c0d12] p-6 text-sm text-zinc-400">No other developer profiles are available yet.</p>}

          {/* 3 Match Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {!matchesLoading && !matchesError && matches.map((dev) => (
              <article
                key={dev.id}
                className="flex flex-col justify-between rounded-2xl bg-[#0c0d12] border border-zinc-800/80 p-5 hover:border-zinc-700 transition-all duration-200 group"
              >
                <div>
                  {/* Header: Avatar + Compatibility Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="relative">
                      <img
                        className="w-[52px] h-[52px] rounded-full object-cover border border-zinc-700/60"
                        alt={dev.name}
                        src={dev.avatar}
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#0c0d12] ${
                          dev.isOnline ? 'bg-emerald-400' : 'bg-zinc-500'
                        }`}
                        title={dev.statusText || (dev.isOnline ? 'Active now' : 'Offline')}
                      ></span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{dev.matchScore}% COMPATIBILITY</span>
                    </div>
                  </div>

                  {/* Identity */}
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-zinc-200 transition-colors">
                      {dev.name}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      {dev.university}
                    </p>
                  </div>

                  {/* Hackathon Experience Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[11px] mb-4">
                    <span className="material-symbols-outlined text-[13px] text-zinc-400">
                      {dev.experienceLevel === 'Advanced' ? 'emoji_events' : 'code_blocks'}
                    </span>
                    <span>
                      {dev.experienceLevel}{dev.hackathonExperience ? ` • ${dev.hackathonExperience}` : ''}
                    </span>
                  </div>

                  {/* Skills Shelf */}
                  <div className="mb-4">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 mb-2">Top Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      {dev.topSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 font-mono text-[11px] text-zinc-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Match Rationale Callout */}
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 mb-5">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[15px] text-zinc-300 shrink-0 mt-0.5">
                        {dev.matchReasonType === 'Shared Interest'
                          ? 'track_changes'
                          : dev.matchReasonType === 'Skill Complement'
                          ? 'draw'
                          : 'psychology'}
                      </span>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        <strong className="text-zinc-200 font-medium">{dev.matchReasonType}: </strong>
                        {dev.matchReasonText}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Connect (White Pill) + View Profile (Dark Border Pill) */}
                <div className="flex items-center gap-2 pt-2">
                  {dev.connectionStatus === 'incoming-pending' && <button onClick={() => onConnectionAction(dev.id, 'reject', dev.connectionRequestId)} type="button" className="rounded-full border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Reject</button>}
                  {dev.connectionStatus === 'outgoing-pending' && <span className="rounded-full border border-zinc-700 px-3 py-2 font-mono text-xs text-zinc-300">Pending</span>}
                  <button
                    disabled={pendingActionIds.includes(dev.connectionRequestId || dev.id) || dev.connectionStatus === 'connected'}
                    onClick={() => onConnectionAction(dev.id, dev.connectionStatus === 'incoming-pending' ? 'accept' : dev.connectionStatus === 'outgoing-pending' || dev.connectionStatus === 'requested' ? 'cancel' : 'connect', dev.connectionRequestId)}
                    className={`flex-1 py-2 px-3 rounded-full font-mono text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${dev.connectionStatus === 'connected' || dev.connectionStatus === 'outgoing-pending' ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30' : 'bg-white text-black hover:bg-zinc-200'}`}
                    type="button"
                  >
                    <span>{pendingActionIds.includes(dev.connectionRequestId || dev.id) ? 'Saving...' : dev.connectionStatus === 'connected' ? 'Connected' : dev.connectionStatus === 'incoming-pending' ? 'Accept' : dev.connectionStatus === 'outgoing-pending' || dev.connectionStatus === 'requested' ? 'Cancel' : isAuthenticated ? 'Connect' : 'Sign in to connect'}</span>
                  </button>
                  <button
                    onClick={() => onViewDeveloper(dev)}
                    className="px-3.5 py-2 rounded-full bg-transparent hover:bg-zinc-900 border border-zinc-700/80 text-zinc-300 hover:text-white font-mono text-xs transition-all cursor-pointer"
                    type="button"
                  >
                    View Profile
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Lower Split Grid: Pending Requests & Right Column */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Pending Requests (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-semibold text-white tracking-tight">Pending Requests</h2>
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-200 font-mono text-xs flex items-center justify-center font-medium">
                  {pendingRequests.filter((r) => r.status === 'pending').length}
                </span>
              </div>
              <span className="font-mono text-xs text-zinc-400">Incoming invitations</span>
            </div>

            {networkStatus === 'loading' && <p className="text-sm text-zinc-400" role="status">Loading requests...</p>}
            {networkStatus === 'error' && <p className="text-xs text-red-300" role="alert">Unable to load connection requests. Run `supabase/connection_requests.sql` in the Supabase SQL Editor if needed. {networkError}</p>}
            {networkStatus === 'ready' && pendingRequests
              .filter((r) => r.status === 'pending')
              .map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl bg-[#0c0d12] border border-zinc-800/80 p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      className="w-12 h-12 rounded-full object-cover shrink-0 border border-zinc-700/60 mt-0.5"
                      alt={req.developer.name}
                      src={req.developer.avatar}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white tracking-tight">{req.developer.name}</h4>
                        <span className="font-mono text-xs text-zinc-400">• {req.developer.university}</span>
                      </div>
                      <p className="text-xs text-zinc-300 font-medium mb-1.5">{req.category}</p>
                      <p className="text-xs text-zinc-400 bg-zinc-900/70 border border-zinc-800/60 p-2.5 rounded-lg italic">
                        {req.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center w-full sm:w-auto justify-end gap-2 shrink-0 pt-1 sm:pt-0">
                    <button
                      onClick={() => onAcceptRequest(req.id)}
                      className="flex-1 sm:w-24 py-1.5 px-3 rounded-full bg-white text-black hover:bg-zinc-200 font-mono text-xs font-semibold transition-all text-center cursor-pointer"
                      type="button"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onDeclineRequest(req.id)}
                      className="flex-1 sm:w-24 py-1.5 px-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 font-mono text-xs transition-all text-center cursor-pointer"
                      type="button"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}

            {networkStatus === 'ready' && pendingRequests.filter((r) => r.status === 'pending').length === 0 && (
              <div className="rounded-2xl bg-[#0c0d12] border border-zinc-800/60 p-8 text-center flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-zinc-500 text-3xl mb-2">inbox</span>
                <p className="text-sm text-zinc-300 font-medium">All caught up!</p>
                <p className="text-xs text-zinc-500 mt-1">No pending invitations. Explore developers to form your squad.</p>
              </div>
            )}

            {/* Status Indicator Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[16px]">done_all</span>
                <span className="text-xs text-zinc-400">
                  {pendingRequests.filter((r) => r.status === 'pending').length === 0
                    ? 'All incoming invitations resolved. You are visible to prospective teams.'
                    : 'Invitations pending your response. You are visible to prospective teams.'}
                </span>
              </div>
              <button
                onClick={onOpenMatchPreferences}
                className="font-mono text-xs text-zinc-300 hover:text-white hover:underline transition-colors cursor-pointer"
                type="button"
              >
                Settings
              </button>
            </div>
          </div>

          {/* Right Column: Hackathon Countdown & Active Connections (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-2xl bg-[#0c0d12] border border-zinc-800/80 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-white tracking-tight">Network Snapshot</h3>
              <p className="text-xs text-zinc-400 mt-1 mb-4">Current connection activity for your account.</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-black/40 border border-zinc-800/70 p-3">
                  <div className="font-mono text-xl font-semibold text-white">{networkStatus === 'ready' ? connections.length : networkStatus === 'loading' ? '...' : '—'}</div>
                  <div className="font-mono text-[10px] uppercase text-zinc-400">Connected</div>
                </div>
                <div className="rounded-xl bg-black/40 border border-zinc-800/70 p-3">
                  <div className="font-mono text-xl font-semibold text-white">{networkStatus === 'ready' ? pendingRequests.filter((request) => request.status === 'pending').length : networkStatus === 'loading' ? '...' : '—'}</div>
                  <div className="font-mono text-[10px] uppercase text-zinc-400">Incoming</div>
                </div>
                <div className="rounded-xl bg-black/40 border border-zinc-800/70 p-3">
                  <div className="font-mono text-xl font-semibold text-white">{networkStatus === 'ready' ? outgoingRequestCount : networkStatus === 'loading' ? '...' : '—'}</div>
                  <div className="font-mono text-[10px] uppercase text-zinc-400">Outgoing</div>
                </div>
              </div>
            </div>

            {/* Your Active Network Module */}
            <div className="rounded-2xl bg-[#0c0d12] border border-zinc-800/80 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight">Your Connections</h3>
                  <p className="text-xs text-zinc-400">Vetted teammates in your circle</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-400">
                  {networkStatus === 'ready' ? `${connections.length} Total` : networkStatus === 'loading' ? 'Loading' : 'Unavailable'}
                </span>
              </div>

              {/* Connections List */}
              <div className="flex flex-col gap-2 mb-4">
                {connections.slice(0, 3).map((conn) => (
                  <div
                    key={conn.id}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className="w-9 h-9 rounded-full object-cover border border-zinc-700/60"
                        alt={conn.developer.name}
                        src={conn.developer.avatar}
                      />
                      <div>
                        <p className="text-xs font-semibold text-white">{conn.developer.name}</p>
                        <p className="text-[11px] text-zinc-400">{conn.status}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onViewConnectionProfile(conn)}
                      aria-label={`View ${conn.developer.name}'s profile`}
                      className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[17px]">account_circle</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Manage All Connections Link Button */}
              <button
                onClick={onManageConnections}
                className="w-full py-2.5 px-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-mono text-xs font-medium transition-all flex items-center justify-center gap-2 group cursor-pointer"
                type="button"
              >
                <span>Manage All {connections.length} Connections</span>
                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
