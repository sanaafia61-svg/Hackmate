import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { Connection, ConnectionAction, ConnectionRequestRecord, Developer } from '../types';
import { AnimalAvatar } from './AnimalAvatar';

interface ConnectionsViewProps {
  connections: Connection[];
  incomingRequests: ConnectionRequestRecord[];
  outgoingRequests: ConnectionRequestRecord[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  pendingActionIds: string[];
  onRequestAction: (requestId: string, action: ConnectionAction) => void;
  onViewDeveloper: (developer: Developer) => void;
}

const PersonSummary: React.FC<{ developer: Developer; action: React.ReactNode; onViewDeveloper: (developer: Developer) => void }> = ({ developer, action, onViewDeveloper }) => (
  <article className="flex items-center justify-between gap-3 rounded-[22px] border border-slate-200 bg-white p-3 shadow-[0_10px_20px_rgba(15,23,42,0.02)]">
    <div className="flex min-w-0 items-center gap-3">
      <AnimalAvatar profileId={developer.id} name={developer.name} className="h-11 w-11 shrink-0 border border-slate-200 text-xl" />
      <div className="min-w-0">
        <h3 className="truncate text-[15px] font-semibold text-slate-900">{developer.name}</h3>
        <p className="truncate text-xs text-slate-500">{developer.university}</p>
        <p className="mt-0.5 truncate text-[11px] text-slate-400">{developer.seekingRoles || developer.experienceLevel}</p>
      </div>
    </div>
    <div className="flex flex-shrink-0 items-center gap-2">
      <button type="button" onClick={() => onViewDeveloper(developer)} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700">View</button>
      {action}
    </div>
  </article>
);

export const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  connections,
  incomingRequests,
  outgoingRequests,
  isLoading,
  error,
  isAuthenticated,
  pendingActionIds,
  onRequestAction,
  onViewDeveloper,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'connections' | 'requests'>('connections');

  const visibleConnections = connections.filter((connection) =>
    `${connection.developer.name} ${connection.developer.university} ${connection.developer.allSkills.join(' ')}`
      .toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase())
  );

  const requestActions = (request: ConnectionRequestRecord, direction: 'incoming' | 'outgoing') => {
    const isPending = pendingActionIds.includes(request.id);
    if (direction === 'outgoing') {
      return (
        <button
          disabled={isPending}
          type="button"
          onClick={() => onRequestAction(request.id, 'cancel')}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Cancel'}
        </button>
      );
    }
    return (
      <div className="flex gap-2">
        <button
          disabled={isPending}
          type="button"
          onClick={() => onRequestAction(request.id, 'reject')}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 disabled:opacity-50"
        >
          Decline
        </button>
        <button
          disabled={isPending}
          type="button"
          onClick={() => onRequestAction(request.id, 'accept')}
          className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Accept'}
        </button>
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <header className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Network</p>
          <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-slate-900">Connections</h1>
        </header>

        <section className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <label htmlFor="connectionSearch" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Search connections
          </label>
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="connectionSearch"
              value={searchFilter}
              onChange={(event) => setSearchFilter(event.target.value)}
              placeholder="Search by name or skill"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
            />
          </div>
        </section>

        {!isAuthenticated && (
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-sm text-slate-600">Sign in to view and manage your connections.</div>
        )}

        {isAuthenticated && isLoading && (
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-sm text-slate-500" role="status">Loading connections...</div>
        )}
        {isAuthenticated && error && (
          <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-sm text-red-700" role="alert">
            Unable to load connection requests. Run the Supabase SQL setup first.
          </div>
        )}

        {isAuthenticated && !isLoading && !error && (
          <>
            <div className="rounded-[22px] border border-slate-200 bg-white p-1 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('connections')}
                  className={`rounded-[18px] px-3 py-2 text-sm font-medium ${
                    activeTab === 'connections' ? 'bg-slate-900 text-white' : 'text-slate-600'
                  }`}
                >
                  Connections {connections.length}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('requests')}
                  className={`rounded-[18px] px-3 py-2 text-sm font-medium ${
                    activeTab === 'requests' ? 'bg-slate-900 text-white' : 'text-slate-600'
                  }`}
                >
                  Requests {incomingRequests.length}
                </button>
              </div>
            </div>

            {activeTab === 'connections' && (
              <section className="space-y-3">
                {visibleConnections.map((connection) => (
                  <PersonSummary key={connection.id} developer={connection.developer} action={null} onViewDeveloper={onViewDeveloper} />
                ))}
                {connections.length === 0 && (
                  <p className="rounded-[22px] border border-slate-200 bg-white p-5 text-sm text-slate-500">
                    No accepted connections yet. Find developers in Discover to send a request.
                  </p>
                )}
                {connections.length > 0 && visibleConnections.length === 0 && (
                  <p className="text-sm text-slate-500">No connections match this search.</p>
                )}
              </section>
            )}

            {activeTab === 'requests' && (
              <section className="space-y-3">
                {incomingRequests.map((request) => (
                  <PersonSummary key={request.id} developer={request.developer} action={requestActions(request, 'incoming')} onViewDeveloper={onViewDeveloper} />
                ))}
                {incomingRequests.length === 0 && (
                  <p className="rounded-[22px] border border-slate-200 bg-white p-5 text-sm text-slate-500">No incoming requests right now.</p>
                )}

                {outgoingRequests.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Pending sent</p>
                    {outgoingRequests.map((request) => (
                      <PersonSummary key={request.id} developer={request.developer} action={requestActions(request, 'outgoing')} onViewDeveloper={onViewDeveloper} />
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};