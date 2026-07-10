// Shared state for the mock session
let mockLog = [
  { id: "msg-1", type: "ai", author: "Game Master", text: "The rain lashes against the windowpanes of the study. A body lies cold on the Persian rug. The police will arrive at dawn. You must discover the truth before then." }
];

let mockClues = [
  { id: "clue-1", title: "Smashed Pocket Watch", description: "Found near the body. Stopped exactly at 11:42 PM. There is a small bloodstain on the glass." }
];

export const getSuspectsMock = async (roomCode) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: "s-1", name: "Eleanor Vance", role: "The Niece", isPlayer: true, playerId: "mock-player-1" },
    { id: "s-2", name: "Thomas Sterling", role: "The Butler", isPlayer: true, playerId: "mock-player-2" },
    { id: "s-3", name: "Dr. Arthur Pendelton", role: "The Suspicious Physician", isPlayer: true, playerId: "mock-player-3" }, // Assume this is us for the mock
    { id: "s-4", name: "Victor Graves", role: "The Business Partner", isPlayer: false } // NPC example
  ];
};

export const getInvestigationLogMock = async (roomCode) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockLog];
};

export const getDiscoveredCluesMock = async (roomCode) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockClues];
};

export const getActivePlayersMock = async (roomCode) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    { id: "mock-player-1", name: "PlayerOne", isReady: true, active: true },
    { id: "mock-player-2", name: "PlayerTwo", isReady: true, active: true },
    { id: "mock-player-3", name: "You", isReady: true, active: true }
  ];
};

export const submitActionMock = async (roomCode, playerId, actionPayload) => {
  await new Promise(resolve => setTimeout(resolve, 600));

  let responseText = "";
  
  switch(actionPayload.type) {
    case "ask":
      responseText = `You asked ${actionPayload.target} about "${actionPayload.content}". They look away nervously, avoiding your gaze. "I... I don't know what you're talking about," they stammer.`;
      break;
    case "request":
      responseText = `You requested evidence from ${actionPayload.target} regarding "${actionPayload.content}". They refuse to hand anything over, claiming it's a private matter.`;
      break;
    case "inspect":
      responseText = `You carefully inspected the ${actionPayload.target}. You notice something you missed before: faint traces of a powdery substance.`;
      // Optimistically add a clue
      const newClue = {
        id: `clue-${Date.now()}`,
        title: `Powdery Substance on ${actionPayload.target}`,
        description: "A mysterious white powder found during inspection. Requires further analysis."
      };
      mockClues.push(newClue);
      break;
    case "accuse":
      responseText = `You dramatically accuse ${actionPayload.target} of the crime! The room falls silent. "${actionPayload.content}," you declare. They scoff, "You have no proof of such wild allegations!"`;
      break;
    default:
      responseText = "Action performed.";
  }

  // Create the player's action log entry
  const actionEntry = {
    id: `msg-${Date.now()}-a`,
    type: "player",
    author: "Dr. Arthur Pendelton", // Hardcoded for mock continuity
    text: `[${actionPayload.type.toUpperCase()}] ${actionPayload.target ? '-> ' + actionPayload.target : ''} ${actionPayload.content || ''}`
  };

  // Create the AI's response log entry
  const aiEntry = {
    id: `msg-${Date.now()}-b`,
    type: "ai",
    author: "Game Master",
    text: responseText
  };

  mockLog.push(actionEntry, aiEntry);

  return { success: true, newEntries: [actionEntry, aiEntry] };
};
