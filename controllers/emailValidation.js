// controllers/databaseController.js
const databaseModel = require("../models/databaseModel.js");
const sql = require("mssql");
const config = require("../config/databaseConfig.js");
const forgotpasswordsend = require("./forgotpasswordController.js");
const axios = require("axios");

async function forgotpasswordvalid(req, res) {
  try {
    console.log(req.body);
    const { empid, email } = req.body;

    await sql.connect(config);
    const request = new sql.Request();

    request.input("empid", sql.VarChar, empid);
    request.input("email", sql.VarChar, email);

    const result = await request.execute("spForgotPassword");
    const valid = result.recordset[0];

    res.status(200).json(result.recordset);
    sql.close();
  } catch (err) {
    console.error("Error calling stored procedure:", err);
  }
}

module.exports = {
  forgotpasswordvalid,
};
