// controllers/databaseController.js
const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const databaseModel = require("../models/databaseModel.js");
const sql = require("mssql");
const config = require("../config/databaseConfig.js");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const fspromises = require("fs").promises;
const path = require("path");

async function fetchDataFromDatabase(req, res) {
  try {
    const queryResult = await databaseModel.queryDatabase(
      "SELECT * FROM tblcredential"
    );
    res.json(queryResult);
  } catch (err) {
    res.status(500).json({ error: "Internal  error" });
  }
}

async function getLoginByUser(req, res) {
  try {
    console.log(req.body);
    const { userid, pass } = req.body;
    if (!userid || !pass)
      return res
        .status(400)
        .json({ message: "Username and password are required." });

    await sql.connect(config);
    const request = new sql.Request();

    request.input("usernm", sql.VarChar, userid);
    request.input("pass", sql.VarChar, pass);

    const result = await request.execute("spEmpLogin");

    sql.close();

    if (result.recordset[0].Status !== true) return res.sendStatus(401);

    const accessToken = jwt.sign(
      {
        mkey: result.recordset[0].mkey,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ accessToken });
  } catch (err) {
    console.error("Error calling stored procedure:", err);
  }
}

module.exports = {
  fetchDataFromDatabase,
  getLoginByUser,
};
