import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: AuthMode;
  onClose: () => void;
  fullPage?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode, onClose, fullPage = false }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { name: fullName.trim() },
          },
        });
        if (error) throw error;

        if (!data.session) {
          setSuccessMessage('Check your email for a confirmation link to finish signing up.');
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }

      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <main className={fullPage
      ? 'flex min-h-screen items-center justify-center bg-[#050507] px-4 py-12 text-[#e3e1ec]'
      : 'fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md'}>
      <section
        aria-labelledby="auth-modal-title"
        aria-modal={fullPage ? undefined : true}
        className={fullPage
          ? 'w-full max-w-md border-y border-zinc-800 bg-[#0e0f14] px-6 py-9 sm:border sm:px-9 sm:py-10'
          : 'relative w-full max-w-md rounded-3xl border border-zinc-800 bg-[#0e0f14] p-6 shadow-2xl sm:p-8'}
        role={fullPage ? 'region' : 'dialog'}
      >
        {!fullPage && (
          <button
            aria-label="Close authentication dialog"
            className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}

        <div className="mb-6">
          {fullPage && <p className="mb-8 text-sm font-semibold text-white">Hack<span className="font-normal text-zinc-400">Mate</span></p>}
          <h2 className="text-xl font-semibold tracking-tight text-white" id="auth-modal-title">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            {mode === 'login' ? 'Sign in to continue to HackMate.' : 'Join HackMate with your email address.'}
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300" htmlFor="auth-full-name">
                Full name
              </label>
              <input
                autoComplete="name"
                className="w-full rounded-xl border border-zinc-800 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
                id="auth-full-name"
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your name"
                required
                type="text"
                value={fullName}
              />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-300" htmlFor="auth-email">
              Email
            </label>
            <input
              autoComplete="email"
              className="w-full rounded-xl border border-zinc-800 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
              id="auth-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-300" htmlFor="auth-password">
              Password
            </label>
            <input
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="w-full rounded-xl border border-zinc-800 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
              id="auth-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              type="password"
              value={password}
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300" htmlFor="auth-confirm-password">
                Confirm password
              </label>
              <input
                autoComplete="new-password"
                className="w-full rounded-xl border border-zinc-800 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
                id="auth-confirm-password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                required
                type="password"
                value={confirmPassword}
              />
            </div>
          )}

          {errorMessage && <p className="text-sm text-red-400" role="alert">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-emerald-400" role="status">{successMessage}</p>}

          <button
            className="mt-1 inline-flex min-h-10 items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-400">
          {mode === 'login' ? 'New to HackMate?' : 'Already have an account?'}{' '}
          <button
            className="font-medium text-white underline-offset-4 hover:underline"
            onClick={() => changeMode(mode === 'login' ? 'signup' : 'login')}
            type="button"
          >
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </section>
    </main>
  );
};