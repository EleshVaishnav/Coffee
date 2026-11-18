import React, { useState, useEffect } from 'react';
import { X, Check, Users, MapPin, IndianRupee, Calendar, FileText, AlertTriangle, ShieldAlert, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

const VENUE_SUGGESTIONS = [
  'Better Coffee (The Sovereign Choice 👑)',
  'UFO Cafe (Gas Disparity ❌)',
  'Campus Nescafe',
  'Tapri Outside Gate 2',
  'Central Canteen',
  'Maggi Point Hub',
];

export default function LogPartyModal({
  isOpen,
  onClose,
  members,
  currentRound,
  prefilledHostId,
  currentUser,
  onOpenLogin,
  onSubmitClaim,
  onSavePartyDirect,
}) {
  const [hostId, setHostId] = useState('');
  const [venue, setVenue] = useState('Better Coffee');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [note, setNote] = useState('');

  const isUfoDetected = venue.toLowerCase().includes('ufo');
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (isOpen) {
      if (currentUser && !isAdmin) {
        setHostId(currentUser.memberId || '');
      } else {
        setHostId(prefilledHostId || (members[0]?.id || ''));
      }
      setAttendees(members.map((m) => m.id));
    }
  }, [isOpen, prefilledHostId, members, currentUser, isAdmin]);

  if (!isOpen) return null;

  const toggleAttendee = (id) => {
    if (attendees.includes(id)) {
      setAttendees(attendees.filter((a) => a !== id));
    } else {
      setAttendees([...attendees, id]);
    }
  };

  const selectAll = () => setAttendees(members.map((m) => m.id));
  const deselectAll = () => setAttendees([hostId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hostId) return;

    if (!currentUser) {
      onOpenLogin();
      return;
    }

    const finalAttendees = Array.from(new Set([...attendees, hostId]));
    const hostMember = members.find((m) => m.id === hostId);

    if (isAdmin) {
      // Admin can directly enact party
      const newParty = {
        id: 'p_' + Date.now(),
        round: currentRound,
        hostId,
        venue: venue.trim() || 'Better Coffee',
        date,
        amount: amount ? Number(amount) : null,
        attendees: finalAttendees,
        note: note.trim() || 'Post-class coffee & collegial discourse',
      };

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D46238', '#E8A87C', '#3D7A5A', '#B0A595'],
      });

      onSavePartyDirect(newParty);
      onClose();
    } else {
      // Regular member raises a ticket/claim
      const newClaim = {
        id: 'claim_' + Date.now(),
        memberId: hostId,
        memberName: hostMember ? hostMember.name : currentUser.name,
        round: currentRound,
        venue: venue.trim() || 'Better Coffee',
        date,
        amount: amount ? Number(amount) : null,
        attendees: finalAttendees,
        note: note.trim() || 'Treat sponsored for the fellows',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      onSubmitClaim(newClaim);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-500/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-parchment-100 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-warm-lg relative my-8 transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-parchment-500 hover:text-parchment-800 dark:text-parchment-400 dark:hover:text-parchment-100 bg-parchment-200/50 hover:bg-parchment-200 dark:bg-obsidian-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">☕</span>
          <h3 className="text-xl font-serif font-normal text-parchment-900 dark:text-parchment-50">
            {isAdmin ? 'Record / Enact Treat (Admin)' : 'Raise Treat Claim Ticket'}
          </h3>
        </div>
        <p className="text-xs text-parchment-600 dark:text-parchment-400 mb-5 leading-relaxed">
          {isAdmin
            ? `Admin Jurisdiction: Directly enact this treat into Cycle ${currentRound} ledger.`
            : `Submit your treat claim. It will be reviewed and verified by Elesh (Admin) before entering Cycle ${currentRound}.`}
        </p>

        {/* Not Logged In Notice */}
        {!currentUser && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-mono">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Authentication required to file ticket</span>
            </div>
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-2.5 py-1 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white font-mono text-[11px] font-medium"
            >
              Sign In
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Host Selector */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-parchment-700 dark:text-parchment-300 mb-1.5">
              Sponsoring Fellow (Claimant)
            </label>
            {isAdmin ? (
              <select
                value={hostId}
                onChange={(e) => setHostId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 text-parchment-900 dark:text-parchment-100 font-sans text-xs sm:text-sm focus:outline-none focus:border-terracotta-500 transition-colors"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-3.5 py-2.5 rounded-xl bg-parchment-200/70 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 text-parchment-900 dark:text-parchment-100 font-sans text-xs sm:text-sm flex items-center justify-between">
                <span>{members.find((m) => m.id === hostId)?.name || currentUser?.name || 'You'}</span>
                <span className="text-[10px] font-mono text-parchment-500">Locked to your ID</span>
              </div>
            )}
          </div>

          {/* Venue Selection */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-parchment-700 dark:text-parchment-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Sanctioned Venue</span>
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Better Coffee"
              className="w-full px-3.5 py-2 rounded-xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 text-parchment-900 dark:text-parchment-100 text-xs sm:text-sm focus:outline-none focus:border-terracotta-500 mb-2 font-sans transition-colors"
              required
            />

            {/* Quick Venue Chips */}
            <div className="flex flex-wrap gap-1.5">
              {VENUE_SUGGESTIONS.map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setVenue(v.includes('Better Coffee') ? 'Better Coffee' : v.includes('UFO') ? 'UFO Cafe' : v)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition-all ${
                    venue.toLowerCase().includes(v.toLowerCase().split(' ')[0])
                      ? 'bg-terracotta-50 dark:bg-terracotta-950/40 border-terracotta-300 dark:border-terracotta-800 text-terracotta-700 dark:text-terracotta-300 font-medium'
                      : 'bg-parchment-50 dark:bg-obsidian-300 border-parchment-200 dark:border-obsidian-100 text-parchment-600 dark:text-parchment-400 hover:text-parchment-800'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Sarcastic UFO Warning */}
            {isUfoDetected && (
              <div className="mt-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-mono font-medium text-red-800 dark:text-red-200">
                    Axiomatic Violation: UFO Cafe ≠ Better Coffee ❌
                  </strong>
                  Warning: Elesh (Admin) will likely reject this claim as fraud. Better Coffee is the only recognized venue!
                </div>
              </div>
            )}
          </div>

          {/* Date & Optional Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-parchment-700 dark:text-parchment-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-parchment-500" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 text-parchment-900 dark:text-parchment-100 text-xs focus:outline-none focus:border-terracotta-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-parchment-700 dark:text-parchment-300 mb-1.5 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-parchment-500" /> Total Tab (Optional)
              </label>
              <input
                type="number"
                placeholder="₹ Tab Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 text-parchment-900 dark:text-parchment-100 text-xs focus:outline-none focus:border-terracotta-500 font-mono"
              />
            </div>
          </div>

          {/* Attendees Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-parchment-700 dark:text-parchment-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-terracotta-500" />
                <span>Beneficiaries Attending ({attendees.length}/{members.length})</span>
              </label>
              <div className="text-[11px] font-mono space-x-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-terracotta-600 dark:text-terracotta-400 hover:underline"
                >
                  All
                </button>
                <span className="text-parchment-400">|</span>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="text-parchment-500 hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="max-h-36 overflow-y-auto p-2 rounded-xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 grid grid-cols-2 gap-1.5">
              {members.map((m) => {
                const isChecked = attendees.includes(m.id);
                const isHost = m.id === hostId;

                return (
                  <label
                    key={m.id}
                    className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer text-xs transition-all ${
                      isChecked
                        ? 'bg-parchment-200/80 dark:bg-obsidian-100 text-parchment-900 dark:text-parchment-100'
                        : 'text-parchment-400 dark:text-parchment-600 hover:text-parchment-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isHost}
                      onChange={() => toggleAttendee(m.id)}
                      className="rounded border-parchment-300 text-terracotta-500 focus:ring-0"
                    />
                    <span className="truncate font-sans">
                      {m.name} {isHost && '(Host)'}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Note / Memo */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-parchment-700 dark:text-parchment-300 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-parchment-500" /> Treat Note / Receipt Reference
            </label>
            <input
              type="text"
              placeholder="e.g. Paid via UPI at Better Coffee counter, ordered 7 iced americanos"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 text-parchment-900 dark:text-parchment-100 text-xs focus:outline-none focus:border-terracotta-500 font-sans"
            />
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white font-medium text-xs sm:text-sm shadow-warm transition-all transform active:scale-98"
          >
            {isAdmin
              ? 'Enact Treat Immediately (Admin Verify) ✨'
              : 'Submit Claim Ticket (Awaiting Elesh\'s Approval) 📋'}
          </button>
        </form>
      </div>
    </div>
  );
}
