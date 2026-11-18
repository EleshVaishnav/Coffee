import React from 'react';
import { Coffee, Plus, Share2, Disc, UserPlus, Sun, Moon, Scale, ShieldAlert, LogIn, LogOut, CheckCircle2, Cloud } from 'lucide-react';

export default function Navbar({
  groupName,
  currentRound,
  theme,
  currentUser,
  pendingClaimsCount,
  isCloudConnected,
  onOpenCloudModal,
  onToggleTheme,
  onOpenLogModal,
  onOpenSpinWheel,
  onOpenShareModal,
  onOpenAddMemberModal,
  onOpenAxiomModal,
  onOpenLoginModal,
  onOpenAdminClaims,
  onLogout,
}) {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-30 bg-parchment-100/90 dark:bg-obsidian-400/90 backdrop-blur-md border-b border-parchment-300 dark:border-obsidian-200 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Editorial Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-terracotta-50 dark:bg-obsidian-200 border border-terracotta-200 dark:border-obsidian-100 flex items-center justify-center text-xl shadow-warm-sm">
            ☕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-serif font-medium text-parchment-900 dark:text-parchment-50 tracking-tight">
                {groupName}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-200 dark:border-terracotta-800/60">
                Cycle {currentRound}
              </span>
            </div>
            <p className="text-[12px] text-parchment-600 dark:text-parchment-400 font-sans hidden sm:block">
              Institute Collegial Treat & Rotation Protocol
            </p>
          </div>
        </div>

        {/* Action Controls & User Account Pill */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Admin Claims Review Button (Prominent for Elesh) */}
          {isAdmin && (
            <button
              onClick={onOpenAdminClaims}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all shadow-warm-sm ${
                pendingClaimsCount > 0
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-700 dark:text-amber-300 animate-pulse'
                  : 'bg-parchment-200/80 dark:bg-obsidian-200 text-parchment-800 dark:text-parchment-200 border-parchment-300 dark:border-obsidian-100'
              }`}
              title="Review pending treat tickets"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Review Claims</span>
              {pendingClaimsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {pendingClaimsCount}
                </span>
              )}
            </button>
          )}

          {/* Admin Add Member Button (Strictly for Elesh) */}
          {isAdmin && (
            <button
              onClick={onOpenAddMemberModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-parchment-200/80 hover:bg-parchment-300 dark:bg-obsidian-200 dark:hover:bg-obsidian-100 text-parchment-800 dark:text-parchment-200 border border-parchment-300 dark:border-obsidian-100 text-xs font-medium transition-all shadow-warm-sm"
              title="Enroll or remove members (Admin Only)"
            >
              <UserPlus className="w-3.5 h-3.5 text-terracotta-500" />
              <span className="hidden sm:inline">Add Member</span>
            </button>
          )}

          {/* User Account / Identity Pill */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 p-1 pl-1.5 rounded-xl bg-parchment-200/70 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 text-xs">
              <div className="w-6 h-6 rounded-lg overflow-hidden bg-parchment-100 dark:bg-obsidian-300 flex items-center justify-center border border-parchment-300 dark:border-obsidian-50">
                {currentUser.photo ? (
                  <img src={currentUser.photo} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{currentUser.avatar || '☕'}</span>
                )}
              </div>
              <span className="font-serif font-medium text-parchment-900 dark:text-parchment-100 hidden sm:inline max-w-[100px] truncate">
                {currentUser.name.split('-')[0]}
              </span>
              {isAdmin && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-terracotta-500 text-white font-medium">
                  Admin
                </span>
              )}
              <button
                onClick={onLogout}
                className="p-1 rounded-md text-parchment-500 hover:text-red-500 transition-colors ml-1"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-parchment-200/80 hover:bg-parchment-300 dark:bg-obsidian-200 dark:hover:bg-obsidian-100 text-parchment-800 dark:text-parchment-200 border border-parchment-300 dark:border-obsidian-100 text-xs font-medium transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Sign In</span>
            </button>
          )}

          {/* UFO vs Better Coffee Axiom Button */}
          <button
            onClick={onOpenAxiomModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-parchment-200/80 hover:bg-parchment-300 dark:bg-obsidian-200 dark:hover:bg-obsidian-100 text-parchment-800 dark:text-parchment-200 border border-parchment-300 dark:border-obsidian-100 text-xs font-medium transition-all hidden md:flex"
            title="Examine Axiom 1.1: UFO Cafe ≠ Better Coffee"
          >
            <Scale className="w-3.5 h-3.5 text-terracotta-500" />
            <span className="font-mono text-[11px]">UFO ≠ Coffee</span>
          </button>

          {/* Spin Wheel */}
          <button
            onClick={onOpenSpinWheel}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-parchment-200/80 hover:bg-parchment-300 dark:bg-obsidian-200 dark:hover:bg-obsidian-100 text-parchment-800 dark:text-parchment-200 border border-parchment-300 dark:border-obsidian-100 text-xs font-medium transition-all flex items-center gap-1.5"
            title="Resolve deadlock: spin candidate roulette"
          >
            <Disc className="w-3.5 h-3.5 text-parchment-600 dark:text-parchment-400" />
            <span className="hidden lg:inline">Roulette</span>
          </button>

          {/* WhatsApp Share */}
          <button
            onClick={onOpenShareModal}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-xs font-medium transition-all flex items-center gap-1.5"
            title="Generate collegial dispatch for WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Dispatch</span>
          </button>

          {/* Cloud Database Sync Status Pill */}
          <button
            onClick={onOpenCloudModal}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              isCloudConnected
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-parchment-200/80 hover:bg-parchment-300 dark:bg-obsidian-200 dark:hover:bg-obsidian-100 text-parchment-700 dark:text-parchment-300 border-parchment-300 dark:border-obsidian-100'
            }`}
            title={isCloudConnected ? 'Cloud Database Connected (Realtime multi-phone sync active)' : 'Configure Online Cloud Database for multi-phone sync'}
          >
            {isCloudConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden md:inline">Cloud Live</span>
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5 text-terracotta-500" />
                <span className="hidden md:inline">Cloud DB</span>
              </>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg bg-parchment-200/80 hover:bg-parchment-300 dark:bg-obsidian-200 dark:hover:bg-obsidian-100 text-parchment-700 dark:text-parchment-300 border border-parchment-300 dark:border-obsidian-100 text-xs font-medium transition-all"
            title={theme === 'dark' ? 'Switch to Warm Parchment (Light)' : 'Switch to Warm Obsidian (Dark)'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-parchment-700" />
            )}
          </button>

          {/* Record Treat / Raise Claim CTA */}
          <button
            onClick={onOpenLogModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white text-xs sm:text-sm font-medium shadow-warm transition-all transform active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{isAdmin ? 'Record Treat' : 'Claim Treat'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
