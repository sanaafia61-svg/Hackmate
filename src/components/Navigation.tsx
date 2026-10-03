import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  ChevronDown,
  Compass,
  House,
  LogOut,
  Menu,
  MoonStar,
  PencilLine,
  SunMedium,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { UserProfile } from '../types';
import type { AuthMode } from './AuthModal';
import { AnimalAvatar } from './AnimalAvatar';

export type ThemeMode = 'light' | 'dark';

interface NavigationProps {
  currentView: 'landing' | 'dashboard' | 'discover' | 'connections' | 'profile';
  setCurrentView: (view: 'landing' | 'dashboard' | 'discover' | 'connections' | 'profile') => void;
  user: UserProfile;
  profileId: string;
  userEmail: string;
  isAuthenticated: boolean;
  onOpenAuth: (mode: AuthMode) => void;
  onSignOut: () => void;
  onEditProfile: () => void;
  incomingRequestNames: string[];
  unreadCount?: number;
  onOpenTeammatesSearch?: () => void;
  onOpenNotifications?: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  setCurrentView,
  user,
  profileId,
  userEmail,
  isAuthenticated,
  onOpenAuth,
  onSignOut,
  onEditProfile,
  incomingRequestNames,
  unreadCount = 2,
  onOpenTeammatesSearch,
  theme,
  onToggleTheme,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: House },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'connections', label: 'Connections', icon: Users },
    { id: 'profile', label: 'Profile', icon: UserRound },
  ] as const;

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl md:border-slate-200/80 md:bg-[#f8fafb]/90">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setCurrentView('dashboard')}
            type="button"
            className="flex items-center gap-2.5 text-left"
            aria-label="Go to dashboard"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <span className="text-[10px] font-bold tracking-[0.2em]">HM</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-slate-900">
              Hack<span className="font-medium text-slate-500">Mate</span>
            </div>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setCurrentView(id as 'dashboard' | 'discover' | 'connections' | 'profile')}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                  currentView === id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              onClick={onToggleTheme}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 md:inline-flex"
            >
              {theme === 'light' ? <MoonStar size={16} /> : <SunMedium size={16} />}
            </button>

            <div className="relative" ref={notifRef}>
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => setShowNotifications((value) => !value)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl md:w-80">
                  <div className="mb-2 flex items-center justify-between border-b border-slate-200 pb-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Requests</p>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-[11px] text-slate-500 hover:text-slate-900"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-2">
                    {incomingRequestNames.length > 0 ? (
                      incomingRequestNames.map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setCurrentView('connections');
                            setShowNotifications(false);
                          }}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-left text-xs text-slate-700"
                        >
                          {name} sent you a connection request.
                        </button>
                      ))
                    ) : (
                      <p className="px-1 py-2 text-xs text-slate-500">No incoming requests.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  aria-label="Open profile menu"
                  onClick={() => setShowProfileMenu((value) => !value)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-1.5 py-1 text-left shadow-sm"
                >
                  <AnimalAvatar profileId={profileId} name={user.name} className="h-8 w-8 border border-slate-200 text-sm" />
                  <ChevronDown size={14} className="text-slate-500 md:inline-flex" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="border-b border-slate-200 px-3 py-2">
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="mt-0.5 break-all text-[11px] text-slate-500">{userEmail}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onEditProfile();
                        setShowProfileMenu(false);
                      }}
                      className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <PencilLine size={15} />
                      Edit profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentView('profile');
                        setShowProfileMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <UserRound size={15} />
                      View profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSignOut();
                        setShowProfileMenu(false);
                      }}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="rounded-full px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                >
                  Sign up
                </button>
              </div>
            )}

            <button
              type="button"
              aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
              aria-expanded={showMobileMenu}
              onClick={() => setShowMobileMenu((value) => !value)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 md:hidden"
            >
              {showMobileMenu ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </header>

      {showMobileMenu && (
        <div className="fixed inset-x-0 top-14 z-40 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-md flex-col gap-1">
            {([
              ['landing', 'Overview'],
              ['dashboard', 'Home'],
              ['discover', 'Discover'],
              ['connections', 'Connections'],
              ['profile', 'Profile'],
            ] as const).map(([view, label]) => (
              <button
                key={view}
                type="button"
                onClick={() => {
                  setCurrentView(view);
                  setShowMobileMenu(false);
                }}
                className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {label}
              </button>
            ))}
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onEditProfile();
                    setShowMobileMenu(false);
                  }}
                  className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSignOut();
                    setShowMobileMenu(false);
                  }}
                  className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex gap-2 border-t border-slate-200 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth('login');
                    setShowMobileMenu(false);
                  }}
                  className="flex-1 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth('signup');
                    setShowMobileMenu(false);
                  }}
                  className="flex-1 rounded-xl bg-slate-900 px-3 py-2.5 text-left text-sm font-semibold text-white"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-label={label}
              onClick={() => setCurrentView(id as 'dashboard' | 'discover' | 'connections' | 'profile')}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors ${
                currentView === id ? 'text-slate-900' : 'text-slate-500'
              }`}
            >
              <Icon size={19} className={currentView === id ? 'text-slate-900' : 'text-slate-500'} />
              <span>{label}</span>
              {currentView === id && <span className="h-1 w-5 rounded-full bg-slate-900" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};
