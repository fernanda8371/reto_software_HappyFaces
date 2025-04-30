const express = require("express")
const router = express.Router()
const {
  getAllChallenges,
  getChallengeById,
  submitSolution,
  getUserChallengesProgress,
  getChallengeInsights,
} = require("../controllers/challengeController")
const { authenticateUser } = require("../middleware/auth")

// Apply authentication middleware to all routes
router.use(authenticateUser)

// Get all challenges
router.get("/", getAllChallenges)

// Get user's progress on challenges
router.get("/progress", getUserChallengesProgress)

// Get a single challenge by ID
router.get("/:id", getChallengeById)

// Submit a solution for a challenge
router.post("/:challengeId/submit", submitSolution)

router.get("/insights", getChallengeInsights)


module.exports = router


