import React from 'react';
import { X, Scale, AlertOctagon, CheckCircle2, Coffee, Sparkles } from 'lucide-react';

export default function AxiomModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-500/60 backdrop-blur-sm">
      <div className="bg-parchment-100 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-warm-lg relative transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-parchment-500 hover:text-parchment-800 dark:text-parchment-400 dark:hover:text-parchment-100 bg-parchment-200/50 hover:bg-parchment-200 dark:bg-obsidian-100 dark:hover:bg-obsidian-50 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-terracotta-100 dark:bg-terracotta-900/50 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-200 dark:border-terracotta-800/60">
            Axiom 1.1 • Collegiate Empirical Study
          </span>
        </div>
        <h3 className="text-2xl font-serif font-normal text-parchment-900 dark:text-parchment-50 tracking-tight">
          A Formal Inquest: <span className="italic font-serif text-terracotta-600 dark:text-terracotta-400">UFO Cafe ≠ Better Coffee</span>
        </h3>
        <p className="text-xs text-parchment-600 dark:text-parchment-400 mt-1 leading-relaxed">
          A peer-reviewed analysis on why the squad keeps attempting to divert to UFO Cafe despite overwhelming gastronomic evidence.
        </p>

        {/* Mathematical Expression Banner */}
        <div className="my-5 p-4 rounded-2xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 text-center font-mono">
          <div className="text-xl sm:text-2xl font-medium tracking-wide text-parchment-900 dark:text-parchment-100">
            <span className="text-red-500 dark:text-red-400 line-through decoration-2">UFO Cafe</span>
            <span className="mx-3 text-terracotta-500 font-bold">≠</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold underline decoration-terracotta-500 decoration-wavy">
              Better Coffee
            </span>
          </div>
          <span className="text-[11px] text-parchment-500 dark:text-parchment-400 mt-1 block">
            Q.E.D. — Verified across multiple post-lecture sanity checks.
          </span>
        </div>

        {/* Comparative Examination */}
        <div className="space-y-3 my-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40">
              <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 font-semibold mb-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>UFO Cafe (The Illusion)</span>
              </div>
              <ul className="space-y-1.5 text-parchment-700 dark:text-parchment-300">
                <li>• Lukewarm beans with an identity crisis.</li>
                <li>• Squad goes there solely due to unexamined peer momentum.</li>
                <li>• Causes immediate post-class regret.</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Better Coffee (The Sovereign Choice)</span>
              </div>
              <ul className="space-y-1.5 text-parchment-700 dark:text-parchment-300">
                <li>• Authentic roast, rich crema, proper cold brews.</li>
                <li>• Promotes academic clarity & civilized debate.</li>
                <li>• Where the host's money actually deserves to be spent.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer & Affirmation */}
        <div className="mt-5 pt-4 border-t border-parchment-300 dark:border-obsidian-100 flex items-center justify-between gap-3">
          <span className="text-[11px] text-parchment-500 dark:text-parchment-400 italic">
            "Taste buds are a privilege; spend them wisely."
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-xs shadow-warm transition-all"
          >
            I Swear Allegiance to Better Coffee
          </button>
        </div>
      </div>
    </div>
  );
}
