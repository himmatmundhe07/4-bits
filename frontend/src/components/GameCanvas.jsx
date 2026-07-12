import { useEffect, useRef } from 'react';

export default function GameCanvas({ 
  sceneKey, 
  socket, 
  roomCode, 
  playerId, 
  players = [], 
  suspects = [], 
  clues = [],
  mapConfig = null,
  session = null,
  customRegistry = {},
  gameRef: externalGameRef = null,
  onOverlapStart,
  onOverlapEnd 
}) {
  const containerRef = useRef(null);
  const localGameRef = useRef(null);

  // Store mutable props in refs to avoid rebuilding the Phaser Game instance
  const propsRef = useRef({
    sceneKey,
    socket,
    roomCode,
    playerId,
    players,
    suspects,
    clues,
    mapConfig,
    session,
  });

  const handlersRef = useRef({ onOverlapStart, onOverlapEnd });

  // Sync props to refs
  useEffect(() => {
    propsRef.current = {
      sceneKey,
      socket,
      roomCode,
      playerId,
      players,
      suspects,
      clues,
      mapConfig,
      session,
      customRegistry,
    };
  }, [sceneKey, socket, roomCode, playerId, players, suspects, clues, mapConfig, session, customRegistry]);

  useEffect(() => {
    handlersRef.current = { onOverlapStart, onOverlapEnd };
  }, [onOverlapStart, onOverlapEnd]);

  // One-time Phaser initialization on mount
  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;

    const initPhaser = async () => {
      const PhaserModule = await import('phaser');
      const Phaser = PhaserModule.default;
      const { createGameConfig } = await import('../game/config');

      if (destroyed) return;

      const containerId = 'phaser-game-container';
      
      const onGameReady = (game) => {
        if (destroyed) {
          game.destroy(true);
          return;
        }

        const p = propsRef.current;
        
        // Apply initial custom registry values
        if (p.customRegistry) {
          Object.entries(p.customRegistry).forEach(([k, v]) => {
            game.registry.set(k, v);
          });
        }

        game.scene.start(p.sceneKey, {
          socket: p.socket,
          roomCode: p.roomCode,
          playerId: p.playerId,
          players: p.players,
          suspects: p.suspects,
          clues: p.clues,
          mapConfig: p.mapConfig,
          phase: p.session?.phase,
          revealPolicy: p.session?.revealPolicy || 'immediate',
          seatAssignments: p.session?.seatAssignments || {},
          voiceParticipants: p.session?.voiceParticipants || {},
        });

        game.events.on('overlap-start', (hotspot) => {
          if (handlersRef.current.onOverlapStart) {
            handlersRef.current.onOverlapStart(hotspot);
          }
        });

        game.events.on('overlap-end', () => {
          if (handlersRef.current.onOverlapEnd) {
            handlersRef.current.onOverlapEnd();
          }
        });
      };

      const config = createGameConfig(containerId, onGameReady);
      const game = new Phaser.Game(config);
      localGameRef.current = game;
      if (externalGameRef) externalGameRef.current = game;
    };

    initPhaser();

    return () => {
      destroyed = true;
      if (localGameRef.current) {
        localGameRef.current.events.off('overlap-start');
        localGameRef.current.events.off('overlap-end');
        localGameRef.current.destroy(true);
        localGameRef.current = null;
        if (externalGameRef) externalGameRef.current = null;
      }
    };
  }, [externalGameRef]);

  // Handle scene switching dynamically when sceneKey changes
  useEffect(() => {
    const game = localGameRef.current;
    if (game && game.scene) {
      // Stop all active scenes that are not the target sceneKey
      game.scene.getScenes(true).forEach(scene => {
        if (scene.scene.key !== sceneKey) {
          game.scene.stop(scene.scene.key);
        }
      });

      // Start the target sceneKey
      const p = propsRef.current;
      game.scene.start(sceneKey, {
        socket: p.socket,
        roomCode: p.roomCode,
        playerId: p.playerId,
        players: p.players,
        suspects: p.suspects,
        clues: p.clues,
        mapConfig: p.mapConfig,
        phase: p.session?.phase,
        revealPolicy: p.session?.revealPolicy || 'immediate',
        seatAssignments: p.session?.seatAssignments || {},
        voiceParticipants: p.session?.voiceParticipants || {},
      });
    }
  }, [sceneKey]);

  // Sync registry updates
  useEffect(() => {
    const game = localGameRef.current;
    if (!game) return;

    if (customRegistry) {
      Object.entries(customRegistry).forEach(([k, v]) => {
        if (game.registry.get(k) !== v) {
          game.registry.set(k, v);
        }
      });
    }
  }, [customRegistry]);

  // Sync data updates to active scene properties
  useEffect(() => {
    const game = localGameRef.current;
    if (game && game.scene) {
      const activeScene = game.scene.getScene(sceneKey);
      if (activeScene) {
        activeScene.players = players;
        activeScene.clues = clues;
        activeScene.suspects = suspects;
        if (session) {
          activeScene.phase = session.phase;
          activeScene.revealPolicy = session.revealPolicy;
          activeScene.seatAssignments = session.seatAssignments || {};
          activeScene.voiceParticipants = session.voiceParticipants || {};
        }
      }
    }
  }, [players, clues, suspects, session, sceneKey]);

  // Sync ready-status updates to avatars/players in active scene
  useEffect(() => {
    const game = localGameRef.current;
    if (game && game.scene) {
      const activeScene = game.scene.getScene(sceneKey);
      if (activeScene && activeScene.playersMap) {
        players.forEach(p => {
          const sprite = activeScene.playersMap.get(p.playerId || p.id);
          if (sprite && sprite.active && typeof sprite.setReadyStatus === 'function') {
            sprite.setReadyStatus(p.isReady);
          }
        });
      }
    }
  }, [players, sceneKey]);

  return (
    <div 
      id="phaser-game-container" 
      ref={containerRef} 
      className="w-full h-full"
    />
  );
}
