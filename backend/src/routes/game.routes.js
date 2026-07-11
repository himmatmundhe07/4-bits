import express from 'express';
import * as gameController from '../controllers/game.controller.js';
import * as gameValidator from '../validators/game.validator.js';
import * as investigationController from '../controllers/investigation.controller.js';
import validate from '../middleware/validate.js';
import GameSession from '../models/gameSession.model.js';
import Game from '../models/game.model.js';

const router = express.Router();

router.post('/', 
  gameValidator.createGameValidator, 
  validate, 
  gameController.createGame
);

router.get('/:code', 
  gameValidator.roomIdValidator, 
  validate, 
  gameController.getGame
);

router.post('/:code/join', 
  gameValidator.joinGameValidator, 
  validate, 
  gameController.joinGame
);

router.post('/:code/leave', 
  gameValidator.actionValidator, 
  validate, 
  gameController.leaveGame
);

router.get('/:code/players', 
  gameValidator.roomIdValidator, 
  validate, 
  gameController.getPlayers
);

router.patch('/:code/player/:playerId/ready', 
  gameValidator.playerIdValidator, 
  validate, 
  gameController.toggleReady
);

router.post('/:code/start', 
  gameValidator.hostActionValidator, 
  validate, 
  gameController.startGame
);

router.get('/:code/character/:playerId', 
  gameValidator.playerIdValidator, 
  validate, 
  gameController.getCharacter
);

router.get('/:code/session', 
  gameValidator.roomIdValidator, 
  validate, 
  gameController.getGameSession
);

router.get('/:code/session/character/:playerId', 
  gameValidator.playerIdValidator, 
  validate, 
  gameController.getGameSessionCharacter
);

router.post('/:code/action', 
  investigationController.submitAction
);

router.get('/:code/logs', 
  investigationController.getLogs
);

router.post('/:code/start-vote', 
  investigationController.startVoting
);

router.post('/:code/vote', 
  investigationController.castVote
);

router.delete('/:code', 
  gameValidator.hostActionValidator, 
  validate, 
  gameController.deleteGame
);

/**
 * GET /:code/epilogue
 * Returns the epilogue text and round-event timeline for the end-game
 * Case Summary Dossier. Derives data from existing session — no new AI call.
 */
router.get('/:code/epilogue', async (req, res) => {
  try {
    const code = (req.params.code || '').toUpperCase();
    const session = await GameSession.findOne({ roomCode: code });
    const game = await Game.findOne({ roomCode: code });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Build a concise epilogue sentence from the solution's fullExplanation.
    // We take the first two sentences to keep it 1-2 lines.
    const fullExp = session.solution?.fullExplanation || '';
    const sentences = fullExp.match(/[^.!?]+[.!?]+/g) || [fullExp];
    const epilogueText = sentences.slice(0, 2).join(' ').trim() ||
      `${session.murderer} was responsible for the death of ${session.victim} at ${session.location}.`;

    // Build round events from AI log entries
    const roundEvents = [];
    let cluesThisRound = 0;
    let currentRound = 1;
    const votedOutPlayers = [];

    for (const log of session.logs) {
      if (log.type !== 'ai') continue;
      const t = log.text || '';

      if (t.includes('[ROUND START]')) {
        if (cluesThisRound > 0) {
          roundEvents.push(`Round ${currentRound}: ${cluesThisRound} clue${cluesThisRound > 1 ? 's' : ''} discovered by investigators`);
          cluesThisRound = 0;
        }
        const m = t.match(/Round (\d+)/);
        if (m) currentRound = parseInt(m[1], 10);
      } else if (t.includes('[EMERGENCY MEETING]')) {
        const m = t.match(/Investigator (.+?) has called/);
        if (m) roundEvents.push(`Round ${currentRound}: Emergency meeting called by ${m[1]}`);
      } else if (t.toLowerCase().includes('clue') || t.toLowerCase().includes('evidence')) {
        cluesThisRound++;
      }
    }

    // Add any remaining clues from final round
    if (cluesThisRound > 0) {
      roundEvents.push(`Round ${currentRound}: ${cluesThisRound} clue${cluesThisRound > 1 ? 's' : ''} discovered by investigators`);
    }

    // Add final vote summary from session characters
    if (session.votingState?.eliminatedId) {
      const elim = session.characters.find(c => c.playerId === session.votingState.eliminatedId);
      const murdChar = session.characters.find(c => c.isMurderer);
      const isGuilty = session.votingState.eliminatedId === murdChar?.playerId;
      if (elim) {
        roundEvents.push(
          `Final vote: ${elim.name} was accused and found ${isGuilty ? 'GUILTY' : 'innocent'}`
        );
      }
    }

    res.json({ epilogueText, roundEvents });
  } catch (err) {
    console.error('[Epilogue] Error:', err.message);
    res.status(500).json({ error: 'Failed to generate epilogue' });
  }
});

export default router;
