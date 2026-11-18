import React, { useState } from 'react';
import { X, Database, Cloud, Check, Copy, AlertCircle, RefreshCw, ExternalLink, Zap, ShieldCheck } from 'lucide-react';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
} from '../services/supabaseClient';
import { migrateLocalDataToCloud } from '../services/databaseService';

const SQL_SCHEMA_SNIPPET = `-- 1. Run this in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nickname TEXT,
  avatar TEXT,
  photo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parties (
  id TEXT PRIMARY KEY,
  round INTEGER NOT NULL DEFAULT 1,
  host_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  venue TEXT NOT NULL,
  date TEXT NOT NULL,
  amount NUMERIC,
  attendees JSONB DEFAULT '[]'::jsonb,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS claims (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  round INTEGER NOT NULL DEFAULT 1,
  venue TEXT NOT NULL,
  date TEXT NOT NULL,
  amount NUMERIC,
  attendees JSONB DEFAULT '[]'::jsonb,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  review_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_state (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read members" ON members FOR SELECT USING (true);
CREATE POLICY "Public insert members" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update members" ON members FOR UPDATE USING (true);
CREATE POLICY "Public delete members" ON members FOR DELETE USING (true);

CREATE POLICY "Public read parties" ON parties FOR SELECT USING (true);
CREATE POLICY "Public insert parties" ON parties FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update parties" ON parties FOR UPDATE USING (true);
CREATE POLICY "Public delete parties" ON parties FOR DELETE USING (true);

CREATE POLICY "Public read claims" ON claims FOR SELECT USING (true);
CREATE POLICY "Public insert claims" ON claims FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update claims" ON claims FOR UPDATE USING (true);
CREATE POLICY "Public delete claims" ON claims FOR DELETE USING (true);

CREATE POLICY "Public read app_state" ON app_state FOR SELECT USING (true);
CREATE POLICY "Public insert app_state" ON app_state FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update app_state" ON app_state FOR UPDATE USING (true);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'members') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE members;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'parties') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE parties;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'claims') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE claims;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'app_state') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE app_state;
  END IF;
END $$;

INSERT INTO members (id, name, nickname, avatar, photo) VALUES
  ('m1', 'Bhawesh-blue', 'The Cold Brew Theorist', '☕', '/members/bhawesh.jpg'),
  ('m2', 'VyomX', 'Caffeine Auditor', '⚡', '/members/vyom.jpg'),
  ('m3', 'Devansh Hamster', 'Pastry Prioritizer', '🥐', '/members/devansh.jpg'),
  ('m4', 'Anurag-taze', 'South Campus Barista', '✨', '/members/anurag.jpg'),
  ('m5', 'Samarth-khalifa', 'Syndicate Chancellor', '👑', '/members/samarth.jpg'),
  ('m6', 'Kishan-denial', 'Filter Coffee Loyalist', '☕', NULL),
  ('m7', 'Elesh', 'Syndicate Custodian', '🌟', '/members/elesh.jpg')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, photo = EXCLUDED.photo;

INSERT INTO app_state (key, value) VALUES ('current_round', '1'::jsonb), ('group_name', '"Better Coffee Syndicate"'::jsonb)
ON CONFLICT (key) DO NOTHING;`;

