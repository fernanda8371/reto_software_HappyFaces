const express = require("express")
const router = express.Router()
const adminController = require("../controllers/adminController")
const { authenticateUser, isAdmin } = require("../middleware/auth")

// Temporalmente desactivamos la autenticación para pruebas
// router.use(authenticateUser, isAdmin)

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

// Tags routes
router.get("/tags", adminController.getAllTags)

module.exports = router
