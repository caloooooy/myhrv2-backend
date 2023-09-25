// config/databaseConfig.js
require("dotenv").config();
const sql = require("mssql");

const config = {
  server: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // Replace with your database name
  port: parseInt(process.env.DB_PORT),
  define: {
    timestamps: false, // Disable timestamps for simplicity
  },
  options: {
    encrypt: false, // Use encryption for secure connection (recommended)
    trustServerCertificate: false,
    cryptoCredentialsDetails: {
      minVersion: "TLSv1.2", // Specify the desired TLS version
    },
    requestTimeout: 30000,
  },
};

console.log(config);
module.exports = config;
