import React, { useState, useEffect } from 'react';
import { INITIAL_MEMBERS, INITIAL_PARTIES } from './data/initialData';
import { computeGroupStats } from './utils/rotationLogic';
import Navbar from './components/Navbar';
import RoundProgress from './components/RoundProgress';
import NextInLineCard from './components/NextInLineCard';
import MembersList from './components/MembersList';
import SpinWheelModal from './components/SpinWheelModal';
import LogPartyModal from './components/LogPartyModal';
import WhatsAppShareModal from './components/WhatsAppShareModal';
import AddMemberModal from './components/AddMemberModal';
import AxiomModal from './components/AxiomModal';
import CycleCompleteModal from './components/CycleCompleteModal';
import PartyHistory from './components/PartyHistory';
import LoginModal from './components/LoginModal';
import AdminClaimsPanel from './components/AdminClaimsPanel';
import CloudDatabaseModal from './components/CloudDatabaseModal';
import { DEFAULT_ACCOUNTS } from './data/credentials';
import { isSupabaseConfigured } from './services/supabaseClient';
import {
  fetchRemoteSyndicateData,
  syncPartyToCloud,
  syncClaimToCloud,
  updateClaimStatusInCloud,
  syncRoundToCloud,
  syncMemberToCloud,
  removeMemberFromCloud,
  subscribeToRealtimeSyndicate,
} from './services/databaseService';
import { RotateCcw, Scale, ArrowRight, ShieldCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';

const STORAGE_KEYS = {
  MEMBERS: 'chaiapp_squad_v6',
  PARTIES: 'chaiapp_parties_v6',
  ROUND: 'chaiapp_round_v6',
  GROUP_NAME: 'chaiapp_groupname_v6',
  THEME: 'chaiapp_theme_v6',
  CLAIMS: 'chaiapp_claims_v7',
  USER: 'chaiapp_user_v8',
};

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  });

  const [groupName, setGroupName] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.GROUP_NAME) || 'Better Coffee Syndicate';
  });

  const [currentRound, setCurrentRound] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROUND);
    return saved ? parseInt(saved, 10) : 1;
  });

  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return INITIAL_MEMBERS;
  });

  const [parties, setParties] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PARTIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {}
    return INITIAL_PARTIES;
  });

  // User & Claims States - Starts in active public browsing mode without requiring sign-in
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null; // Public active browsing by default
  });

  const [claims, setClaims] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLAIMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Modal States
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [prefilledHostId, setPrefilledHostId] = useState('');
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAxiomModalOpen, setIsAxiomModalOpen] = useState(false);
  const [isCycleCompleteModalOpen, setIsCycleCompleteModalOpen] = useState(false);
  const [completedCycleNum, setCompletedCycleNum] = useState(1);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminClaimsOpen, setIsAdminClaimsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Manual turn skip offset for NextInLine
  const [passedHostIds, setPassedHostIds] = useState([]);

  // Cloud Database Sync States
  const [isCloudConnected, setIsCloudConnected] = useState(() => isSupabaseConfigured());
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  // Cloud Database Sync & Realtime Subscription
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsCloudConnected(false);
      return;
    }

    setIsCloudConnected(true);

    const loadRemote = async () => {
      const remote = await fetchRemoteSyndicateData();
      if (remote) {
        if (remote.members && remote.members.length > 0) setMembers(remote.members);
        if (remote.parties) setParties(remote.parties);
        if (remote.claims) setClaims(remote.claims);
        if (remote.currentRound) setCurrentRound(remote.currentRound);
        if (remote.groupName) setGroupName(remote.groupName);
      }
    };

    loadRemote();

    // Subscribe to multi-phone realtime updates
    const unsubscribe = subscribeToRealtimeSyndicate(() => {
      loadRemote();
    });

    return () => {
      unsubscribe();
    };
  }, [isCloudConnected]);

  // Theme Sync
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('transition-theme');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Clean up obsolete storage keys from previous legacy migrations
  useEffect(() => {
    [
      'chaiapp_members_v1', 'chaiapp_parties_v1',
      'chaiapp_members_v2', 'chaiapp_parties_v2',
      'chaiapp_members_v3', 'chaiapp_parties_v3',
      'chaiapp_squad_v4', 'chaiapp_parties_v4',
      'chaiapp_squad_v5', 'chaiapp_parties_v5'
    ].forEach(k => {
      localStorage.removeItem(k);
    });
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // LocalStorage Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARTIES, JSON.stringify(parties));
  }, [parties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROUND, currentRound.toString());
  }, [currentRound]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GROUP_NAME, groupName);
  }, [groupName]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
  }, [claims]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Compute rotation stats
  const stats = computeGroupStats(members, parties, currentRound);

  // Filter passed members if requested
  let activeNextInLine = stats.nextInLine;
  if (passedHostIds.length > 0 && stats.pendingMembers.length > 1) {
    const candidate = stats.pendingMembers.find((m) => !passedHostIds.includes(m.id));
    if (candidate) {
      activeNextInLine = candidate;
    }
  }

  // Handle User Login & Logout
  const handleLogin = (account) => {
    setCurrentUser(account);
    setToastMessage(`Signed in as ${account.name} (${account.role === 'admin' ? 'Supreme Admin 👑' : 'Syndicate Fellow'})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToastMessage('Signed out from syndicate session.');
  };

  // Handle Regular Member Raising a Claim Ticket
  const handleSubmitClaim = (newClaim) => {
    setClaims((prev) => [newClaim, ...prev]);
    if (isCloudConnected) {
      syncClaimToCloud(newClaim);
    }
    setToastMessage(`Treat claim submitted! Awaiting Elesh's admin review.`);
  };

  // Handle Admin Approving a Claim
  const handleApproveClaim = (claimId) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;

    // Update claim status to approved
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: 'approved', reviewNote: 'Verified by Admin Elesh' } : c))
    );

    if (isCloudConnected) {
      updateClaimStatusInCloud(claimId, 'approved', 'Verified by Admin Elesh');
    }

    // Officially record verified party into parties array
    const verifiedParty = {
      id: 'p_' + Date.now(),
      round: claim.round,
      hostId: claim.memberId,
      venue: claim.venue,
      date: claim.date,
      amount: claim.amount,
      attendees: claim.attendees,
      note: claim.note,
    };

    handleSaveParty(verifiedParty);
    setToastMessage(`Party claim by ${claim.memberName} verified & enacted into Cycle ${claim.round}! ✅`);
  };

  // Handle Admin Rejecting a Claim
  const handleRejectClaim = (claimId, reason) => {
    const claim = claims.find((c) => c.id === claimId);
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: 'rejected', reviewNote: reason } : c))
    );

    if (isCloudConnected) {
      updateClaimStatusInCloud(claimId, 'rejected', reason);
    }

    setToastMessage(`Claim by ${claim?.memberName || 'colleague'} rejected as fraud ❌`);
  };
  const handlePassTurn = (memberId) => {
    setPassedHostIds((prev) => [...prev, memberId]);
  };

  // Handle Record Treat click for a specific person
  const handleRecordTreatForMember = (memberId) => {
    setPrefilledHostId(memberId);
    if (!currentUser) {
      setToastMessage('Please sign in to log or claim this treat.');
      setIsLoginModalOpen(true);
      return;
    }
    setIsLogModalOpen(true);
  };

  // Handle Save Party (and check if it completes current cycle)
  const handleSaveParty = (newParty) => {
    const updatedParties = [newParty, ...parties];
    setParties(updatedParties);
    setPassedHostIds([]);

    if (isCloudConnected) {
      syncPartyToCloud(newParty);
    }

    // Check if this party fulfills the current cycle
    const currentRoundParties = updatedParties.filter((p) => p.round === currentRound);
    const hostIds = new Set(currentRoundParties.map((p) => p.hostId));
    if (hostIds.size === members.length && members.length > 0) {
      setCompletedCycleNum(currentRound);
      setIsCycleCompleteModalOpen(true);
    }
  };

  // Handle Start Next Round
  const handleStartNextRound = () => {
    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);
    setPassedHostIds([]);

    if (isCloudConnected) {
      syncRoundToCloud(nextRound);
    }
  };

  // Reset to initial collegiate data (Admin only)
  const handleResetData = () => {
    if (currentUser?.role !== 'admin') {
      setToastMessage('Jurisdiction restricted: Only Admin (Elesh) can reset records.');
      return;
    }
    if (window.confirm('Reset all syndicate archives back to original collegiate data?')) {
      setMembers(INITIAL_MEMBERS);
      setParties(INITIAL_PARTIES);
      setCurrentRound(1);
      setPassedHostIds([]);
      setToastMessage('Syndicate records reset to collegiate defaults.');
    }
  };

  // Add Member (Strictly restricted to Supreme Admin Elesh)
  const handleAddMember = (newMember) => {
    if (currentUser?.role !== 'admin') {
      setToastMessage('Access Denied: Only Admin (Elesh) can add new members.');
      return;
    }
    setMembers((prev) => [...prev, newMember]);
    if (isCloudConnected) {
      syncMemberToCloud(newMember);
    }
    setToastMessage(`Enrolled ${newMember.name} into syndicate roster.`);
  };

  // Remove Member (Strictly restricted to Supreme Admin Elesh)
  const handleRemoveMember = (id) => {
    if (currentUser?.role !== 'admin') {
      setToastMessage('Access Denied: Only Admin (Elesh) can remove members.');
      return;
    }
    if (window.confirm('Expel this fellow from the rotational syndicate?')) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      if (isCloudConnected) {
        removeMemberFromCloud(id);
      }
      setToastMessage('Fellow removed from rotational roster.');
    }
  };

  const lastParty = parties.length > 0 ? parties[0] : null;
  const lastPartyHost = lastParty ? members.find((m) => m.id === lastParty.hostId) : null;

  return (
    <div className="min-h-screen bg-parchment-100 dark:bg-obsidian-400 text-parchment-900 dark:text-parchment-50 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        groupName={groupName}
        currentRound={currentRound}
        theme={theme}
        currentUser={currentUser}
        pendingClaimsCount={claims.filter((c) => c.status === 'pending').length}
        isCloudConnected={isCloudConnected}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
        onToggleTheme={toggleTheme}
        onOpenLogModal={() => {
          if (!currentUser) {
            setToastMessage('Please sign in to claim or record a treat.');
            setIsLoginModalOpen(true);
            return;
          }
          setPrefilledHostId(activeNextInLine?.id || '');
          setIsLogModalOpen(true);
        }}
        onOpenSpinWheel={() => setIsSpinWheelOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenAddMemberModal={() => {
          if (currentUser?.role !== 'admin') {
            setToastMessage('Only Admin (Elesh) can enroll members.');
            return;
          }
          setIsAddMemberModalOpen(true);
        }}
        onOpenAxiomModal={() => setIsAxiomModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenAdminClaims={() => setIsAdminClaimsOpen(true)}
        onLogout={handleLogout}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-parchment-50 dark:bg-obsidian-200 border-2 border-terracotta-500 text-parchment-900 dark:text-parchment-50 shadow-warm-lg text-xs font-mono flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-9 space-y-6 flex-1 w-full">
        {/* Admin Action Notice if Pending Claims exist */}
        {currentUser?.role === 'admin' && claims.filter((c) => c.status === 'pending').length > 0 && (
          <div
            onClick={() => setIsAdminClaimsOpen(true)}
            className="cursor-pointer bg-amber-500/15 border border-amber-500/40 rounded-2xl p-3.5 px-5 flex items-center justify-between text-xs sm:text-sm text-amber-900 dark:text-amber-200 shadow-warm-sm animate-pulse"
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>
                <strong>Admin Jurisdiction:</strong> You have <strong>{claims.filter((c) => c.status === 'pending').length}</strong> pending treat ticket(s) awaiting verification!
              </span>
            </div>
            <span className="font-mono text-xs font-semibold underline flex-shrink-0 ml-2">Review Now →</span>
          </div>
        )}
        {/* Collegiate Group Hero & Portrait */}
        <section className="bg-parchment-50 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 rounded-3xl p-5 sm:p-7 shadow-warm transition-all overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Group Photograph */}
            <div className="lg:col-span-7 relative group">
              <div className="relative rounded-2xl overflow-hidden border border-parchment-300 dark:border-obsidian-100 shadow-warm-md aspect-[16/10] bg-obsidian-500">
                <img
                  src="/group-cropped.jpg"
                  alt="Better Coffee Syndicate Fellows"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 right-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-mono font-medium drop-shadow-sm">
                      The Syndicate Fellows (7 Members)
                    </span>
                  </div>
                  <span className="text-[11px] font-serif italic text-white/90 drop-shadow-sm hidden sm:inline">
                    Post-Class Collegiate Assembly
                  </span>
                </div>
              </div>
            </div>

            {/* Editorial Context & Details */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-terracotta-100 dark:bg-terracotta-900/50 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-200 dark:border-terracotta-800/60 font-medium">
                    Collegiate Chapter • 2026
                  </span>
                  {currentUser?.role === 'admin' && (
                    <button
                      onClick={handleResetData}
                      className="text-[11px] font-mono text-parchment-500 hover:text-parchment-800 dark:hover:text-parchment-200 flex items-center gap-1 transition-colors px-2 py-0.5 rounded border border-parchment-300 dark:border-obsidian-100 bg-parchment-100 dark:bg-obsidian-300"
                      title="Reset sample group data (Admin Only)"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-parchment-900 dark:text-parchment-50 tracking-tight leading-snug">
                  Post-Class Treat Equity System
                </h2>
                <p className="text-xs sm:text-sm text-parchment-600 dark:text-parchment-400 mt-2 leading-relaxed">
                  Strict collegial round-robin for the {members.length} institute fellows: Every fellow must sponsor one treat per cycle before anyone repeats.
                </p>
              </div>

              {/* Status Ledger Mini Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-parchment-100 dark:bg-obsidian-300 border border-parchment-200 dark:border-obsidian-100">
                  <span className="text-[10px] text-parchment-500 block uppercase">Rotational Quota</span>
                  <span className="font-medium text-parchment-900 dark:text-parchment-100 text-sm">
                    {stats.completedCount} / {stats.totalMembers} Fulfilled
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-parchment-100 dark:bg-obsidian-300 border border-parchment-200 dark:border-obsidian-100">
                  <span className="text-[10px] text-parchment-500 block uppercase">Sovereign Venue</span>
                  <span className="font-medium text-terracotta-600 dark:text-terracotta-400 text-sm">
                    Better Coffee ☕
                  </span>
                </div>
              </div>

              {/* Sarcastic Axiom Notice */}
              <div
                onClick={() => setIsAxiomModalOpen(true)}
                className="cursor-pointer group p-3 rounded-xl bg-parchment-100/70 dark:bg-obsidian-300/70 border border-terracotta-200 dark:border-terracotta-900/40 hover:border-terracotta-400 transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Scale className="w-3.5 h-3.5 text-terracotta-500" />
                  <span className="font-mono text-[11px] text-parchment-700 dark:text-parchment-300">
                    Axiom 1.1: <strong>UFO Cafe ≠ Better Coffee ❌</strong>
                  </span>
                </div>
                <span className="text-terracotta-600 dark:text-terracotta-400 font-mono text-[11px] group-hover:translate-x-0.5 transition-transform">
                  Inquest →
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Round Progress & Rotational Equilibrium */}
        <RoundProgress
          currentRound={currentRound}
          stats={stats}
          onStartNextRound={handleStartNextRound}
        />

        {/* 2. Next In Line Hero Card */}
        <NextInLineCard
          nextInLine={activeNextInLine}
          currentRound={currentRound}
          onRecordTreatForMember={handleRecordTreatForMember}
          onPassTurn={handlePassTurn}
        />

        {/* 3. Squad Roster & Rotational Ledger */}
        <MembersList
          memberStats={stats.memberStats}
          currentRound={currentRound}
          nextInLineId={activeNextInLine?.id}
          isAdmin={currentUser?.role === 'admin'}
          onOpenAddMemberModal={() => {
            if (currentUser?.role !== 'admin') {
              setToastMessage('Only Admin (Elesh) can enroll members.');
              return;
            }
            setIsAddMemberModalOpen(true);
          }}
          onRecordTreatForMember={handleRecordTreatForMember}
        />

        {/* 4. History Feed / Outings Archive */}
        <PartyHistory
          parties={parties}
          members={members}
          currentRound={currentRound}
        />
      </main>

      {/* Modals */}
      <LogPartyModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        members={members}
        currentRound={currentRound}
        prefilledHostId={prefilledHostId}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onSubmitClaim={handleSubmitClaim}
        onSavePartyDirect={handleSaveParty}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        currentUser={currentUser}
      />

      <AdminClaimsPanel
        isOpen={isAdminClaimsOpen}
        onClose={() => setIsAdminClaimsOpen(false)}
        claims={claims}
        members={members}
        onApproveClaim={handleApproveClaim}
        onRejectClaim={handleRejectClaim}
      />

      <SpinWheelModal
        isOpen={isSpinWheelOpen}
        onClose={() => setIsSpinWheelOpen(false)}
        pendingMembers={stats.pendingMembers}
        onSelectWinner={(winnerId) => {
          setPrefilledHostId(winnerId);
          setIsLogModalOpen(true);
        }}
      />

      <WhatsAppShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        groupName={groupName}
        currentRound={currentRound}
        stats={stats}
        lastParty={
          lastParty
            ? { ...lastParty, hostName: lastPartyHost ? lastPartyHost.name : 'Squad' }
            : null
        }
      />

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        members={members}
        currentUser={currentUser}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />

      <AxiomModal
        isOpen={isAxiomModalOpen}
        onClose={() => setIsAxiomModalOpen(false)}
      />

      <CycleCompleteModal
        isOpen={isCycleCompleteModalOpen}
        onClose={() => setIsCycleCompleteModalOpen(false)}
        completedCycle={completedCycleNum}
        totalMembers={members.length}
        onStartNextCycle={handleStartNextRound}
      />

      <CloudDatabaseModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        isCloudConnected={isCloudConnected}
        onConnectSuccess={() => {
          setIsCloudConnected(isSupabaseConfigured());
          setIsCloudModalOpen(false);
          setToastMessage('Cloud database synced successfully! ☁️');
        }}
        localState={{
          members,
          parties,
          claims,
          currentRound,
        }}
      />

      {/* Footer */}
      <footer className="border-t border-parchment-300 dark:border-obsidian-200 bg-parchment-50 dark:bg-obsidian-300 py-6 text-xs text-parchment-500 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-serif italic">
            Better Coffee Syndicate • Dedicated to academic clarity & caffeine equity
          </p>
          <p className="font-mono text-[11px] text-parchment-600 dark:text-parchment-400">
            Rule: <span className="text-terracotta-600 dark:text-terracotta-400 font-medium">"Party deni h to sbko deni h"</span> ☕
          </p>
        </div>
      </footer>
    </div>
  );
}
