// routes/databaseRoutes.js
const express = require("express");
const router = express.Router();
const databaseController = require("../controllers/loginController");
const forgotpassword = require("../controllers/forgotpasswordController");
const emailvalidator = require("../controllers/emailValidation");

router.use(express.json());

// Define routes and map them to controller functions
router.get("/data", databaseController.fetchDataFromDatabase);
router.post("/login", databaseController.getLoginByUser);
router.post("/email/forgotpassword", forgotpassword.sendMail);
router.post("/forgotpassword", emailvalidator.forgotpasswordvalid);

module.exports = router;
