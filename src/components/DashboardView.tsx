import React from 'react';
import { ArrowRight, BriefcaseBusiness, Check, Sparkles, Users } from 'lucide-react';
import { ConnectionAction, Developer, PendingRequest, Connection, UserProfile } from '../types';
import { AnimalAvatar } from './AnimalAvatar';

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
  onManageConnections,
}) => {
  const remainingDetails = Math.max(0, 2 - Number(Boolean(user.university)) - Number(Boolean(user.skills.length > 0)));
  const incomingPendingCount = pendingRequests.filter((request) => request.status === 'pending').length;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {isAuthenticated ? 'Home' : 'Demo'}
              </p>
              <h1 className="mt-1 text-[1.7rem] font-semibold tracking-[-0.05em] text-slate-900 sm:text-[2rem]">
                Hey, {user.name.split(' ')[0] || 'builder'}
              </h1>
            </div>

            <button
              type="button"
              onClick={onBrowseAll}
              className="hidden rounded-full bg-slate-900 px-3 py-2 text-xs font-medium text-white md:inline-flex"
            >
              Browse all
            </button>
          </div>

          <p className="mt-2 text-sm text-slate-500">Find teammates that fit your skills.</p>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <AnimalAvatar profileId={user.name} name={user.name} className="h-10 w-10 border border-slate-200 text-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Profile</p>
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
              </div>
            </div>
            <button type="button" onClick={onCompleteProfile} className="text-sm font-medium text-slate-700">
              View profile
            </button>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Profile</p>
              <h2 className="mt-1 text-base font-semibold text-slate-900">Profile energy</h2>
            </div>
            <span className="text-sm font-medium text-slate-700">{user.completionPercentage}%</span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${user.completionPercentage}%` }} />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 text-sm text-slate-600">
            <span>{remainingDetails > 0 ? `Add ${remainingDetails} more detail${remainingDetails > 1 ? 's' : ''}` : 'Profile looks strong'}</span>
            <button type="button" onClick={onCompleteProfile} className="inline-flex items-center gap-1 text-sm font-medium text-slate-900">
              Update
              <ArrowRight size={15} />
            </button>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Recommended</p>
              <h2 className="mt-1 text-base font-semibold text-slate-900">Top matches</h2>
            </div>
            <button type="button" onClick={onBrowseAll} className="text-sm font-medium text-slate-700">
              See all
            </button>
          </div>

          {networkStatus === 'loading' && <p className="text-sm text-slate-500" role="status">Loading developer profiles...</p>}
          {networkStatus === 'error' && <p className="text-sm text-red-600" role="alert">Unable to load developer profiles: {networkError}</p>}
          {matchesLoading && <p className="text-sm text-slate-500" role="status">Loading developer profiles...</p>}
          {matchesError && <p className="text-sm text-red-600" role="alert">Unable to load developer profiles: {matchesError}</p>}
          {!matchesLoading && !matchesError && matches.length === 0 && (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No other developer profiles are available yet.</p>
          )}

          {!matchesLoading && !matchesError && matches.slice(0, 3).map((dev) => (
            <article key={dev.id} className="mt-3 rounded-[22px] border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <AnimalAvatar profileId={dev.id} name={dev.name} className="h-12 w-12 border border-slate-200 text-xl" />
                  <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-slate-50 ${
                      dev.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                    title={dev.statusText || (dev.isOnline ? 'Active now' : 'Offline')}
                  />
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

                  <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    {dev.isOnline ? 'Available' : 'Recently active'}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {dev.topSkills.slice(0, 3).map((skill) => (
                  <span key={skill} className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-[11px] text-slate-500">
                  Looking for: <span className="text-slate-700">{dev.lookingFor || dev.seekingRoles || 'Frontend teammate'}</span>
                </p>
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
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                >
                  View
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Quick actions</p>
              <h2 className="mt-1 text-base font-semibold text-slate-900">Jump in</h2>
            </div>
            {incomingPendingCount > 0 && (
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                {incomingPendingCount} pending
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={onBrowseAll} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left">
              <Sparkles size={16} className="mb-2 text-slate-900" />
              <div className="text-sm font-medium text-slate-900">Browse all</div>
              <div className="text-xs text-slate-500">{matches.length} profiles</div>
            </button>
            <button type="button" onClick={onOpenMatchPreferences} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left">
              <BriefcaseBusiness size={16} className="mb-2 text-slate-900" />
              <div className="text-sm font-medium text-slate-900">Match prefs</div>
              <div className="text-xs text-slate-500">Tune results</div>
            </button>
            <button type="button" onClick={onManageConnections} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left">
              <Users size={16} className="mb-2 text-slate-900" />
              <div className="text-sm font-medium text-slate-900">Connections</div>
              <div className="text-xs text-slate-500">{connections.length} connected</div>
            </button>
            <button type="button" onClick={onCompleteProfile} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left">
              <Check size={16} className="mb-2 text-slate-900" />
              <div className="text-sm font-medium text-slate-900">Profile</div>
              <div className="text-xs text-slate-500">{user.completionPercentage}% complete</div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};