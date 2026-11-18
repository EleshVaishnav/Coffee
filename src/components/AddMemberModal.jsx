import React, { useState } from 'react';
import { X, UserPlus, Trash2, ShieldAlert, Lock } from 'lucide-react';

const EMOJI_OPTIONS = ['☕', '🤓', '✨', '🔥', '🌟', '💸', '⚡', '🌸', '🍕', '😎', '🧁', '🥤'];

export default function AddMemberModal({
  isOpen,
  onClose,
  members,
  currentUser,
  onAddMember,
  onRemoveMember,
}) {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('☕');

  const isAdmin = currentUser?.role === 'admin';

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!name.trim()) return;

    const newMember = {
      id: 'm_' + Date.now(),
      name: name.trim(),
      nickname: nickname.trim() || 'Fellow',
      avatar: avatar || '☕',
    };

    onAddMember(newMember);
    setName('');
    setNickname('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-500/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-parchment-100 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-warm-lg relative my-8 transition-all animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-parchment-500 hover:text-parchment-800 dark:text-parchment-400 dark:hover:text-parchment-100 bg-parchment-200/50 hover:bg-parchment-200 dark:bg-obsidian-100 dark:hover:bg-obsidian-50 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <UserPlus className="w-4 h-4 text-terracotta-500" />
          <h3 className="text-xl font-serif font-normal text-parchment-900 dark:text-parchment-50">
            Syndicate Membership Roster
          </h3>
        </div>
        <p className="text-xs text-parchment-600 dark:text-parchment-400 mb-5 leading-relaxed">
          Manage enrolled colleagues ({members.length} active fellows in the rotational pool).
        </p>

        {/* Add Friend Form (Admin Only) */}
        {isAdmin ? (
          <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-300 dark:border-obsidian-100 mb-5 space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-terracotta-700 dark:text-terracotta-300 flex items-center justify-between">
              <span>Induct New Colleague</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-terracotta-500 text-white font-medium">Admin Mode</span>
            </h4>

            <div>
              <input
                type="text"
                placeholder="Colleague's Full Name (e.g. Rahul Sharma)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-parchment-100 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 text-parchment-900 dark:text-parchment-100 text-xs focus:outline-none focus:border-terracotta-500 font-sans"
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Collegial Nickname (e.g. Cold Brew Theorist)"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-parchment-100 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 text-parchment-900 dark:text-parchment-100 text-xs focus:outline-none focus:border-terracotta-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-parchment-500 dark:text-parchment-400 mb-1">
                Designated Glyph / Emoji
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    type="button"
                    key={e}
                    onClick={() => setAvatar(e)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all ${
                      avatar === e
                        ? 'bg-terracotta-100 dark:bg-terracotta-900/50 border border-terracotta-500 scale-105'
                        : 'bg-parchment-100 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 hover:bg-parchment-200'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-xs shadow-warm transition-all"
            >
              Induct Colleague
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs mb-5 space-y-1.5 font-mono">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Admin Jurisdiction Restricted</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300/90 font-sans">
              Only <strong>Admin (Elesh)</strong> has authorization to induct new members or remove colleagues from the official syndicate roster.
            </p>
          </div>
        )}

        {/* Current Squad List */}
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-parchment-500 dark:text-parchment-400 mb-2">
            Enrolled Fellows ({members.length})
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-2 rounded-xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-200 dark:border-obsidian-100 text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md overflow-hidden bg-parchment-200 dark:bg-obsidian-200 flex items-center justify-center flex-shrink-0 border border-parchment-300 dark:border-obsidian-100">
                    {m.photo ? (
                      <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs">{m.avatar || '☕'}</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-parchment-900 dark:text-parchment-100">{m.name}</span>
                  </div>
                </div>
                {isAdmin && members.length > 3 && (
                  <button
                    onClick={() => onRemoveMember(m.id)}
                    className="p-1 rounded-lg text-parchment-400 hover:text-red-600 transition-colors"
                    title="Remove fellow from rotational pool"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
