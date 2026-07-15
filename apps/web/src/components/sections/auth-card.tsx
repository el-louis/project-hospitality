'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getStoredSession, login, register } from '@/lib/api';
import type { AuthFormState, AuthResponse } from '@/lib/types';

export function AuthCard() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState<AuthFormState>({
    fullName: '',
    email: '',
    password: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [session, setSession] = useState<AuthResponse | null>(null);

  useEffect(() => {
    const storedSession = getStoredSession();

    if (storedSession) {
      setSession(storedSession);
      setStatus('success');
      setMessage('Welcome back. Your session is active.');
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const response = mode === 'login'
        ? await login({ email: form.email, password: form.password })
        : await register({
            email: form.email,
            password: form.password,
            fullName: form.fullName,
          });

      setSession(response);
      setStatus('success');
      setMessage(mode === 'login' ? 'Signed in successfully.' : 'Account created successfully.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Authentication failed.');
    }
  };

  return (
    <div className="rounded-3xl border border-primary/10 bg-surface p-6 shadow-soft sm:p-8">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-primary text-white' : 'text-text-secondary'}`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === 'register' ? 'bg-primary text-white' : 'text-text-secondary'}`}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {mode === 'register' ? (
          <label className="block text-sm font-medium text-text-primary">
            Full name
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm"
            />
          </label>
        ) : null}

        <label className="block text-sm font-medium text-text-primary">
          Email
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm"
          />
        </label>

        <label className="block text-sm font-medium text-text-primary">
          Password
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm"
          />
        </label>

        <Button type="submit" loading={status === 'submitting'} className="w-full">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </Button>
      </form>

      {message ? (
        <p className={`mt-4 rounded-2xl px-4 py-3 text-sm ${status === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
          {message}
        </p>
      ) : null}

      {session ? (
        <div className="mt-6 rounded-2xl border border-primary/10 bg-primary/5 p-4 text-sm text-text-secondary">
          <p className="font-semibold text-text-primary">Signed in as {session.user.fullName}</p>
          <p className="mt-1">Session active for {session.user.email}</p>
        </div>
      ) : null}
    </div>
  );
}
