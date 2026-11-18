import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { DEFAULT_ACCOUNTS } from '../data/credentials';

export default function LoginModal({ isOpen, onClose, onLogin, currentUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const account = DEFAULT_ACCOUNTS.find(
      (acc) =>
        acc.username.toLowerCase() === username.trim().toLowerCase() &&
        acc.password === password.trim()
    );

    if (account) {
      onLogin(account);
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setError('Invalid collegiate ID or password. Check credentials below.');
    }
  };

  const handleQuickLogin = (account) => {
    onLogin(account);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-500/60 backdrop-blur-sm">
      <div className="bg-parchment-100 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-warm-lg relative transition-all animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-parchment-500 hover:text-parchment-800 dark:text-parchment-400 dark:hover:text-parchment-100 bg-parchment-200/50 hover:bg-parchment-200 dark:bg-obsidian-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-terracotta-500" />
          <h3 className="text-xl font-serif font-normal text-parchment-900 dark:text-parchment-50">
            Syndicate Identity Portal
          </h3>
        </div>
        <p className="text-xs text-parchment-600 dark:text-parchment-400 mb-5 leading-relaxed">
          Sign in to raise treat claims or administer the collegiate rotational ledger.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-parchment-700 dark:text-parchment-300 mb-1">
              Colleague Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-parchment-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. elesh or bhawesh"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 text-parchment-900 dark:text-parchment-100 text-xs sm:text-sm focus:outline-none focus:border-terracotta-500 font-sans transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-parchment-700 dark:text-parchment-300 mb-1">
              Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-parchment-400 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 text-parchment-900 dark:text-parchment-100 text-xs sm:text-sm focus:outline-none focus:border-terracotta-500 font-sans transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white font-medium text-xs sm:text-sm shadow-warm transition-all transform active:scale-98"
          >
            Authenticate & Enter
          </button>
        </form>

        {/* 1-Click Fast Switcher */}
        <div className="mt-5 pt-4 border-t border-parchment-200 dark:border-obsidian-100">
          <span className="text-[10px] font-mono uppercase tracking-wider text-parchment-500 block mb-2">
            Quick 1-Click Switcher (Testing & Roster Access):
          </span>
          <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {DEFAULT_ACCOUNTS.map((acc) => {
              const isAdmin = acc.role === 'admin';
              return (
                <button
                  type="button"
                  key={acc.id}
                  onClick={() => handleQuickLogin(acc)}
                  className={`p-2 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                    isAdmin
                      ? 'bg-terracotta-50/80 dark:bg-terracotta-950/40 border-terracotta-300 dark:border-terracotta-800 text-terracotta-800 dark:text-terracotta-200 font-medium'
                      : 'bg-parchment-50 dark:bg-obsidian-300 border-parchment-200 dark:border-obsidian-100 text-parchment-700 dark:text-parchment-300 hover:border-parchment-400'
                  }`}
                >
                  <div className="w-5 h-5 rounded-md overflow-hidden bg-parchment-200 dark:bg-obsidian-100 flex-shrink-0 flex items-center justify-center text-[10px]">
                    {acc.photo ? (
                      <img src={acc.photo} alt={acc.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{acc.avatar}</span>
                    )}
                  </div>
                  <div className="truncate">
                    <span className="block truncate leading-tight">{acc.name}</span>
                    <span className="text-[9px] font-mono opacity-75">{acc.role === 'admin' ? '👑 Admin' : 'Fellow'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
