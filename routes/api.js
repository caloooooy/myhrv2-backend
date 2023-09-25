const express = require("express");
const router = express.Router();

// Define a route that queries the database
router.get("/data", async (req, res) => {
  try {
    const result = await req.pool.request().query("SELECT * FROM thremployee");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res.status(500).send("Database query error");
  }
});

module.exports = router;
