// controllers/databaseController.js
const databaseModel = require("../models/databaseModel.js");
const sql = require("mssql");
const config = require("../config/databaseConfig.js");

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
    const { userid, pass } = req.body; // Assuming 'param1' and 'param2' are the parameter names in the request body

    await sql.connect(config);
    const request = new sql.Request();

    // Replace 'YourStoredProcedureName' with the name of your stored procedure
    request.input("usernm", sql.VarChar, userid);
    request.input("pass", sql.VarChar, pass); // Add input parameters if needed

    const result = await request.execute("spEmpLogin");
    console.log(result.recordset); // Process the results as needed

    sql.close();

    res.status(200).json(result.recordset);
    //res.status(200).send(result.recordset);
  } catch (err) {
    console.error("Error calling stored procedure:", err);
  }
}

module.exports = {
  fetchDataFromDatabase,
  getLoginByUser,
};
