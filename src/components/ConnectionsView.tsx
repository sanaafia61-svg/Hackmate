import React, { useState } from 'react';
import type { Connection, ConnectionAction, ConnectionRequestRecord, Developer } from '../types';

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
  <article className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-800/80 bg-[#0c0d12] p-4">
    <div className="flex min-w-0 items-center gap-3">
      <img src={developer.avatar || undefined} alt="" className="h-11 w-11 shrink-0 rounded-full border border-zinc-700/60 object-cover" />
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-white">{developer.name}</h3>
        <p className="truncate text-xs text-zinc-400">{developer.university}</p>
        <p className="mt-0.5 truncate text-[11px] text-zinc-500">{developer.seekingRoles || developer.experienceLevel}</p>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => onViewDeveloper(developer)} className="rounded-full border border-zinc-700/80 px-3.5 py-1.5 text-xs text-zinc-300 hover:border-zinc-500 hover:text-white">View Profile</button>
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
  onViewDeveloper
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const visibleConnections = connections.filter((connection) =>
    `${connection.developer.name} ${connection.developer.university} ${connection.developer.allSkills.join(' ')}`
      .toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase())
  );

  const requestActions = (request: ConnectionRequestRecord, direction: 'incoming' | 'outgoing') => {
    const isPending = pendingActionIds.includes(request.id);
    if (direction === 'outgoing') {
      return <><span className="font-mono text-xs text-zinc-400">Pending</span><button disabled={isPending} type="button" onClick={() => onRequestAction(request.id, 'cancel')} className="rounded-full border border-zinc-700 px-4 py-1.5 text-xs text-zinc-200 disabled:opacity-50">{isPending ? 'Saving...' : 'Cancel'}</button></>;
    }
    return <>
      <button disabled={isPending} type="button" onClick={() => onRequestAction(request.id, 'reject')} className="rounded-full border border-zinc-700 px-4 py-1.5 text-xs text-zinc-200 disabled:opacity-50">Reject</button>
      <button disabled={isPending} type="button" onClick={() => onRequestAction(request.id, 'accept')} className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black disabled:opacity-50">{isPending ? 'Saving...' : 'Accept'}</button>
    </>;
  };

  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-7xl bg-background px-4 pb-16 pt-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 pt-4">
        <header className="border-b border-zinc-800/80 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>HackMate Network</span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Your Team Connections</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage accepted connections and team requests.</p>
        </header>

        {!isAuthenticated && <div className="rounded-2xl border border-zinc-800 bg-[#0c0d12] p-6 text-sm text-zinc-300">Sign in to view and manage your connections.</div>}
        {isAuthenticated && isLoading && <div className="rounded-2xl border border-zinc-800 bg-[#0c0d12] p-8 text-center text-sm text-zinc-400" role="status">Loading connections...</div>}
        {isAuthenticated && error && <div className="rounded-2xl border border-red-900/60 bg-[#0c0d12] p-6 text-sm text-red-300" role="alert">Unable to load connection requests. Run `supabase/connection_requests.sql` in the Supabase SQL Editor if the table has not been created. <span className="mt-2 block break-words text-xs text-zinc-400">{error}</span></div>}

        {isAuthenticated && !isLoading && !error && (
          <>
            <section className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Accepted Connections <span className="ml-1 font-mono text-xs text-zinc-400">{connections.length}</span></h2>
                  <p className="text-xs text-zinc-500">Open a profile to review their public information.</p>
                </div>
                <input value={searchFilter} onChange={(event) => setSearchFilter(event.target.value)} placeholder="Search connections..." className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none sm:max-w-xs" />
              </div>
              {visibleConnections.map((connection) => (
                <PersonSummary key={connection.id} developer={connection.developer} action={null} onViewDeveloper={onViewDeveloper} />
              ))}
              {connections.length === 0 && <p className="rounded-xl border border-zinc-800/70 bg-[#0c0d12] p-6 text-sm text-zinc-400">No accepted connections yet. Find a developer in Discover to send a request.</p>}
              {connections.length > 0 && visibleConnections.length === 0 && <p className="text-sm text-zinc-500">No connections match this search.</p>}
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-white">Incoming Requests <span className="ml-1 font-mono text-xs text-zinc-400">{incomingRequests.length}</span></h2>
              {incomingRequests.map((request) => <PersonSummary key={request.id} developer={request.developer} action={requestActions(request, 'incoming')} onViewDeveloper={onViewDeveloper} />)}
              {incomingRequests.length === 0 && <p className="rounded-xl border border-zinc-800/70 bg-[#0c0d12] p-5 text-sm text-zinc-500">No incoming requests.</p>}
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-white">Outgoing Requests <span className="ml-1 font-mono text-xs text-zinc-400">{outgoingRequests.length}</span></h2>
              {outgoingRequests.map((request) => <PersonSummary key={request.id} developer={request.developer} action={requestActions(request, 'outgoing')} onViewDeveloper={onViewDeveloper} />)}
              {outgoingRequests.length === 0 && <p className="rounded-xl border border-zinc-800/70 bg-[#0c0d12] p-5 text-sm text-zinc-500">No outgoing requests.</p>}
            </section>
          </>
        )}
      </div>
    </div>
  );
};