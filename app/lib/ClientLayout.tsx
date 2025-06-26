"use client";
import { useEffect, useState } from 'react';
import { supabase } from './supabase/client';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar: only for signed-in users */}
      {user && <Sidebar user={user} />}
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-8 py-4 border-b bg-white">
          <h1 className="text-2xl font-bold">Chart</h1>
          <button className="bg-gray-100 px-3 py-1 rounded">⚙️</button>
        </header>
        <div className="flex-1 p-8 bg-gray-50">{children}</div>
      </main>
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Welcome to Chart API Service</h2>
            <p className="mb-4 text-gray-600">Sign in to your account or create a new one</p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
              const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
              const { error } = await supabase.auth.signInWithPassword({ email, password });
              if (!error) setShowAuthModal(false);
              // TODO: handle error
            }}>
              <div className="mb-2">
                <input name="email" type="email" placeholder="your@email.com" className="w-full px-3 py-2 border rounded mb-2" required />
                <input name="password" type="password" placeholder="Password" className="w-full px-3 py-2 border rounded" required />
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="flex-1 py-2 bg-gray-900 text-white rounded">Sign In</button>
                <button type="button" className="flex-1 py-2 bg-gray-200 rounded" onClick={() => setShowAuthModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 