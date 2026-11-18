import React, { useState } from 'react';
import { Calendar, MapPin, IndianRupee, Users, ShieldCheck, Archive, Filter } from 'lucide-react';

export default function PartyHistory({ parties, members, currentRound }) {
  const [selectedCycle, setSelectedCycle] = useState('all'); // 'all' or number
  const memberMap = new Map(members.map((m) => [m.id, m]));

  const sortedParties = [...parties].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Extract distinct rounds
  const availableRounds = Array.from(new Set(parties.map((p) => p.round || 1))).sort((a, b) => b - a);

  const filteredParties = selectedCycle === 'all'
    ? sortedParties
    : sortedParties.filter((p) => (p.round || 1) === Number(selectedCycle));

  const totalSpent = filteredParties.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <section className="bg-parchment-50 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 rounded-3xl p-5 sm:p-7 shadow-warm transition-all">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
              <Archive className="w-3 h-3" /> Permanent Syndicate Archives
            </span>
          </div>
          <h3 className="text-xl font-serif font-normal text-parchment-900 dark:text-parchment-50">
            Outing Archives & Past Cycles Ledger
          </h3>
          <p className="text-xs text-parchment-600 dark:text-parchment-400 mt-0.5">
            Every past treat across all cycles is permanently stored and verified
          </p>
        </div>

        {/* Cycle Filter Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="inline-flex p-1 rounded-xl bg-parchment-200/70 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 text-xs font-mono">
            <button
              onClick={() => setSelectedCycle('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedCycle === 'all'
                  ? 'bg-parchment-50 dark:bg-obsidian-100 text-parchment-900 dark:text-parchment-50 shadow-warm-sm font-medium'
                  : 'text-parchment-600 dark:text-parchment-400 hover:text-parchment-900'
              }`}
            >
              All ({parties.length})
            </button>

            {availableRounds.map((rnd) => {
              const count = parties.filter((p) => (p.round || 1) === rnd).length;
              return (
                <button
                  key={rnd}
                  onClick={() => setSelectedCycle(rnd.toString())}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedCycle === rnd.toString()
                      ? 'bg-parchment-50 dark:bg-obsidian-100 text-parchment-900 dark:text-parchment-50 shadow-warm-sm font-medium'
                      : 'text-parchment-600 dark:text-parchment-400 hover:text-parchment-900'
                  }`}
                >
                  Cycle {rnd} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cycle Summary Badge when a specific cycle is selected */}
      {selectedCycle !== 'all' && (
        <div className="mb-4 p-3.5 rounded-2xl bg-parchment-100 dark:bg-obsidian-300 border border-parchment-200 dark:border-obsidian-100 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-parchment-900 dark:text-parchment-100 font-medium">
              Cycle {selectedCycle} Archive: {filteredParties.length} Treats Recorded
            </span>
          </div>
          {totalSpent > 0 && (
            <span className="text-emerald-700 dark:text-emerald-400">
              Total Tab: ₹{totalSpent}
            </span>
          )}
        </div>
      )}

      {/* Outings List */}
      {filteredParties.length === 0 ? (
        <div className="py-10 text-center font-serif italic text-parchment-500 text-sm">
          {parties.length === 0
            ? "No historical outings recorded. Record today's coffee to start Cycle 1!"
            : "No outings logged in this specific cycle."}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredParties.map((party) => {
            const host = memberMap.get(party.hostId);
            const attendeeCount = party.attendees ? party.attendees.length : 0;
            const isBetterCoffee = party.venue.toLowerCase().includes('better coffee');

            return (
              <div
                key={party.id}
                className="p-4 rounded-2xl bg-parchment-100/50 dark:bg-obsidian-300/40 border border-parchment-200 dark:border-obsidian-100 hover:border-parchment-300 dark:hover:border-obsidian-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Host & Outing info */}
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-parchment-50 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 text-parchment-700 dark:text-parchment-300 flex items-center justify-center text-xl flex-shrink-0 shadow-warm-sm overflow-hidden">
                    {host?.photo ? (
                      <img src={host.photo} alt={host.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{host?.avatar || '☕'}</span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif font-medium text-parchment-900 dark:text-parchment-50 text-sm">
                        {host ? host.name : 'Unknown Host'}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-parchment-200/80 dark:bg-obsidian-200 text-parchment-700 dark:text-parchment-300 border border-parchment-300 dark:border-obsidian-100 font-medium">
                        Cycle {party.round || 1}
                      </span>
                      {isBetterCoffee && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-200 dark:border-terracotta-800/60">
                          Sovereign Venue 👑
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-parchment-500 dark:text-parchment-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-parchment-800 dark:text-parchment-200">
                        <MapPin className="w-3 h-3 text-terracotta-500" />
                        {party.venue}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {party.date}
                      </span>
                      {party.amount && (
                        <span className="flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400 font-medium">
                          <IndianRupee className="w-3 h-3" />
                          {party.amount}
                        </span>
                      )}
                    </div>

                    {party.note && (
                      <p className="text-xs text-parchment-600 dark:text-parchment-400 font-serif italic mt-1.5 leading-relaxed">
                        "{party.note}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Attendees pill */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto text-[11px] font-mono text-parchment-600 dark:text-parchment-400 bg-parchment-200/60 dark:bg-obsidian-200 px-3 py-1.5 rounded-xl border border-parchment-300/80 dark:border-obsidian-100">
                  <Users className="w-3.5 h-3.5 text-parchment-500" />
                  <span>{attendeeCount} fellows present</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
