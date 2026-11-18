export function computeGroupStats(members, parties, currentRound) {
  const roundParties = parties.filter((p) => p.round === currentRound);
  const roundHostIds = new Set(roundParties.map((p) => p.hostId));

  const now = new Date();

  const memberStats = members.map((member) => {
    // Has this person hosted in current round?
    const hasGivenInCurrentRound = roundHostIds.has(member.id);
    const roundPartyGiven = roundParties.find((p) => p.hostId === member.id);

    // Total parties given ever
    const totalGiven = parties.filter((p) => p.hostId === member.id).length;

    // Total parties attended ever
    const totalAttended = parties.filter((p) =>
      p.attendees && p.attendees.includes(member.id)
    ).length;

    // Parties attended in current round while pending
    const attendedInCurrentRound = roundParties.filter((p) =>
      p.attendees && p.attendees.includes(member.id)
    ).length;

    // Last party given by this member across all history
    const allGivenParties = parties
      .filter((p) => p.hostId === member.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const lastGivenDate = allGivenParties[0]?.date || null;
    let daysSinceLastGiven = 999;
    if (lastGivenDate) {
      const diffTime = Math.abs(now - new Date(lastGivenDate));
      daysSinceLastGiven = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    // Treat ratio: Hosted / Attended
    const fairnessRatio = totalAttended > 0 ? (totalGiven / totalAttended).toFixed(2) : '1.00';

    return {
      ...member,
      hasGivenInCurrentRound,
      roundPartyDate: roundPartyGiven ? roundPartyGiven.date : null,
      roundPartyVenue: roundPartyGiven ? roundPartyGiven.venue : null,
      totalGiven,
      totalAttended,
      attendedInCurrentRound,
      lastGivenDate,
      daysSinceLastGiven,
      fairnessRatio: parseFloat(fairnessRatio),
    };
  });

  // Calculate Next in Line Queue:
  // 1. Pending members first!
  // 2. Ranked by: most attended in this round without giving, or longest days since last given
  const pendingMembers = memberStats.filter((m) => !m.hasGivenInCurrentRound);
  const completedMembers = memberStats.filter((m) => m.hasGivenInCurrentRound);

  pendingMembers.sort((a, b) => {
    // If one has never given a party ever, they go higher
    if (a.totalGiven === 0 && b.totalGiven > 0) return -1;
    if (b.totalGiven === 0 && a.totalGiven > 0) return 1;

    // Next by days since last given (longer wait = higher priority)
    if (b.daysSinceLastGiven !== a.daysSinceLastGiven) {
      return b.daysSinceLastGiven - a.daysSinceLastGiven;
    }

    // Tie-breaker: attended more outings in current round
    return b.attendedInCurrentRound - a.attendedInCurrentRound;
  });

  completedMembers.sort((a, b) => new Date(b.roundPartyDate) - new Date(a.roundPartyDate));

  const totalMembers = members.length;
  const completedCount = completedMembers.length;
  const pendingCount = pendingMembers.length;
  const progressPercent = totalMembers > 0 ? Math.round((completedCount / totalMembers) * 100) : 0;
  const isRoundComplete = completedCount === totalMembers && totalMembers > 0;

  const nextInLine = pendingMembers.length > 0 ? pendingMembers[0] : null;

  return {
    memberStats,
    pendingMembers,
    completedMembers,
    totalMembers,
    completedCount,
    pendingCount,
    progressPercent,
    isRoundComplete,
    nextInLine,
  };
}

export function generateWhatsAppMessage(groupName, round, stats, lastParty) {
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  let text = `☕ *${groupName.toUpperCase()} - TREAT ROSTER UPDATE*\n`;
  text += `📅 _${dateStr}_ | *Round ${round} Status*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (stats.nextInLine) {
    text += `🎯 *NEXT PARTY DUE:* 👉 *${stats.nextInLine.name}*\n`;
    if (stats.nextInLine.totalGiven === 0) {
      text += `🚨 _Has not given any treat yet! Next coffee is definitely on them._\n\n`;
    } else {
      text += `⏱️ _Last treated ${stats.nextInLine.daysSinceLastGiven} days ago (${stats.nextInLine.lastGivenDate})_\n\n`;
    }
  } else {
    text += `🎉 *Round ${round} 100% COMPLETE!* Everyone has given party!\n\n`;
  }

  text += `📊 *Round Progress:* ${stats.completedCount}/${stats.totalMembers} Friends (${stats.progressPercent}%)\n\n`;

  text += `⏳ *PENDING LIST (Sabko deni hai!):*\n`;
  if (stats.pendingMembers.length === 0) {
    text += `• None! All cleared! 🥳\n`;
  } else {
    stats.pendingMembers.forEach((m, idx) => {
      text += `${idx + 1}. *${m.name}* - Attended: ${m.attendedInCurrentRound} coffee runs\n`;
    });
  }

  text += `\n✅ *ALREADY GIVEN IN ROUND ${round}:*\n`;
  if (stats.completedMembers.length === 0) {
    text += `• Round just started!\n`;
  } else {
    stats.completedMembers.forEach((m) => {
      text += `• ${m.name} at ${m.roundPartyVenue || 'Campus'} (${m.roundPartyDate || 'Done'})\n`;
    });
  }

  if (lastParty) {
    text += `\n🍰 *Last Outing:* ${lastParty.venue} by ${lastParty.hostName || 'Squad'}\n`;
  }

  text += `\n🚨 *PUBLIC SERVICE BANTER:* UFO Cafe ≠ Better Coffee! 🤦‍♂️☕\n`;
  text += `_(Pata nahi kyu sabko UFO jana hota hai... Taste buds sudhar lo, we go to Better Coffee!)_\n`;

  text += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `_Rule: Ek round me sbko party deni h, koi free me nahi bachega!_ ☕✨`;

  return text;
}

