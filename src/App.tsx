import React, { useEffect, useRef, useState } from 'react';
import { Plane } from 'lucide-react';
import TripPlanner from './TripPlanner';
import { initialExpenses, initialItinerary, initialPackingList } from './data';
import { ExpenseItem, ItineraryItem, PackingItem } from './types';
import { isSupabaseConfigured, supabase } from './lib/supabase';

type CloudUser = {
  id: string;
  email: string;
};

type TripProfile = {
  itinerary: ItineraryItem[];
  expenses: ExpenseItem[];
  packing_list: PackingItem[];
};

function readLocalProfile(): TripProfile {
  return {
    itinerary: JSON.parse(localStorage.getItem('europe_itinerary') || JSON.stringify(initialItinerary)),
    expenses: JSON.parse(localStorage.getItem('europe_expenses') || JSON.stringify(initialExpenses)),
    packing_list: JSON.parse(localStorage.getItem('europe_packing') || JSON.stringify(initialPackingList)),
  };
}

function writeLocalProfile(profile: TripProfile) {
  localStorage.setItem('europe_itinerary', JSON.stringify(profile.itinerary));
  localStorage.setItem('europe_expenses', JSON.stringify(profile.expenses));
  localStorage.setItem('europe_packing', JSON.stringify(profile.packing_list));
}

export default function App() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [profileLoading, setProfileLoading] = useState(false);
  const [user, setUser] = useState<CloudUser | null>(null);
  const lastSavedRef = useRef('');

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email || '' } : null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email || '' } : null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !user) return;

    let cancelled = false;
    setProfileLoading(true);

    supabase
      .from('trip_profiles')
      .select('itinerary, expenses, packing_list')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(async ({ data, error }) => {
        if (cancelled) return;

        if (error) {
          setAuthError(error.message);
          setProfileLoading(false);
          return;
        }

        const profile: TripProfile = data
          ? {
              itinerary: (data.itinerary as ItineraryItem[]) || initialItinerary,
              expenses: (data.expenses as ExpenseItem[]) || initialExpenses,
              packing_list: (data.packing_list as PackingItem[]) || initialPackingList,
            }
          : {
              itinerary: initialItinerary,
              expenses: initialExpenses,
              packing_list: initialPackingList,
            };

        if (!data) {
          await supabase.from('trip_profiles').insert({
            user_id: user.id,
            ...profile,
          });
        }

        writeLocalProfile(profile);
        localStorage.setItem('tripflow_current_user', user.email);
        localStorage.setItem('tripflow_users', JSON.stringify({ [user.email]: { cloud: true } }));
        lastSavedRef.current = JSON.stringify(profile);
        setProfileLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!supabase || !user || profileLoading) return;

    const interval = window.setInterval(() => {
      const profile = readLocalProfile();
      const snapshot = JSON.stringify(profile);
      if (snapshot === lastSavedRef.current) return;

      lastSavedRef.current = snapshot;
      supabase
        .from('trip_profiles')
        .upsert({
          user_id: user.id,
          ...profile,
        })
        .then(({ error }) => {
          if (error) {
            setAuthError(`Cloud save failed: ${error.message}`);
          }
        });
    }, 1200);

    return () => window.clearInterval(interval);
  }, [user, profileLoading]);

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!supabase) {
      setAuthError('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setAuthError('');

    const result = authMode === 'register'
      ? await supabase.auth.signUp({ email: email.trim(), password })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password });

    setLoading(false);

    if (result.error) {
      setAuthError(result.error.message);
      return;
    }

    if (authMode === 'register' && !result.data.session) {
      setAuthError('Account created. Check your email to confirm it, then sign in.');
      setPassword('');
    }
  };

  const handleCloudSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('tripflow_current_user');
    setUser(null);
  };

  if (!user || profileLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-96 h-96 rounded-full bg-emerald-600/25 blur-[110px] pointer-events-none" />
        <div className="absolute bottom-[8%] right-[-10%] w-96 h-96 rounded-full bg-teal-500/20 blur-[120px] pointer-events-none" />
        <form onSubmit={handleAuthSubmit} className="relative z-10 w-full max-w-md glass-panel rounded-3xl border border-white/10 shadow-2xl p-7 space-y-5">
          <div className="space-y-2 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Plane className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">TripFlow</h1>
            <p className="text-sm text-slate-400">
              {profileLoading ? 'Syncing your cloud travel plan...' : 'Sign in to sync your Europe travel plan'}
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Cloud login is not configured yet. Add the Supabase URL and anon key in Vercel.
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white/5 p-1">
            <button type="button" onClick={() => setAuthMode('login')} className={`py-2 rounded-xl text-sm font-semibold transition-all ${authMode === 'login' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              Sign in
            </button>
            <button type="button" onClick={() => setAuthMode('register')} className={`py-2 rounded-xl text-sm font-semibold transition-all ${authMode === 'register' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              Register
            </button>
          </div>

          <div className="space-y-3">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full px-4 py-3 rounded-2xl text-sm text-white focus:outline-hidden glass-input" autoComplete="email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-2xl text-sm text-white focus:outline-hidden glass-input" autoComplete={authMode === 'register' ? 'new-password' : 'current-password'} required />
          </div>

          {authError && (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {authError}
            </div>
          )}

          <button type="submit" disabled={loading || profileLoading || !isSupabaseConfigured} className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-bold shadow-lg shadow-emerald-950/40 transition-all">
            {loading || profileLoading ? 'Loading...' : authMode === 'register' ? 'Create account' : 'Enter TripFlow'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      <button onClick={handleCloudSignOut} className="fixed top-4 right-24 z-[60] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 border border-white/10 text-xs font-semibold text-white backdrop-blur-md shadow-lg shadow-emerald-950/40">
        Cloud sign out
      </button>
      <TripPlanner key={user.id} />
    </>
  );
}
