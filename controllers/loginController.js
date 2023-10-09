
const databaseModel = require("../models/databaseModel.js");
const sql = require("mssql");
const config = require("../config/databaseConfig.js");

const jwt = require("jsonwebtoken");
require("dotenv").config();



async function getLoginByUser(req, res) {
  try {
    
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

    res.json({ accessToken ,
      "Lastname" :  result.recordset[0].LastName,
      "SuffixName" :  result.recordset[0].SuffixName ,
      "FirstName" :  result.recordset[0].FirstName,
      "MiddleName" :  result.recordset[0].MiddleName,
      "NickName" :  result.recordset[0].NickName,
      "ProfilePict": result.recordset[0].ProfilePict
    });
  } catch (err) {
    console.error("Error calling stored procedure:", err);
  }
}

module.exports = {
  getLoginByUser,
};
