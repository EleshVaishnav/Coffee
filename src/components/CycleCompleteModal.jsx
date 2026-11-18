import React from 'react';
import { Trophy, CheckCircle2, Archive, ArrowRight, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CycleCompleteModal({
  isOpen,
  onClose,
  completedCycle,
  totalMembers,
  onStartNextCycle,
}) {
  if (!isOpen) return null;

  const handleStart = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D46238', '#E8A87C', '#3D7A5A', '#B0A595'],
    });
    onStartNextCycle();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-500/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-parchment-100 dark:bg-obsidian-200 border-2 border-emerald-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-warm-lg text-center relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-parchment-500 hover:text-parchment-800 dark:text-parchment-400 dark:hover:text-parchment-100 bg-parchment-200/50 hover:bg-parchment-200 dark:bg-obsidian-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Trophy & Badge */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mb-4 shadow-warm-sm animate-bounce">
          🏆
        </div>

        <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold">
          Equilibrium Reached • 100% Compliance
        </span>

        <h3 className="text-2xl sm:text-3xl font-serif font-normal text-parchment-900 dark:text-parchment-50 tracking-tight mt-3">
          Cycle {completedCycle} Fulfilled!
        </h3>

        <p className="text-xs sm:text-sm text-parchment-600 dark:text-parchment-400 mt-2 leading-relaxed">
          All <strong>{totalMembers} colleagues</strong> have fulfilled their party duty in Cycle {completedCycle}. Nobody got a free pass!
        </p>

        {/* Archive Preservation Guarantee Box */}
        <div className="my-5 p-3.5 rounded-2xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 text-left text-xs font-mono space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
            <Archive className="w-4 h-4 flex-shrink-0" />
            <span>Permanent Archive Guarantee:</span>
          </div>
          <p className="text-[11px] text-parchment-600 dark:text-parchment-400 leading-normal pl-6">
            All Cycle {completedCycle} records, dates, tabs, and memories are <strong>permanently saved</strong> in the Outing Archives.
          </p>
        </div>

        {/* Action Button to Start Next Cycle */}
        <button
          onClick={handleStart}
          className="w-full py-3.5 px-5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white font-medium text-sm shadow-warm transition-all transform active:scale-98 flex items-center justify-center gap-2"
        >
          <span>Inaugurate Cycle {completedCycle + 1} 🚀</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
