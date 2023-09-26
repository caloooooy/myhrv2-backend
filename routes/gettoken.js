const express = require("express");
const router = express.Router();
const verify = require("./verifyJWT");

router.get("/", verify, (req, res) => {
  res.send(req.user.mkey);
});

module.exports = router;
