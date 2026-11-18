import React, { useState } from 'react';
import { X, Check, AlertOctagon, ShieldAlert, ShieldCheck, Clock, Calendar, MapPin, IndianRupee, Users } from 'lucide-react';

export default function AdminClaimsPanel({
  isOpen,
  onClose,
  claims,
  members,
  onApproveClaim,
  onRejectClaim,
}) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'rejected' | 'approved'
  const [rejectingClaimId, setRejectingClaimId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  if (!isOpen) return null;

  const memberMap = new Map(members.map((m) => [m.id, m]));

  const pendingClaims = claims.filter((c) => c.status === 'pending');
  const approvedClaims = claims.filter((c) => c.status === 'approved');
  const rejectedClaims = claims.filter((c) => c.status === 'rejected');

  const displayedClaims =
    activeTab === 'pending'
      ? pendingClaims
      : activeTab === 'rejected'
      ? rejectedClaims
      : approvedClaims;

  const handleConfirmReject = (claimId) => {
    onRejectClaim(claimId, rejectReason.trim() || 'Claim rejected: Unverified or fraudulent ticket');
    setRejectingClaimId(null);
    setRejectReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-500/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-parchment-100 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-warm-lg relative my-8 transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-parchment-500 hover:text-parchment-800 dark:text-parchment-400 dark:hover:text-parchment-100 bg-parchment-200/50 hover:bg-parchment-200 dark:bg-obsidian-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-4 h-4 text-terracotta-500" />
          <h3 className="text-xl font-serif font-normal text-parchment-900 dark:text-parchment-50">
            Supreme Admin Inquest: Treat Claims
          </h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-terracotta-100 dark:bg-terracotta-900/50 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-200 dark:border-terracotta-800/60">
            Elesh's Jurisdiction
          </span>
        </div>
        <p className="text-xs text-parchment-600 dark:text-parchment-400 mb-5 leading-relaxed">
          Verify collegiate claims. Approved claims enter the official cycle ledger; rejected claims are blocked as fraud.
        </p>

        {/* Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-parchment-200/70 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 text-xs font-mono mb-5">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-parchment-50 dark:bg-obsidian-100 text-parchment-900 dark:text-parchment-50 shadow-warm-sm font-medium'
                : 'text-parchment-600 dark:text-parchment-400 hover:text-parchment-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Pending Review ({pendingClaims.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'rejected'
                ? 'bg-parchment-50 dark:bg-obsidian-100 text-parchment-900 dark:text-parchment-50 shadow-warm-sm font-medium'
                : 'text-parchment-600 dark:text-parchment-400 hover:text-parchment-900'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
            <span>Fraud / Rejected ({rejectedClaims.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'approved'
                ? 'bg-parchment-50 dark:bg-obsidian-100 text-parchment-900 dark:text-parchment-50 shadow-warm-sm font-medium'
                : 'text-parchment-600 dark:text-parchment-400 hover:text-parchment-900'
            }`}
          >
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>Verified ({approvedClaims.length})</span>
          </button>
        </div>

        {/* Claims List */}
        {displayedClaims.length === 0 ? (
          <div className="py-12 text-center font-serif italic text-parchment-500 text-sm bg-parchment-50 dark:bg-obsidian-300 rounded-2xl border border-parchment-200 dark:border-obsidian-100">
            {activeTab === 'pending'
              ? 'No pending tickets awaiting admin adjudication.'
              : activeTab === 'rejected'
              ? 'No fraudulent or rejected claims recorded.'
              : 'No verified tickets in this queue.'}
          </div>
        ) : (
          <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
            {displayedClaims.map((claim) => {
              const host = memberMap.get(claim.memberId);
              const isRejectingThis = rejectingClaimId === claim.id;

              return (
                <div
                  key={claim.id}
                  className="p-4 rounded-2xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 shadow-warm-sm flex flex-col justify-between gap-3"
                >
                  {/* Top: Host & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-parchment-100 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                        {host?.photo ? (
                          <img src={host.photo} alt={claim.memberName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{host?.avatar || '☕'}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-medium text-parchment-900 dark:text-parchment-50 text-sm">
                            {claim.memberName}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-parchment-200 dark:bg-obsidian-200 text-parchment-700 dark:text-parchment-300 border border-parchment-300 dark:border-obsidian-100">
                            Cycle {claim.round || 1} Ticket
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-parchment-500">
                          Submitted on {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : 'Today'}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {claim.status === 'pending' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                        ⏳ Awaiting Review
                      </span>
                    ) : claim.status === 'rejected' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50">
                        ❌ Blocked as Fraud
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                        ✅ Verified & Enacted
                      </span>
                    )}
                  </div>

                  {/* Claim Details */}
                  <div className="p-3 rounded-xl bg-parchment-100/60 dark:bg-obsidian-200/80 border border-parchment-200 dark:border-obsidian-100 text-xs font-mono space-y-1.5">
                    <div className="flex flex-wrap items-center gap-3 text-parchment-700 dark:text-parchment-300">
                      <span className="flex items-center gap-1 font-medium text-parchment-900 dark:text-parchment-100">
                        <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                        {claim.venue}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-parchment-400" />
                        {claim.date}
                      </span>
                      {claim.amount && (
                        <span className="flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {claim.amount}
                        </span>
                      )}
                    </div>

                    {/* Beneficiaries checklist */}
                    <div className="flex items-center gap-1 text-[11px] text-parchment-500">
                      <Users className="w-3.5 h-3.5 text-parchment-400 flex-shrink-0" />
                      <span>
                        Attendees ({claim.attendees?.length || 0}):{' '}
                        {claim.attendees?.map((id) => memberMap.get(id)?.name).filter(Boolean).join(', ')}
                      </span>
                    </div>

                    {claim.note && (
                      <p className="text-[11px] font-serif italic text-parchment-600 dark:text-parchment-400 mt-1">
                        "{claim.note}"
                      </p>
                    )}

                    {/* Show Rejection Reason if Rejected */}
                    {claim.status === 'rejected' && claim.reviewNote && (
                      <div className="mt-2 p-2 rounded-lg bg-red-100/60 dark:bg-red-950/60 border border-red-300 dark:border-red-900 text-red-800 dark:text-red-200 text-[11px]">
                        <strong>Admin Rejection Note:</strong> {claim.reviewNote}
                      </div>
                    )}
                  </div>

                  {/* Reject Reason Form (inline toggle) */}
                  {isRejectingThis && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 space-y-2 animate-in fade-in duration-200">
                      <label className="block text-[11px] font-mono text-red-700 dark:text-red-300 font-medium">
                        Specify Rejection Reason (Anti-Fraud Verdict):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. You did not go to Better Coffee! Unverified treat claim."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-parchment-50 dark:bg-obsidian-300 border border-red-300 dark:border-red-800 text-xs text-parchment-900 dark:text-parchment-100 font-sans focus:outline-none"
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setRejectingClaimId(null)}
                          className="px-2.5 py-1 text-xs text-parchment-600 hover:text-parchment-900 font-mono"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleConfirmReject(claim.id)}
                          className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-medium"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Admin Actions (Only for pending) */}
                  {claim.status === 'pending' && !isRejectingThis && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-parchment-200 dark:border-obsidian-100">
                      <button
                        onClick={() => {
                          setRejectingClaimId(claim.id);
                          setRejectReason('');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40 font-mono text-xs font-medium transition-all"
                      >
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>Reject as Fraud ❌</span>
                      </button>

                      <button
                        onClick={() => onApproveClaim(claim.id)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-medium shadow-warm transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Verify Party ✅</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
