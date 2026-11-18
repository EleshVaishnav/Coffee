import { getSupabase, isSupabaseConfigured } from './supabaseClient';

// Helper to convert database snake_case to app camelCase
function mapDbPartyToApp(p) {
  return {
    id: p.id,
    round: p.round,
    hostId: p.host_id,
    venue: p.venue,
    date: p.date,
    amount: p.amount ? Number(p.amount) : null,
    attendees: Array.isArray(p.attendees) ? p.attendees : [],
    note: p.note || '',
  };
}

function mapAppPartyToDb(p) {
  return {
    id: p.id,
    round: p.round,
    host_id: p.hostId,
    venue: p.venue,
    date: p.date,
    amount: p.amount || null,
    attendees: p.attendees || [],
    note: p.note || '',
  };
}

function mapDbClaimToApp(c) {
  return {
    id: c.id,
    memberId: c.member_id,
    memberName: c.member_name,
    round: c.round,
    venue: c.venue,
    date: c.date,
    amount: c.amount ? Number(c.amount) : null,
    attendees: Array.isArray(c.attendees) ? c.attendees : [],
    note: c.note || '',
    status: c.status || 'pending',
    reviewNote: c.review_note || '',
    createdAt: c.created_at,
  };
}

function mapAppClaimToDb(c) {
  return {
    id: c.id,
    member_id: c.memberId,
    member_name: c.memberName,
    round: c.round,
    venue: c.venue,
    date: c.date,
    amount: c.amount || null,
    attendees: c.attendees || [],
    note: c.note || '',
    status: c.status || 'pending',
    review_note: c.reviewNote || '',
  };
}

/**
 * Fetch all syndicate data from Supabase
 */
export async function fetchRemoteSyndicateData() {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    // Parallel fetch for speed
    const [membersRes, partiesRes, claimsRes, stateRes] = await Promise.all([
      supabase.from('members').select('*').order('created_at', { ascending: true }),
      supabase.from('parties').select('*').order('created_at', { ascending: false }),
      supabase.from('claims').select('*').order('created_at', { ascending: false }),
      supabase.from('app_state').select('*'),
    ]);

    if (membersRes.error) throw membersRes.error;
    if (partiesRes.error) throw partiesRes.error;
    if (claimsRes.error) throw claimsRes.error;

    // Parse state
    let currentRound = 1;
    let groupName = 'Better Coffee Syndicate';
    if (stateRes.data) {
      stateRes.data.forEach((row) => {
        if (row.key === 'current_round') currentRound = Number(row.value);
        if (row.key === 'group_name') groupName = String(row.value);
      });
    }

    return {
      members: membersRes.data || [],
      parties: (partiesRes.data || []).map(mapDbPartyToApp),
      claims: (claimsRes.data || []).map(mapDbClaimToApp),
      currentRound,
      groupName,
    };
  } catch (err) {
    console.error('Failed to fetch from Supabase:', err);
    return null;
  }
}

/**
 * Sync a new party to cloud
 */
export async function syncPartyToCloud(party) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    const dbPayload = mapAppPartyToDb(party);
    await supabase.from('parties').upsert(dbPayload);
  } catch (err) {
    console.error('Error syncing party to Supabase:', err);
  }
}

/**
 * Sync a claim to cloud
 */
export async function syncClaimToCloud(claim) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    const dbPayload = mapAppClaimToDb(claim);
    await supabase.from('claims').upsert(dbPayload);
  } catch (err) {
    console.error('Error syncing claim to Supabase:', err);
  }
}

/**
 * Update claim status in cloud
 */
export async function updateClaimStatusInCloud(claimId, status, reviewNote) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase
      .from('claims')
      .update({ status, review_note: reviewNote })
      .eq('id', claimId);
  } catch (err) {
    console.error('Error updating claim status in Supabase:', err);
  }
}

/**
 * Sync round progression to cloud
 */
export async function syncRoundToCloud(round) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase
      .from('app_state')
      .upsert({ key: 'current_round', value: round });
  } catch (err) {
    console.error('Error syncing round to Supabase:', err);
  }
}

/**
 * Sync new member to cloud
 */
export async function syncMemberToCloud(member) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from('members').upsert({
      id: member.id,
      name: member.name,
      nickname: member.nickname,
      avatar: member.avatar,
      photo: member.photo || null,
    });
  } catch (err) {
    console.error('Error syncing member to Supabase:', err);
  }
}

/**
 * Remove member from cloud
 */
export async function removeMemberFromCloud(memberId) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from('members').delete().eq('id', memberId);
  } catch (err) {
    console.error('Error deleting member from Supabase:', err);
  }
}

/**
 * Subscribe to multi-phone realtime updates
 */
export function subscribeToRealtimeSyndicate(onDataReload) {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel('syndicate_realtime_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'parties' }, () => {
      onDataReload();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, () => {
      onDataReload();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
      onDataReload();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'app_state' }, () => {
      onDataReload();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Migrate local data into Supabase in 1 click
 */
export async function migrateLocalDataToCloud(members, parties, claims, currentRound) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not connected');

  // 1. Members
  if (members && members.length > 0) {
    const memberRows = members.map((m) => ({
      id: m.id,
      name: m.name,
      nickname: m.nickname,
      avatar: m.avatar,
      photo: m.photo || null,
    }));
    await supabase.from('members').upsert(memberRows);
  }

  // 2. Parties
  if (parties && parties.length > 0) {
    const partyRows = parties.map(mapAppPartyToDb);
    await supabase.from('parties').upsert(partyRows);
  }

  // 3. Claims
  if (claims && claims.length > 0) {
    const claimRows = claims.map(mapAppClaimToDb);
    await supabase.from('claims').upsert(claimRows);
  }

  // 4. Round
  await supabase.from('app_state').upsert({ key: 'current_round', value: currentRound });

  return true;
}
