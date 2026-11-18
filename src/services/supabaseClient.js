import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY_CONFIG = 'chaiapp_supabase_config_v1';

export function sanitizeSupabaseUrl(inputUrl) {
  if (!inputUrl) return '';
  let url = inputUrl.trim();

  // If user pasted dashboard URL like https://supabase.com/dashboard/project/abcdefgh...
  const dashboardMatch = url.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/);
  if (dashboardMatch && dashboardMatch[1]) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }

  // If user entered without protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  // Remove trailing slashes
  return url.replace(/\/+$/, '');
}

export function getSupabaseCredentials() {
  // 1. Check environment variables
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey) {
    return { url: sanitizeSupabaseUrl(envUrl), key: envKey.trim(), source: 'env' };
  }

  // 2. Check in-app stored settings
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.key) {
        return { url: sanitizeSupabaseUrl(parsed.url), key: parsed.key.trim(), source: 'local' };
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

  const sanitized = sanitizeSupabaseUrl(creds.url);
  if (!supabaseInstance || lastUrl !== sanitized || lastKey !== creds.key) {
    lastUrl = sanitized;
    lastKey = creds.key;
    supabaseInstance = createClient(sanitized, creds.key, {
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
  const sanitized = sanitizeSupabaseUrl(url);
  const config = { url: sanitized, key: key.trim(), savedAt: new Date().toISOString() };
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

export async function testSupabaseConnection(rawUrl, rawKey) {
  try {
    const url = sanitizeSupabaseUrl(rawUrl);
    const key = (rawKey || '').trim();

    if (!url.includes('.supabase.co')) {
      return {
        ok: false,
        error: `Invalid Supabase URL format: "${url}". The Project URL must look like "https://xyzabcdef.supabase.co", not the dashboard page URL.`
      };
    }

    const testClient = createClient(url, key);
    const { data, error } = await testClient.from('members').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return {
          ok: false,
          error: `Connected to Supabase, but the "members" table was not found! Please run the SQL schema script in Supabase SQL Editor first.`
        };
      }
      return { ok: false, error: error.message };
    }
    return { ok: true, data, sanitizedUrl: url };
  } catch (err) {
    return {
      ok: false,
      error: `Failed to fetch (${err.message}). Ensure your Project URL is formatted as "https://xyz.supabase.co" and that your project is not paused.`
    };
  }
}
