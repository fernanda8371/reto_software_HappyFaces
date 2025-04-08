// routes/challengesRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllChallenges, 
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  submitSolution,
  getUserChallenges
} = require('../controllers/challengeController');
const { authenticateUser, isAdmin } = require('../middleware/auth');

// Rutas públicas
router.get('/', getAllChallenges);
router.get('/:id', getChallengeById);

// Rutas que requieren autenticación
router.post('/:id/submit', authenticateUser, submitSolution);
router.get('/user/:userId?', authenticateUser, getUserChallenges);

// Rutas que requieren ser administrador
router.post('/', authenticateUser, isAdmin, createChallenge);
router.put('/:id', authenticateUser, isAdmin, updateChallenge);
router.delete('/:id', authenticateUser, isAdmin, deleteChallenge);

module.exports = router;