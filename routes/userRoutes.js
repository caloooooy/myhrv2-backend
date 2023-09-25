const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Define routes for the User model
router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);

module.exports = router;
