// routes/databaseRoutes.js
const express = require("express");
const router = express.Router();
const databaseController = require("../controllers/loginController");
const forgotpassword = require("../controllers/forgotpasswordController");
const emailvalidator = require("../controllers/emailValidation");

router.use(express.json());

// Define routes and map them to controller functions
router.post("/", databaseController.getLoginByUser);
router.post("/forgotpassword", forgotpassword.sendMail);
router.get("/VerifyEmpid", forgotpassword.verifyEmpid);
router.get("/VerifyOTP", forgotpassword.verifyOTP);
router.post("/ChangePassword", forgotpassword.ChangePassword);


module.exports = router;
