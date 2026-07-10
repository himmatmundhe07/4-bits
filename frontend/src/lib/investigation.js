const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/games";

let sessionCache = {};
let logsCache = {};

async function fetchSession(roomCode) {
  const code = roomCode.toUpperCase();
  if (sessionCache[code]) return sessionCache[code];
  const response = await fetch(`${API_BASE}/${code}/session`);
  if (!response.ok) throw new Error("Failed to fetch session");
  const data = await response.json();
  sessionCache[code] = data.data;
  return data.data;
}

export const getSuspects = async (roomCode) => {
  const session = await fetchSession(roomCode);
  return (session.characters || [])
    .filter(c => !c.isVictim)
    .map(c => ({
      id: c.characterId,
      name: c.name,
      role: c.occupation,
      isPlayer: !!c.playerId,
      playerId: c.playerId
    }));
};

export const getInvestigationLog = async (roomCode) => {
  const code = roomCode.toUpperCase();
  if (logsCache[code]) return logsCache[code];

  const session = await fetchSession(roomCode);
  const startText = `The rain lashes against the windowpanes at the ${session.location}. A body lies cold on the floor: the victim is ${session.victim}, who met their end via "${session.causeOfDeath.toLowerCase()}" around ${session.timeOfDeath}. The suspects gathered here are: ${session.suspects.join(", ")}. You must investigate the room, inspect the evidence, and coordinate with each other to solve the mystery before the authorities arrive.`;

  logsCache[code] = [
    {
      id: "msg-start",
      type: "ai",
      author: "Game Master",
      text: startText
    }
  ];
  return logsCache[code];
};

export const getDiscoveredClues = async (roomCode) => {
  const session = await fetchSession(roomCode);
  return (session.evidence || []).map(e => ({
    id: e.evidenceId,
    title: e.name,
    description: `${e.description} (Discovered at: ${e.location || 'Unknown'})`
  }));
};

export const getActivePlayers = async (roomCode) => {
  const response = await fetch(`${API_BASE}/${roomCode.toUpperCase()}/players`);
  if (!response.ok) return [];
  const data = await response.json();
  return (data.data.players || []).map(p => ({
    id: p.playerId,
    name: p.name,
    isReady: p.isReady,
    active: p.isConnected
  }));
};

export const submitAction = async (roomCode, playerId, actionPayload) => {
  const code = roomCode.toUpperCase();
  const session = await fetchSession(roomCode);
  
  const myChar = session.characters.find(c => c.playerId === playerId);
  const authorName = myChar ? myChar.name : "Investigator";

  let responseText = "";
  
  switch(actionPayload.type) {
    case "ask":
      responseText = `You ask ${actionPayload.target} about "${actionPayload.content}". They shift uncomfortably. "I have nothing to hide," they say, though their eyes dart around the room.`;
      break;
    case "request":
      responseText = `You request details about "${actionPayload.content}" from ${actionPayload.target}. They respond flatly, "That's personal business. Let the police handle it."`;
      break;
    case "inspect":
      responseText = `You inspect the ${actionPayload.target}. Your examination reveals details consistent with a struggle, but no immediate breakthroughs.`;
      break;
    case "accuse":
      responseText = `You point an accusing finger at ${actionPayload.target}! "${actionPayload.content}!" The room is silent for a tense moment. ${actionPayload.target} gasps, "How dare you make such baseless claims without definitive proof!"`;
      break;
    default:
      responseText = "Action noted by the Game Master.";
  }

  const actionEntry = {
    id: `msg-${Date.now()}-a`,
    type: "player",
    author: authorName,
    text: `[${actionPayload.type.toUpperCase()}] ${actionPayload.target ? '-> ' + actionPayload.target : ''} ${actionPayload.content || ''}`
  };

  const aiEntry = {
    id: `msg-${Date.now()}-b`,
    type: "ai",
    author: "Game Master",
    text: responseText
  };

  if (!logsCache[code]) {
    await getInvestigationLog(roomCode);
  }
  logsCache[code].push(actionEntry, aiEntry);

  return { success: true, newEntries: [actionEntry, aiEntry] };
};
