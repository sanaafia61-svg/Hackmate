/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  currentUser as defaultUser,
  initialDevelopers,
  initialPendingRequests,
  initialConnections
} from './data/mockData';
import { Developer, PendingRequest, Connection, UserProfile } from './types';
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

export default function App() {
  const [currentView, setCurrentView] = useState<
    'landing' | 'dashboard' | 'discover' | 'connections' | 'profile'
  >('dashboard');

  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [developers, setDevelopers] = useState<Developer[]>(initialDevelopers);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>(initialPendingRequests);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);

  // Modals state
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [activeChatConnection, setActiveChatConnection] = useState<Connection | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Connect action
  const handleConnect = (devId: string, customNote?: string) => {
    setDevelopers((prev) =>
      prev.map((d) => (d.id === devId ? { ...d, connectionStatus: 'requested' } : d))
    );
    const target = developers.find((d) => d.id === devId);
    showToast(`Team invitation sent to ${target ? target.name : 'developer'}!`);
  };

  // Accept incoming request
  const handleAcceptRequest = (reqId: string) => {
    const request = pendingRequests.find((r) => r.id === reqId);
    if (!request) return;

    setPendingRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'accepted' } : r))
    );

    const newConnection: Connection = {
      id: `conn-${request.developer.id}`,
      developer: request.developer,
      status: `${request.category} • Connected`,
      lastMessage: request.message,
      lastMessageTime: 'Just now'
    };

    setConnections((prev) => [newConnection, ...prev]);
    showToast(`Connected with ${request.developer.name}! Squad roster updated.`);
  };

  // Decline incoming request
  const handleDeclineRequest = (reqId: string) => {
    setPendingRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'declined' } : r))
    );
    showToast('Invitation declined.');
  };

  // Open direct chat
  const handleOpenChat = (conn: Connection) => {
    setActiveChatConnection(conn);
    setCurrentView('connections');
  };

  // Save profile updates
  const handleSaveProfile = (updated: UserProfile) => {
    setUser(updated);
    showToast('Profile updated! 100% Priority Matching unlocked.');
  };

  // Save match preferences
  const handleSavePreferences = (prefs: any) => {
    showToast(`Preferences updated: ${prefs.targetTrack}`);
  };

  // Top matches for dashboard
  const topMatches = developers.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#050507] text-[#e3e1ec] font-sans flex flex-col selection:bg-zinc-800 selection:text-white">
      {/* Top Navigation */}
      <Navigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        unreadCount={pendingRequests.filter((r) => r.status === 'pending').length}
        onOpenTeammatesSearch={() => setCurrentView('discover')}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full flex flex-col">
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
            onBrowseAll={() => setCurrentView('discover')}
            onOpenMatchPreferences={() => setIsPreferencesModalOpen(true)}
            onCompleteProfile={() => setIsProfileModalOpen(true)}
            onViewDeveloper={(dev) => setSelectedDeveloper(dev)}
            onConnectDeveloper={handleConnect}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            onOpenChat={handleOpenChat}
            onManageConnections={() => setCurrentView('connections')}
          />
        )}

        {currentView === 'discover' && (
          <DiscoverView
            developers={developers}
            onViewDeveloper={(dev) => setSelectedDeveloper(dev)}
            onConnectDeveloper={handleConnect}
          />
        )}

        {currentView === 'connections' && (
          <ConnectionsView
            connections={connections}
            activeChatConnection={activeChatConnection}
            setActiveChatConnection={setActiveChatConnection}
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
          onConnect={handleConnect}
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
