-- Better Coffee Syndicate: Cloud Database Schema (Supabase PostgreSQL)

-- 1. Members Table
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nickname TEXT,
  avatar TEXT,
  photo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Parties Table (Official Cycle Outings Ledger)
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

-- 3. Treat Claims Table (Anti-Fraud Tickets)
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
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  review_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Syndicate State (Current cycle, Group name)
CREATE TABLE IF NOT EXISTS app_state (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) with open policies for the collegiate syndicate
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

-- Enable Supabase Realtime for instant multi-phone synchronization
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'members'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE members;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'parties'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE parties;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'claims'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE claims;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'app_state'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE app_state;
  END IF;
END $$;

-- Seed Initial 7 Syndicate Fellows
INSERT INTO members (id, name, nickname, avatar, photo) VALUES
  ('m1', 'Bhawesh-blue', 'The Cold Brew Theorist', '☕', '/members/bhawesh.jpg'),
  ('m2', 'VyomX', 'Caffeine Auditor', '⚡', '/members/vyom.jpg'),
  ('m3', 'Devansh Hamster', 'Pastry Prioritizer', '🥐', '/members/devansh.jpg'),
  ('m4', 'Anurag-taze', 'South Campus Barista', '✨', '/members/anurag.jpg'),
  ('m5', 'Samarth-khalifa', 'Syndicate Chancellor', '👑', '/members/samarth.jpg'),
  ('m6', 'Kishan-denial', 'Filter Coffee Loyalist', '☕', NULL),
  ('m7', 'Elesh', 'Syndicate Custodian', '🌟', '/members/elesh.jpg')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  photo = EXCLUDED.photo;

INSERT INTO app_state (key, value) VALUES
  ('current_round', '1'::jsonb),
  ('group_name', '"Better Coffee Syndicate"'::jsonb)
ON CONFLICT (key) DO NOTHING;
