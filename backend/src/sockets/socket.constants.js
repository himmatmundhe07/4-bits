export const SOCKET_EVENTS = {
  // Client -> Server
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  PLAYER_READY: 'player-ready',
  START_GAME: 'start-game',
  RECONNECT_PLAYER: 'reconnect-player',

  // Server -> Client
  ROOM_UPDATED: 'room-updated',
  PLAYER_JOINED: 'player-joined',
  PLAYER_LEFT: 'player-left',
  HOST_CHANGED: 'host-changed',
  PLAYER_READY_UPDATED: 'player-ready-updated',
  GAME_STARTED: 'game-started',
  PLAYER_CONNECTED: 'player-connected',
  PLAYER_DISCONNECTED: 'player-disconnected',
  ERROR: 'error',
};
