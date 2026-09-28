/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { currentUser as defaultUser, initialDevelopers } from './data/mockData';
import { Developer, PendingRequest, Connection, ConnectionAction, ConnectionRequestRecord, ConnectionRequestStatus, UserProfile } from './types';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { DiscoverView } from './components/DiscoverView';
import { ConnectionsView } from './components/ConnectionsView';
import { ProfileView } from './components/ProfileView';
import { DeveloperDetailModal } from './components/DeveloperDetailModal';
import { ProfileModal } from './components/ProfileModal';
import { MatchPreferencesModal } from './components/MatchPreferencesModal';
import { Footer } from './components/Footer';
import { AuthModal, AuthMode } from './components/AuthModal';
import { supabase } from './lib/supabaseClient';
import { calculateCompatibility } from './lib/compatibility';
import { developerFromProfile, emptyProfile, profileCompletion, profileFromRow, profileToRow, publicProfileColumns, ProfileRow } from './lib/profileData';
import { loadConnectionRequests } from './lib/connectionRequests';

type ProfileStatus = 'loading' | 'ready' | 'error';
type RequestAction = ConnectionAction;

export default function App() {
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const authUserIdRef = useRef<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [currentView, setCurrentView] = useState<
    'landing' | 'dashboard' | 'discover' | 'connections' | 'profile'
  >('dashboard');

  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>('loading');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileRows, setProfileRows] = useState<ProfileRow[]>([]);
  const [developerStatus, setDeveloperStatus] = useState<ProfileStatus>('loading');
  const [developerError, setDeveloperError] = useState<string | null>(null);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequestRecord[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ProfileStatus>('ready');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [pendingActionIds, setPendingActionIds] = useState<string[]>([]);

  // Modals state
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let receivedAuthEvent = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      receivedAuthEvent = true;
      const nextAuthUser = session?.user ?? null;
      authUserIdRef.current = nextAuthUser?.id ?? null;
      setAuthUser(nextAuthUser);
      setAuthLoading(false);

      if (nextAuthUser) {
        setUser(emptyProfile(nextAuthUser));
      } else {
        setUser(defaultUser);
        setProfileStatus('ready');
        setProfileError(null);
        setProfileRows([]);
        setConnectionRequests([]);
        setDeveloperStatus('ready');
        setDeveloperError(null);
        setConnectionStatus('ready');
        setConnectionError(null);
        setPendingActionIds([]);
        setSelectedDeveloper(null);
        setIsProfileModalOpen(false);
      }
    });

    void supabase.auth.getSession()
      .then(({ data }) => {
        if (!receivedAuthEvent) {
          const sessionUser = data.session?.user ?? null;
          authUserIdRef.current = sessionUser?.id ?? null;
          setAuthUser(sessionUser);
          setAuthLoading(false);
        }
      })
      .catch(() => {
        if (!receivedAuthEvent) setAuthLoading(false);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authUser) return;

    let isCurrent = true;
    setProfileStatus('loading');
    setProfileError(null);
    setUser(emptyProfile(authUser));

    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(publicProfileColumns)
          .eq('id', authUser.id)
          .maybeSingle();
        if (error) throw error;

        let row = data as ProfileRow | null;
        if (!row) {
          const { data: insertedRow, error: insertError } = await supabase
            .from('profiles')
            .insert({ id: authUser.id, ...profileToRow(emptyProfile(authUser)) })
            .select(publicProfileColumns)
            .single();
          if (insertError) throw insertError;
          row = insertedRow as ProfileRow;
        }

        if (isCurrent) {
          const profile = profileFromRow(row, authUser);
          setUser({ ...profile, completionPercentage: profileCompletion(profile) });
          setProfileStatus('ready');
        }
      } catch (error) {
        if (isCurrent) {
          setUser(emptyProfile(authUser));
          setProfileError(error instanceof Error ? error.message : 'Please try again.');
          setProfileStatus('error');
        }
      }
    };

    void loadProfile();
    return () => {
      isCurrent = false;
    };
  }, [authUser]);

  useEffect(() => {
    if (!authUser) return;
    let isCurrent = true;
    setDeveloperStatus('loading');
    setDeveloperError(null);

    const loadDevelopers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(publicProfileColumns)
          .neq('id', authUser.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (!isCurrent) return;
        setProfileRows((data || []) as ProfileRow[]);
        setDeveloperStatus('ready');
      } catch (error) {
        if (!isCurrent) return;
        setDeveloperError(error instanceof Error ? error.message : 'Please try again.');
        setDeveloperStatus('error');
      }
    };
    void loadDevelopers();

    return () => { isCurrent = false; };
  }, [authUser]);

  useEffect(() => {
    if (!authUser) return;
    let isCurrent = true;
    setConnectionStatus('loading');
    setConnectionError(null);

    loadConnectionRequests(authUser.id)
      .then((records) => {
        if (!isCurrent) return;
        setConnectionRequests(records);
        setConnectionStatus('ready');
      })
      .catch((error: unknown) => {
        if (!isCurrent) return;
        setConnectionError(error instanceof Error ? error.message : 'Please try again.');
        setConnectionStatus('error');
      });

    return () => { isCurrent = false; };
  }, [authUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleConnectionAction = async (developerId: string, action: RequestAction, requestId?: string) => {
    if (!authUser) {
      showToast('Sign in to send or manage connection requests.');
      return;
    }

    const actionId = requestId || developerId;
    setPendingActionIds((ids) => [...ids, actionId]);
    try {
      if (action === 'connect') {
        const { error } = await supabase.from('connection_requests').insert({
          sender_id: authUser.id,
          receiver_id: developerId,
          status: 'pending'
        });
        if (error) throw error;
      } else {
        const status: ConnectionRequestStatus = action === 'accept'
          ? 'accepted'
          : action === 'reject' ? 'rejected' : 'cancelled';
        const { error } = await supabase
          .from('connection_requests')
          .update({ status })
          .eq('id', requestId || '')
          .eq('status', 'pending')
          .select('id')
          .single();
        if (error) throw error;
      }

      const latestRequests = await loadConnectionRequests(authUser.id);
      if (authUserIdRef.current === authUser.id) setConnectionRequests(latestRequests);
      showToast(action === 'connect' ? 'Connection request sent.' : `Request ${action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'cancelled'}.`);
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Please try again.';
      showToast(detail.includes('connection_requests')
        ? 'Connection requests need setup. Run supabase/connection_requests.sql in the Supabase SQL Editor.'
        : `Unable to update connection: ${detail}`);
    } finally {
      setPendingActionIds((ids) => ids.filter((id) => id !== actionId));
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    void handleConnectionAction('', 'accept', requestId);
  };

  const handleDeclineRequest = (requestId: string) => {
    void handleConnectionAction('', 'reject', requestId);
  };

  // Save profile updates
  const handleSaveProfile = async (updated: UserProfile) => {
    if (authUser) {
      if (profileStatus === 'loading') {
        throw new Error('Wait for your profile to finish loading before saving.');
      }

      const { error } = await supabase
        .from('profiles')
        .update(profileToRow(updated))
        .eq('id', authUser.id)
        .select('id')
        .single();
      if (error) throw error;
    }

    if (!authUser || authUserIdRef.current === authUser.id) {
      setUser({ ...updated, completionPercentage: profileCompletion(updated) });
    }
    showToast('Profile updated.');
  };

  // Save match preferences
  const handleSavePreferences = (prefs: { targetTrack: string }) => {
    showToast(`Preferences updated: ${prefs.targetTrack}`);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) showToast(`Unable to sign out: ${error.message}`);
    else showToast('Signed out.');
  };

  const scoredRequests = connectionRequests.map((request) => ({
    ...request,
    developer: { ...request.developer, matchScore: calculateCompatibility(user, request.developer) }
  }));
  const incomingRequests = scoredRequests.filter((request) =>
    request.status === 'pending' && request.receiverId === authUser?.id
  );
  const outgoingRequests = scoredRequests.filter((request) =>
    request.status === 'pending' && request.senderId === authUser?.id
  );
  const connections: Connection[] = scoredRequests
    .filter((request) => request.status === 'accepted')
    .map((request) => ({ id: request.id, developer: request.developer, status: 'Connected' }));
  const pendingRequests: PendingRequest[] = incomingRequests.map((request) => ({
    id: request.id,
    developer: request.developer,
    category: request.developer.seekingRoles || 'HackMate connection',
    message: 'Would like to connect with you on HackMate.',
    timestamp: request.createdAt,
    status: 'pending'
  }));
  const developers: Developer[] = authUser
    ? profileRows.map((row) => {
        const developer = developerFromProfile(row);
        const relationship = connectionRequests.find((request) =>
          request.senderId === developer.id || request.receiverId === developer.id
        );
        developer.matchScore = calculateCompatibility(user, developer);
        if (relationship?.status === 'accepted') developer.connectionStatus = 'connected';
        else if (relationship?.status === 'pending') {
          developer.connectionStatus = relationship.senderId === authUser.id ? 'outgoing-pending' : 'incoming-pending';
          developer.connectionRequestId = relationship.id;
        }
        return developer;
      })
    : initialDevelopers;
  const topMatches = [...developers].sort((left, right) => right.matchScore - left.matchScore).slice(0, 3);

  const handleViewConnectionProfile = (connection: Connection) => setSelectedDeveloper(connection.developer);

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050507] text-sm text-zinc-400" role="status">
        Checking your session...
      </main>
    );
  }

  if (!authUser) {
    return <AuthModal fullPage initialMode="login" isOpen onClose={() => undefined} />;
  }

  return (
    <div className="min-h-screen bg-[#050507] text-[#e3e1ec] font-sans flex flex-col selection:bg-zinc-800 selection:text-white">
      {/* Top Navigation */}
      <Navigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        isAuthenticated={authUser !== null}
        userEmail={authUser?.email || ''}
        onOpenAuth={setAuthMode}
        onSignOut={handleSignOut}
        onEditProfile={() => setIsProfileModalOpen(true)}
        incomingRequestNames={incomingRequests.map((request) => request.developer.name)}
        unreadCount={incomingRequests.length}
        onOpenTeammatesSearch={() => setCurrentView('discover')}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full flex flex-col">
        {authUser && profileStatus === 'loading' && (
          <div className="mx-auto mt-20 w-full max-w-5xl px-4 text-sm text-zinc-400" role="status">
            Loading your profile...
          </div>
        )}
        {authUser && profileStatus === 'error' && (
          <div className="mx-auto mt-20 w-full max-w-5xl px-4 text-sm text-red-400" role="alert">
            Unable to load your profile: {profileError}
          </div>
        )}
        {currentView === 'landing' && (
          <LandingPage
            onFindTeammates={() => setCurrentView('dashboard')}
            onExploreDevelopers={() => setCurrentView('discover')}
            onViewHackathons={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            user={user}
            matches={topMatches}
            pendingRequests={pendingRequests}
            connections={connections}
            outgoingRequestCount={outgoingRequests.length}
            isAuthenticated={authUser !== null}
            networkStatus={authUser ? connectionStatus : 'ready'}
            networkError={connectionError}
            matchesLoading={authUser !== null && developerStatus === 'loading'}
            matchesError={authUser !== null && developerStatus === 'error' ? developerError : null}
            pendingActionIds={pendingActionIds}
            onBrowseAll={() => setCurrentView('discover')}
            onOpenMatchPreferences={() => setIsPreferencesModalOpen(true)}
            onCompleteProfile={() => setIsProfileModalOpen(true)}
            onViewDeveloper={(dev) => setSelectedDeveloper(dev)}
            onConnectionAction={(developerId, action, requestId) => { void handleConnectionAction(developerId, action, requestId); }}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            onViewConnectionProfile={handleViewConnectionProfile}
            onManageConnections={() => setCurrentView('connections')}
          />
        )}

        {currentView === 'discover' && (
          <DiscoverView
            developers={developers}
            isAuthenticated={authUser !== null}
            isLoading={authUser !== null && developerStatus === 'loading'}
            error={authUser !== null && developerStatus === 'error' ? developerError : null}
            pendingActionIds={pendingActionIds}
            onConnectionAction={(developerId, action, requestId) => { void handleConnectionAction(developerId, action, requestId); }}
            onViewDeveloper={(dev) => setSelectedDeveloper(dev)}
          />
        )}

        {currentView === 'connections' && (
          <ConnectionsView
            connections={connections}
            incomingRequests={incomingRequests}
            outgoingRequests={outgoingRequests}
            isLoading={authUser !== null && connectionStatus === 'loading'}
            error={authUser !== null && connectionStatus === 'error' ? connectionError : null}
            isAuthenticated={authUser !== null}
            pendingActionIds={pendingActionIds}
            onRequestAction={(requestId, action) => {
              const request = connectionRequests.find((item) => item.id === requestId);
              void handleConnectionAction(request?.developer.id || '', action, requestId);
            }}
            onViewDeveloper={(developer) => setSelectedDeveloper(developer)}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            user={user}
            onEditProfile={() => setIsProfileModalOpen(true)}
            onBrowseMatches={() => setCurrentView('discover')}
          />
        )}
      </main>

      {/* Global Minimal Footer */}
      <Footer />

      {/* Modals */}
      {selectedDeveloper && (
        <DeveloperDetailModal
          developer={selectedDeveloper}
          onClose={() => setSelectedDeveloper(null)}
          onConnectionAction={(action) => {
            if (selectedDeveloper) void handleConnectionAction(selectedDeveloper.id, action, selectedDeveloper.connectionRequestId);
          }}
          isAuthenticated={authUser !== null}
          isActionPending={selectedDeveloper ? pendingActionIds.includes(selectedDeveloper.connectionRequestId || selectedDeveloper.id) : false}
        />
      )}

      {isProfileModalOpen && (
        <ProfileModal
          user={user}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      {isPreferencesModalOpen && (
        <MatchPreferencesModal
          isOpen={isPreferencesModalOpen}
          onClose={() => setIsPreferencesModalOpen(false)}
          onSavePreferences={handleSavePreferences}
        />
      )}

      {authMode && (
        <AuthModal
          initialMode={authMode}
          isOpen
          onClose={() => setAuthMode(null)}
        />
      )}

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-white shadow-2xl font-mono text-xs animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
