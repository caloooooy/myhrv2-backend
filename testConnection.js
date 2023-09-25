const sql = require("mssql");

// Connection configuration
const config = {
  server: "10.244.5.244", // Replace with your server address
  //A2GMK2SVRDB0001
  username: "sa",
  password: "essbu2013",
  database: "MYHR-AHRC", // Replace with your database name
  port: 1433,
  define: {
    timestamps: false, // Disable timestamps for simplicity
  },
  options: {
    encrypt: true, // Use encryption for secure connection (recommended)
    cryptoCredentialsDetails: {
      minVersion: "TLSv1.2", // Specify the desired TLS version
    },
  },
};

async function testConnection() {
  try {
    // Connect to the database
    await sql.connect(config);
    console.log("Connected to SQL Server");
  } catch (error) {
    console.error("Error connecting to SQL Server:", error.message);
  } finally {
    // Close the connection (important to release resources)
    await sql.close();
  }
}

// Call the testConnection function
testConnection();
