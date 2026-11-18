import React from 'react';
import { Target, Clock, Coffee, SkipForward, Check, AlertCircle } from 'lucide-react';

export default function NextInLineCard({
  nextInLine,
  currentRound,
  onRecordTreatForMember,
  onPassTurn,
}) {
  if (!nextInLine) {
    return (
      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-3xl p-7 text-center shadow-warm">
        <div className="w-11 h-11 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl mb-3">
          ✓
        </div>
        <h3 className="text-xl font-serif font-medium text-parchment-900 dark:text-parchment-50">
          Cycle {currentRound} Rotation Satisfied
        </h3>
        <p className="text-xs text-parchment-600 dark:text-parchment-400 mt-1 max-w-md mx-auto">
          Every colleague has sponsored their mandated share. Proceed to inaugurate the next cycle.
        </p>
      </div>
    );
  }

  const isNeverGiven = nextInLine.totalGiven === 0;

  return (
    <div className="bg-parchment-50 dark:bg-obsidian-200 border border-terracotta-300/60 dark:border-terracotta-900/40 rounded-3xl p-5 sm:p-7 shadow-warm relative overflow-hidden transition-all">
      {/* Editorial Marker */}
      <div className="absolute top-5 right-5 sm:right-7 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta-100 dark:bg-terracotta-900/50 text-terracotta-700 dark:text-terracotta-300 font-mono text-[10px] uppercase tracking-wider border border-terracotta-200 dark:border-terracotta-800/60">
        <Target className="w-3 h-3 text-terracotta-500" /> Host Designate
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Profile & Editorial Details */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-parchment-100 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 flex items-center justify-center text-3xl sm:text-4xl shadow-warm-sm flex-shrink-0 overflow-hidden">
            {nextInLine.photo ? (
              <img
                src={nextInLine.photo}
                alt={nextInLine.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{nextInLine.avatar || '☕'}</span>
            )}
          </div>

          <div>
            <div className="text-[11px] font-mono text-terracotta-600 dark:text-terracotta-400 uppercase tracking-wider">
              Next Bill Sponsee
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-normal text-parchment-900 dark:text-parchment-50 tracking-tight mt-0.5">
              {nextInLine.name}
            </h3>

            {/* Micro Metrics */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-parchment-100 dark:bg-obsidian-300 border border-parchment-200 dark:border-obsidian-100 text-parchment-700 dark:text-parchment-300">
                <Coffee className="w-3.5 h-3.5 text-terracotta-500" />
                <span>Attended <strong>{nextInLine.attendedInCurrentRound}</strong> treats in Cycle {currentRound}</span>
              </span>

              {isNeverGiven ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Treat debt: Zero historical treats sponsored</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-parchment-100 dark:bg-obsidian-300 border border-parchment-200 dark:border-obsidian-100 text-parchment-700 dark:text-parchment-300">
                  <Clock className="w-3.5 h-3.5 text-parchment-500" />
                  <span>Last sponsored <strong>{nextInLine.daysSinceLastGiven} days ago</strong></span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2 flex-shrink-0 justify-end">
          <button
            onClick={() => onRecordTreatForMember(nextInLine.id)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white font-medium text-xs sm:text-sm shadow-warm transition-all transform active:scale-98"
          >
            <Check className="w-4 h-4" />
            <span>Record {nextInLine.name}'s Treat</span>
          </button>

          <button
            onClick={() => onPassTurn(nextInLine.id)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-parchment-100 hover:bg-parchment-200 dark:bg-obsidian-300 dark:hover:bg-obsidian-100 border border-parchment-300 dark:border-obsidian-100 text-parchment-700 dark:text-parchment-300 text-xs font-medium transition-all"
            title="Absent or broke today? Defer to adjacent member while preserving debt rank"
          >
            <SkipForward className="w-3.5 h-3.5 text-parchment-500" />
            <span>Defer Turn (Absent / Broke)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
