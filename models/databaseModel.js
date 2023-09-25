// models/databaseModel.js
//import config from "../config/databaseConfig";
const sql = require("mssql");
const config = require("../config/databaseConfig");

async function queryDatabase(query) {
  try {
    await sql.connect(config);
    const result = await sql.query(query);
    return result.recordset;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    sql.close();
  }
}

module.exports = {
  queryDatabase,
};
