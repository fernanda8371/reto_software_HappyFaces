const express = require("express")
const router = express.Router()
const { getLeaderboard, getUserRank } = require("../controllers/leaderboardController")
const { authenticateUser } = require("../middleware/auth")

// Apply authentication middleware to all routes
router.use(authenticateUser)

// Get leaderboard data
router.get("/", getLeaderboard)

// Get user's rank
router.get("/user/:userId", getUserRank)

module.exports = router
