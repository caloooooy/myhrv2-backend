// controllers/databaseController.js
const databaseModel = require("../models/databaseModel.js");
const sql = require("mssql");
const config = require("../config/databaseConfig.js");
const forgotpasswordsend = require("./forgotpasswordController.js");
const axios = require("axios");

async function forgotpasswordvalid(req, res) {
  try {
    console.log(req.body);
    const { empid, email } = req.body; // Assuming 'param1' and 'param2' are the parameter names in the request body

    await sql.connect(config);
    const request = new sql.Request();

    // Replace 'YourStoredProcedureName' with the name of your stored procedure
    request.input("empid", sql.VarChar, empid);
    request.input("email", sql.VarChar, email); // Add input parameters if needed

    const result = await request.execute("spForgotPassword");
    const valid = result.recordset[0];

    console.log(result.recordset); // Process the results as needed
    res.status(200).json(result.recordset);
    sql.close();

    //res.status(200).send(result.recordset);
  } catch (err) {
    console.error("Error calling stored procedure:", err);
  }
}

module.exports = {
  forgotpasswordvalid,
};
