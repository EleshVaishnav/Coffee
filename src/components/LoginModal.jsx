import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { DEFAULT_ACCOUNTS } from '../data/credentials';

export default function LoginModal({ isOpen, onClose, onLogin, currentUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setError('Invalid colleague username or passcode. Please check your credentials.');
    }
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
          Sign in to submit your treat claim ticket or manage the collegiate rotational ledger.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-parchment-700 dark:text-parchment-300 mb-1.5">
              Colleague Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-parchment-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="e.g. elesh, bhawesh, vyom..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 text-parchment-900 dark:text-parchment-100 text-xs sm:text-sm focus:outline-none focus:border-terracotta-500 font-sans transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-parchment-700 dark:text-parchment-300 mb-1.5">
              Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-parchment-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your confidential passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 text-parchment-900 dark:text-parchment-100 text-xs sm:text-sm focus:outline-none focus:border-terracotta-500 font-sans transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-parchment-400 hover:text-parchment-600 dark:hover:text-parchment-200 transition-colors"
                title={showPassword ? 'Hide passcode' : 'Show passcode'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white font-medium text-xs sm:text-sm shadow-warm transition-all transform active:scale-98 mt-2"
          >
            Authenticate & Enter
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-parchment-200 dark:border-obsidian-100 flex items-center justify-between text-[11px] font-mono text-parchment-500 dark:text-parchment-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Collegiate Passcode Protected</span>
          </div>
          <span className="text-[10px] opacity-75">Syndicate v1.0</span>
        </div>
      </div>
    </div>
  );
}
