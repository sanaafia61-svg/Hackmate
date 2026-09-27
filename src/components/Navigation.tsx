import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import type { AuthMode } from './AuthModal';

interface NavigationProps {
  currentView: 'landing' | 'dashboard' | 'discover' | 'connections' | 'profile';
  setCurrentView: (view: 'landing' | 'dashboard' | 'discover' | 'connections' | 'profile') => void;
  user: UserProfile;
  userEmail: string;
  isAuthenticated: boolean;
  onOpenAuth: (mode: AuthMode) => void;
  onSignOut: () => void;
  onEditProfile: () => void;
  incomingRequestNames: string[];
  unreadCount?: number;
  onOpenTeammatesSearch?: () => void;
  onOpenNotifications?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  setCurrentView,
  user,
  userEmail,
  isAuthenticated,
  onOpenAuth,
  onSignOut,
  onEditProfile,
  incomingRequestNames,
  unreadCount = 2,
  onOpenTeammatesSearch
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#070709]/85 backdrop-blur-xl border-b border-white/[0.08] transition-colors">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Zone: Brand & Primary Nav */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 focus:outline-none group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center p-1 text-white shadow-inner group-hover:border-zinc-500 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 32 32">
                <path d="M9 9L15 16L9 23" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
                <circle cx="21" cy="16" fill="#ffffff" r="2.5" />
                <path d="M15 24H23" stroke="#a1a1aa" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </div>
            <span className="font-semibold text-lg tracking-tight text-white group-hover:text-zinc-300 transition-colors">
              Hack<span className="text-zinc-400 font-normal">Mate</span>
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 font-mono text-xs tracking-wider uppercase text-zinc-400">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                currentView === 'landing'
                  ? 'text-white font-medium bg-zinc-900 border border-zinc-800'
                  : 'hover:text-white hover:bg-zinc-900/50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                currentView === 'dashboard'
                  ? 'text-white font-medium bg-zinc-900 border border-zinc-800'
                  : 'hover:text-white hover:bg-zinc-900/50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('discover')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                currentView === 'discover'
                  ? 'text-white font-medium bg-zinc-900 border border-zinc-800'
                  : 'hover:text-white hover:bg-zinc-900/50'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => setCurrentView('connections')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                currentView === 'connections'
                  ? 'text-white font-medium bg-zinc-900 border border-zinc-800'
                  : 'hover:text-white hover:bg-zinc-900/50'
              }`}
            >
              Connections
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                currentView === 'profile'
                  ? 'text-white font-medium bg-zinc-900 border border-zinc-800'
                  : 'hover:text-white hover:bg-zinc-900/50'
              }`}
            >
              My Profile
            </button>
          </nav>
        </div>

        {/* Right Zone: Primary Actions, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Find Teammates Button */}
          <button
            onClick={() => {
              if (onOpenTeammatesSearch) {
                onOpenTeammatesSearch();
              } else {
                setCurrentView('discover');
              }
            }}
            type="button"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-sm shadow-white/10 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">person_search</span>
            <span>Find Teammates</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all focus:outline-none cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0e0f14] border border-zinc-800 p-4 shadow-2xl z-50 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white font-mono uppercase tracking-wider">Connection Requests</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
                      {unreadCount} New
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-zinc-500 hover:text-zinc-300 text-xs font-mono"
                  >
                    Close
                  </button>
                </div>
                <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto">
                  {incomingRequestNames.length > 0 ? incomingRequestNames.map((name) => (
                    <button
                      key={name}
                      onClick={() => {
                        setCurrentView('connections');
                        setShowNotifications(false);
                      }}
                      className="rounded-xl border border-zinc-800/60 bg-zinc-900/70 p-2.5 text-left text-xs text-white hover:border-zinc-700"
                      type="button"
                    >
                      {name} sent you a connection request.
                    </button>
                  )) : <p className="p-2 text-xs text-zinc-400">No incoming connection requests.</p>}
                </div>
              </div>
            )}
          </div>

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                className="rounded-full px-3 py-1.5 font-mono text-xs text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
                onClick={() => onOpenAuth('login')}
                type="button"
              >
                Sign in
              </button>
              <button
                className="rounded-full bg-white px-3.5 py-1.5 font-mono text-xs font-semibold text-black transition-colors hover:bg-zinc-200"
                onClick={() => onOpenAuth('signup')}
                type="button"
              >
                Sign up
              </button>
            </div>
          ) : (
          /* Profile Menu Dropdown */
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 pl-2 py-1 rounded-full hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
            >
              <div className="relative">
                <img
                  alt={`${user.name} Profile`}
                  className="w-8 h-8 rounded-full object-cover border border-zinc-700/60"
                  src={user.avatar}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black"></span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-zinc-400">
                keyboard_arrow_down
              </span>
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0e0f14] border border-zinc-800 p-2 shadow-2xl z-50 font-sans">
                <div className="px-3 py-2 border-b border-zinc-800/70 mb-1">
                  <p className="text-xs font-semibold text-white">{user.name}</p>
                  <p className="text-[11px] text-zinc-400 font-mono break-all">{userEmail}</p>
                </div>
                <button
                  onClick={() => {
                    onEditProfile();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">account_circle</span>
                  <span>My Profile ({user.completionPercentage}%)</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('dashboard');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">dashboard</span>
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('landing');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">public</span>
                  <span>Public Landing Page</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSignOut();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Sign out</span>
                </button>
                <div className="h-px bg-zinc-800 my-1"></div>
                <div className="px-3 py-1.5 text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>HackMate Account</span>
                </div>
              </div>
            )}
          </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#09090c] border-b border-zinc-800 px-6 py-4 flex flex-col gap-3 font-mono text-xs">
          {isAuthenticated && <div className="border-b border-zinc-800 pb-3 text-zinc-400 break-all">{userEmail}</div>}
          <button
            onClick={() => {
              setCurrentView('landing');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-zinc-300 hover:text-white"
          >
            Overview / Landing
          </button>
          <button
            onClick={() => {
              setCurrentView('dashboard');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-zinc-300 hover:text-white"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setCurrentView('discover');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-zinc-300 hover:text-white"
          >
            Discover Developers
          </button>
          <button
            onClick={() => {
              setCurrentView('connections');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-zinc-300 hover:text-white"
          >
            Connections
          </button>
          <button
            onClick={() => {
              setCurrentView('profile');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-zinc-300 hover:text-white"
          >
            My Profile
          </button>
          {isAuthenticated ? (
            <>
              <button onClick={() => { onEditProfile(); setMobileMenuOpen(false); }} className="text-left py-2 text-zinc-300 hover:text-white">Edit Profile</button>
              <button onClick={() => { onSignOut(); setMobileMenuOpen(false); }} className="text-left py-2 text-zinc-300 hover:text-white">Sign out</button>
            </>
          ) : (
            <div className="flex gap-3 border-t border-zinc-800 pt-3">
              <button onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }} className="py-2 text-zinc-300 hover:text-white">Sign in</button>
              <button onClick={() => { onOpenAuth('signup'); setMobileMenuOpen(false); }} className="py-2 text-zinc-300 hover:text-white">Sign up</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
