import React from 'react';
import { CheckCircle2, Trophy, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RoundProgress({
  currentRound,
  stats,
  onStartNextRound,
}) {
  const { totalMembers, completedCount, pendingCount, progressPercent, isRoundComplete } = stats;

  const handleNextRoundClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D46238', '#E8A87C', '#3D7A5A', '#B0A595'],
    });
    onStartNextRound();
  };

  return (
    <section className="bg-parchment-50 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 rounded-3xl p-5 sm:p-7 shadow-warm transition-all">
      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-parchment-200/80 dark:bg-obsidian-100 text-parchment-700 dark:text-parchment-300 border border-parchment-300 dark:border-obsidian-50">
              <ShieldCheck className="w-3.5 h-3.5 text-terracotta-500" />
              Equilibrium Protocol • Cycle {currentRound}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-parchment-900 dark:text-parchment-50 tracking-tight">
            {isRoundComplete ? (
              <span className="text-emerald-700 dark:text-emerald-400 italic">
                All {totalMembers} Members Have Treated — Equilibrium Reached
              </span>
            ) : (
              <span>
                {completedCount} of {totalMembers} Colleagues Have Treated
              </span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-parchment-600 dark:text-parchment-400 mt-1 max-w-2xl leading-relaxed">
            Rule of the syndicate: Every friend must sponsor one outing in Cycle {currentRound} before anyone repeats.
          </p>
        </div>

        {/* Counter Pills or Unlock Next Round */}
        {isRoundComplete ? (
          <button
            onClick={handleNextRoundClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-xs sm:text-sm shadow-warm transition-all transform active:scale-98"
          >
            <Trophy className="w-4 h-4" />
            <span>Inaugurate Cycle {currentRound + 1}</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="bg-parchment-100 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 px-4 py-2 rounded-2xl text-center min-w-[84px]">
              <span className="block text-xl font-mono font-medium text-terracotta-600 dark:text-terracotta-400">
                {pendingCount}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-parchment-500 dark:text-parchment-400">
                Pending
              </span>
            </div>
            <div className="bg-parchment-100 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 px-4 py-2 rounded-2xl text-center min-w-[84px]">
              <span className="block text-xl font-mono font-medium text-emerald-600 dark:text-emerald-400">
                {completedCount}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-parchment-500 dark:text-parchment-400">
                Fulfilled
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar & Metric */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-parchment-500 dark:text-parchment-400">Syndicate Completion</span>
          <span className="font-medium text-parchment-900 dark:text-parchment-100">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-parchment-200 dark:bg-obsidian-100 rounded-full overflow-hidden p-0.5 border border-parchment-300/80 dark:border-obsidian-50">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              progressPercent === 100
                ? 'bg-emerald-600 dark:bg-emerald-500'
                : 'bg-terracotta-500 dark:bg-terracotta-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Editorial Footnote */}
      <div className="mt-4 pt-3.5 border-t border-parchment-200 dark:border-obsidian-100 flex flex-wrap items-center justify-between text-[11px] text-parchment-500 dark:text-parchment-400 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500"></span>
          <span>Queue prioritization: days since last treated × post-class sessions attended.</span>
        </div>
        <span className="font-serif italic">
          Target Venue: Better Coffee (Non-negotiable).
        </span>
      </div>
    </section>
  );
}
