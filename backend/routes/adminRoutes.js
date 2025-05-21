// Update in backend/routes/adminRoutes.js
// The issue might be that you've commented out the authentication middleware

const express = require("express")
const router = express.Router()
const adminController = require("../controllers/adminController")
const { authenticateUser, isAdmin } = require("../middleware/auth")

// REMOVE THIS COMMENT - Authentication is needed for production
router.use(authenticateUser, isAdmin)

// User management routes
router.get("/users", adminController.getAllUsers)
router.get("/users/:id", adminController.getUserById)
router.post("/users", adminController.createUser)
router.put("/users/:id", adminController.updateUser)
router.delete("/users/:id", adminController.deleteUser)

// Challenge management routes
router.get("/challenges", adminController.getAllChallenges)
router.get("/challenges/:id", adminController.getChallengeById)
router.post("/challenges", adminController.createChallenge)
router.put("/challenges/:id", adminController.updateChallenge)
router.delete("/challenges/:id", adminController.deleteChallenge)
// In adminRoutes.js
router.get("/challenges/:id/submissions", adminController.getChallengeSubmissions)
// Tags routes
router.get("/tags", adminController.getAllTags)
// En adminRoutes.js
router.get("/insights/active-users", adminController.getActiveUsersInsights)
router.get("/insights/problems-solved", adminController.getProblemsSolvedInsights)
router.get("/insights/task-status", adminController.getTaskStatusInsights)

module.exports = router