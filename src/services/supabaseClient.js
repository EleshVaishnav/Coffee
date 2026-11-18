import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY_CONFIG = 'chaiapp_supabase_config_v1';

export function getSupabaseCredentials() {
  // 1. Check environment variables
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey) {
    return { url: envUrl.trim(), key: envKey.trim(), source: 'env' };
  }

  // 2. Check in-app stored settings
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.key) {
        return { url: parsed.url.trim(), key: parsed.key.trim(), source: 'local' };
      }
    }
  } catch (e) {}

  return null;
}

export function isSupabaseConfigured() {
  const creds = getSupabaseCredentials();
  return Boolean(creds?.url && creds?.key);
}

let supabaseInstance = null;
let lastUrl = null;
let lastKey = null;

export function getSupabase() {
  const creds = getSupabaseCredentials();
  if (!creds) return null;

  if (!supabaseInstance || lastUrl !== creds.url || lastKey !== creds.key) {
    lastUrl = creds.url;
    lastKey = creds.key;
    supabaseInstance = createClient(creds.url, creds.key, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }

  return supabaseInstance;
}

export function saveSupabaseCredentials(url, key) {
  if (!url || !key) return;
  const config = { url: url.trim(), key: key.trim(), savedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  supabaseInstance = null; // force re-instantiation
  return getSupabase();
}

export function clearSupabaseCredentials() {
  localStorage.removeItem(STORAGE_KEY_CONFIG);
  supabaseInstance = null;
  lastUrl = null;
  lastKey = null;
}

export async function testSupabaseConnection(url, key) {
  try {
    const testClient = createClient(url.trim(), key.trim());
    const { data, error } = await testClient.from('members').select('id').limit(1);
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message || 'Network connection failed' };
  }
}