export default function CloudDatabaseModal({
  isOpen,
  onClose,
  isCloudConnected,
  onConnectSuccess,
  localState,
}) {
  const currentCreds = getSupabaseCredentials();
  const [url, setUrl] = useState(currentCreds?.url || '');
  const [key, setKey] = useState(currentCreds?.key || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SNIPPET);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleTestAndConnect = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!url.trim() || !key.trim()) {
      setErrorMsg('Please enter both Supabase Project URL and anon Public Key.');
      setIsLoading(false);
      return;
    }

    const test = await testSupabaseConnection(url.trim(), key.trim());
    setIsLoading(false);

    if (test.ok) {
      saveSupabaseCredentials(url.trim(), key.trim());
      setSuccessMsg('Successfully connected to Supabase Cloud Database! 🚀');
      setTimeout(() => {
        onConnectSuccess();
      }, 1000);
    } else {
      setErrorMsg(`Connection error: ${test.error || 'Failed to connect. Check URL/Key or run the SQL script first.'}`);
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Disconnect from Supabase? The app will revert to browser local storage.')) {
      clearSupabaseCredentials();
      setUrl('');
      setKey('');
      setSuccessMsg('Disconnected from Supabase.');
      setTimeout(() => {
        onConnectSuccess();
      }, 800);
    }
  };

  const handleMigrate = async () => {
    setIsMigrating(true);
    setErrorMsg('');
    try {
      await migrateLocalDataToCloud(
        localState.members,
        localState.parties,
        localState.claims,
        localState.currentRound
      );
      setSuccessMsg('All local members, treats, and claims uploaded to Cloud Database! ☁️');
      onConnectSuccess();
    } catch (err) {
      setErrorMsg(`Upload failed: ${err.message}`);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-500/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-parchment-100 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-warm-lg relative my-8 transition-all animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-parchment-500 hover:text-parchment-800 dark:text-parchment-400 dark:hover:text-parchment-100 bg-parchment-200/50 hover:bg-parchment-200 dark:bg-obsidian-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Database className="w-5 h-5 text-terracotta-500" />
          <h3 className="text-xl font-serif font-normal text-parchment-900 dark:text-parchment-50">
            Online Cloud Database (Multi-Device Sync)
          </h3>
        </div>
        <p className="text-xs text-parchment-600 dark:text-parchment-400 mb-5 leading-relaxed">
          Connect a free <strong>Supabase (PostgreSQL)</strong> database so all 7 fellows can access the syndicate on their phones in real time.
        </p>

        {/* Status Card */}
        <div className={`p-4 rounded-2xl border mb-5 flex items-center justify-between gap-3 text-xs ${
          isCloudConnected
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {isCloudConnected ? (
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            ) : (
              <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
            )}
            <div>
              <span className="font-semibold block">
                {isCloudConnected ? 'Cloud Database Connected (Live Multi-Phone Sync)' : 'Currently in Local Browser Storage'}
              </span>
              <span className="text-[11px] opacity-80">
                {isCloudConnected
                  ? `Active Host: ${currentCreds?.url ? new URL(currentCreds.url).hostname : 'Supabase Cloud'}`
                  : 'Data is currently saved only in this browser.'}
              </span>
            </div>
          </div>

          {isCloudConnected && (
            <button
              onClick={handleDisconnect}
              className="text-[11px] font-mono underline hover:text-red-500 flex-shrink-0"
            >
              Disconnect
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {isCloudConnected ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-200 dark:border-obsidian-100 text-xs space-y-3">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-terracotta-600 dark:text-terracotta-400 font-semibold">
                Sync Management
              </h4>
              <p className="text-parchment-600 dark:text-parchment-400 leading-relaxed">
                When anyone files a treat ticket, approves a party, or updates the cycle from their phone, it synchronizes instantly across all devices.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleMigrate}
                  disabled={isMigrating}
                  className="px-3.5 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-mono text-xs font-medium flex items-center gap-2 shadow-warm transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isMigrating ? 'animate-spin' : ''}`} />
                  <span>{isMigrating ? 'Uploading...' : 'Push Local Data to Cloud'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Quick 3-Step Guide */}
            <div className="space-y-2 text-xs">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-terracotta-600 dark:text-terracotta-400 font-semibold">
                How to Set Up in 2 Minutes (100% Free)
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-parchment-700 dark:text-parchment-300 font-sans">
                <li>
                  Create a free project at{' '}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-terracotta-600 dark:text-terracotta-400 inline-flex items-center gap-0.5"
                  >
                    supabase.com <ExternalLink className="w-3 h-3" />
                  </a>.
                </li>
                <li className="flex items-center justify-between flex-wrap gap-2">
                  <span>Open Supabase <strong>SQL Editor</strong> & run schema:</span>
                  <button
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-terracotta-100 dark:bg-terracotta-900/50 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-300 dark:border-terracotta-800 text-[11px] font-mono hover:bg-terracotta-200 transition-colors"
                  >
                    {copiedSql ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema Script'}</span>
                  </button>
                </li>
                <li>
                  Go to <strong>Project Settings $\rightarrow$ Data API</strong> and copy your <strong>Project URL</strong> & <strong>anon public key</strong> below:
                </li>
              </ol>
            </div>

            {/* Input Form */}
            <form onSubmit={handleTestAndConnect} className="space-y-3 p-4 rounded-2xl bg-parchment-50 dark:bg-obsidian-300 border border-parchment-200 dark:border-obsidian-100">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-parchment-700 dark:text-parchment-300 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  placeholder="https://xyzabcdefghijklm.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-parchment-100 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 text-parchment-900 dark:text-parchment-100 text-xs font-mono focus:outline-none focus:border-terracotta-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-parchment-700 dark:text-parchment-300 mb-1">
                  Supabase anon Public Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-parchment-100 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 text-parchment-900 dark:text-parchment-100 text-xs font-mono focus:outline-none focus:border-terracotta-500 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-mono text-xs font-medium flex items-center justify-center gap-2 shadow-warm transition-all"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>{isLoading ? 'Testing Connection...' : 'Connect Online Database'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
