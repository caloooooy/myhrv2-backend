// app.js
const express = require("express");
const cors = require("cors");
const app = express();
const databaseRoutes = require("./routes/loginRoutes");
const gettokenRoutes = require("./routes/gettoken");
const cookieparser = require('cookie-parser'); 
// Middleware and other configurations can go here

// Use the database routes
app.use(express.json());
app.use(cookieparser());

// Allow requests from localhost:3000
const corsOptions = {
  origin: process.env.LOCAL_FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies to be sent with the request if needed
};

app.use(cors(corsOptions));

app.use("/api/login", databaseRoutes);
//app.use("/refresh", require("./routes/refresh"));
app.use("/api/gettoken", gettokenRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
