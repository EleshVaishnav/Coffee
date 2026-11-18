import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { generateWhatsAppMessage } from '../utils/rotationLogic';

export default function WhatsAppShareModal({
  isOpen,
  onClose,
  groupName,
  currentRound,
  stats,
  lastParty,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const messageText = generateWhatsAppMessage(groupName, currentRound, stats, lastParty);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-500/60 backdrop-blur-sm">
      <div className="bg-parchment-100 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-warm-lg relative transition-all animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-parchment-500 hover:text-parchment-800 dark:text-parchment-400 dark:hover:text-parchment-100 bg-parchment-200/50 hover:bg-parchment-200 dark:bg-obsidian-100 dark:hover:bg-obsidian-50 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xl font-serif font-normal text-parchment-900 dark:text-parchment-50">
            WhatsApp Dispatch Generator
          </h3>
        </div>
        <p className="text-xs text-parchment-600 dark:text-parchment-400 mb-4 leading-relaxed">
          Broadcast Cycle {currentRound} rotational balance directly to the collegial group chat.
        </p>

        {/* Dispatch Preview in Monospace */}
        <div className="bg-parchment-50 dark:bg-obsidian-300 p-4 rounded-2xl border border-parchment-300 dark:border-obsidian-100 max-h-60 overflow-y-auto text-xs text-parchment-800 dark:text-parchment-200 font-mono whitespace-pre-wrap leading-relaxed selection:bg-terracotta-500/20">
          {messageText}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-parchment-50 dark:bg-obsidian-300 hover:bg-parchment-200 dark:hover:bg-obsidian-100 text-parchment-800 dark:text-parchment-100 font-medium text-xs transition-all border border-parchment-300 dark:border-obsidian-100"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Dispatch</span>
              </>
            )}
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-warm transition-all transform active:scale-98"
          >
            <Share2 className="w-4 h-4" />
            <span>Open WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
