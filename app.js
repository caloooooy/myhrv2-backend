// app.js
const express = require("express");
const app = express();
const databaseRoutes = require("./routes/loginRoutes");

// Middleware and other configurations can go here

// Use the database routes
app.use("/api/login", databaseRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
