import React, { useState } from 'react';
import { Check, Clock, Coffee, AlertCircle, ArrowUpRight, UserPlus } from 'lucide-react';

export default function MembersList({
  memberStats,
  currentRound,
  nextInLineId,
  isAdmin,
  onOpenAddMemberModal,
  onRecordTreatForMember,
}) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'completed' | 'all'

  const pendingMembers = memberStats.filter((m) => !m.hasGivenInCurrentRound);
  const completedMembers = memberStats.filter((m) => m.hasGivenInCurrentRound);

  const displayedMembers =
    activeTab === 'pending'
      ? pendingMembers
      : activeTab === 'completed'
      ? completedMembers
      : memberStats;

  return (
    <section className="bg-parchment-50 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 rounded-3xl p-5 sm:p-7 shadow-warm transition-all">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-serif font-normal text-parchment-900 dark:text-parchment-50">
              Colleague Roster & Rotational Ledger
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-parchment-200 dark:bg-obsidian-100 text-parchment-600 dark:text-parchment-300 border border-parchment-300 dark:border-obsidian-50">
              {memberStats.length} fellows
            </span>
            {isAdmin && (
              <button
                onClick={onOpenAddMemberModal}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-300 dark:border-terracotta-800 hover:bg-terracotta-200 transition-colors"
                title="Admin Jurisdiction: Enroll new fellow"
              >
                <UserPlus className="w-3 h-3" />
                <span>+ Add Fellow</span>
              </button>
            )}
          </div>
          <p className="text-xs text-parchment-600 dark:text-parchment-400 mt-0.5">
            Individual rotational compliance for Cycle {currentRound}
          </p>
        </div>

        {/* Understated Filter Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-parchment-200/70 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-parchment-50 dark:bg-obsidian-100 text-parchment-900 dark:text-parchment-50 shadow-warm-sm'
                : 'text-parchment-600 dark:text-parchment-400 hover:text-parchment-900 dark:hover:text-parchment-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Pending ({pendingMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'completed'
                ? 'bg-parchment-50 dark:bg-obsidian-100 text-parchment-900 dark:text-parchment-50 shadow-warm-sm'
                : 'text-parchment-600 dark:text-parchment-400 hover:text-parchment-900 dark:hover:text-parchment-200'
            }`}
          >
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Fulfilled ({completedMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-parchment-50 dark:bg-obsidian-100 text-parchment-900 dark:text-parchment-50 shadow-warm-sm'
                : 'text-parchment-600 dark:text-parchment-400 hover:text-parchment-900 dark:hover:text-parchment-200'
            }`}
          >
            All ({memberStats.length})
          </button>
        </div>
      </div>

      {/* Grid of Member Cards */}
      {displayedMembers.length === 0 ? (
        <div className="py-12 text-center text-parchment-500 font-serif italic text-sm">
          No records found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {displayedMembers.map((member) => {
            const isNext = member.id === nextInLineId;
            const isCompleted = member.hasGivenInCurrentRound;

            return (
              <div
                key={member.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isNext
                    ? 'bg-terracotta-50/50 dark:bg-terracotta-950/20 border-terracotta-300 dark:border-terracotta-800/80 shadow-warm'
                    : isCompleted
                    ? 'bg-parchment-100/40 dark:bg-obsidian-300/40 border-parchment-200 dark:border-obsidian-100'
                    : 'bg-parchment-100/70 dark:bg-obsidian-300/70 border-parchment-300/80 dark:border-obsidian-100 hover:border-parchment-400 dark:hover:border-obsidian-50'
                }`}
              >
                {/* Header Profile */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-parchment-50 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 flex items-center justify-center text-xl flex-shrink-0 shadow-warm-sm overflow-hidden">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{member.avatar || '☕'}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-serif font-medium text-parchment-900 dark:text-parchment-50 text-base leading-tight">
                            {member.name}
                          </h4>
                          {isNext && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-medium uppercase tracking-wider bg-terracotta-500 text-white">
                              Next
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Tag */}
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 flex-shrink-0">
                        <Check className="w-3 h-3" /> Fulfilled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40 flex-shrink-0">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </div>

                  {/* Context Info Ledger */}
                  <div className="my-2.5 p-2.5 rounded-xl bg-parchment-50 dark:bg-obsidian-200/80 border border-parchment-200 dark:border-obsidian-100 text-xs font-mono space-y-1">
                    {isCompleted ? (
                      <div className="text-[11px]">
                        <span className="text-parchment-500 dark:text-parchment-400">Venue: </span>
                        <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                          {member.roundPartyVenue || 'Better Coffee'}
                        </span>
                        <span className="text-parchment-400 dark:text-parchment-500 block text-[10px] mt-0.5">
                          Date: {member.roundPartyDate || 'Logged'}
                        </span>
                      </div>
                    ) : (
                      <div className="text-[11px] space-y-1">
                        <div className="flex justify-between items-center text-parchment-600 dark:text-parchment-400">
                          <span>Attended this round:</span>
                          <span className="text-parchment-900 dark:text-parchment-100 font-semibold">{member.attendedInCurrentRound} outings</span>
                        </div>
                        <div className="flex justify-between items-center text-parchment-600 dark:text-parchment-400">
                          <span>Last treated:</span>
                          <span className="text-terracotta-600 dark:text-terracotta-400 font-medium">
                            {member.totalGiven === 0
                              ? 'Never yet (Defaulter)'
                              : `${member.daysSinceLastGiven}d ago`}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-parchment-200 dark:border-obsidian-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-parchment-500 dark:text-parchment-400">
                    Lifetime: <strong className="text-parchment-800 dark:text-parchment-200">{member.totalGiven}</strong>
                  </span>

                  {!isCompleted && (
                    <button
                      onClick={() => onRecordTreatForMember(member.id)}
                      className="text-terracotta-600 hover:text-terracotta-700 dark:text-terracotta-400 dark:hover:text-terracotta-300 font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Mark Given</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
