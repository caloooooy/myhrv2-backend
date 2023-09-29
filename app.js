// app.js
const express = require("express");
const app = express();
const databaseRoutes = require("./routes/loginRoutes");
const gettokenRoutes = require("./routes/gettoken");

// Middleware and other configurations can go here

// Use the database routes
app.use(express.json());

app.use("/api/login", databaseRoutes);
//app.use("/refresh", require("./routes/refresh"));
app.use("/api/gettoken", gettokenRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
