import { successResponse } from '../utils/responseFormatter.js';
import GeminiService from '../ai/gemini.service.js';
import RoleEngine from '../engine/role/index.js';
import RoleEngineService from '../engine/role/service.js';
import RoleService from '../services/role.service.js';
import gameRepository from '../repositories/game.repository.js';

const aiClient = new GeminiService();
const roleEngine = new RoleEngine({ aiClient });
const roleEngineService = new RoleEngineService({ roleEngine });
const roleService = new RoleService({ roleEngine: roleEngineService });

export const assignRole = async (req, res, next) => {
  try {
    const { roomCode, playerId, playerName, seed } = req.body;

    const result = await roleService.assignRole({ roomCode, playerId, playerName, seed });

    successResponse(res, result.character, 'Role assigned and saved', 201);
  } catch (error) {
    next(error);
  }
};
