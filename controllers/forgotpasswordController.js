// controllers/emailController.js
const transporter = require("../config/emailConfig");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const sql = require("mssql");
const config = require("../config/databaseConfig.js");
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function verifyEmpid(req,res)
{
    try {
    
      await poolConnect;
      const request = new sql.Request(pool);
   
      const { empid } = req.body;
      if (!empid)
      return res
        .status(400)
        .json({ message: "Employee ID is required" });

                request.input('empid', sql.VarChar, empid);

        const result = await request.query('SELECT dbo.fnVerifyEmpID(@empid) as Status');
    //const scalarResult = result.recordset[0].Result;

    sql.close();


    if (result.recordset[0].Status !== true) return res.sendStatus(401);

    const accessToken = jwt.sign(
      {
        mkey: empid,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({accessToken});
  } catch (err) {
    console.error("Error calling stored procedure:", err);
  }

}




// Send an email
async function sendMail(req, res) {

  const { email } = req.body;



  if (!email)
      return res
        .status(400)
        .json({ message: "Email are required." });

    await sql.connect(config);
    const request = new sql.Request();

    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Access Denied");
  
    try {
      const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      request.input("empid", sql.VarChar, verified.mkey);
      request.input("email", sql.VarChar, email);

  
      const result = await request.execute("spForgotPassword");
  
      sql.close();
  
      if (result.recordset[0].Status !== true) return res.sendStatus(401);

      
  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve("./emailtemplate/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./emailtemplate/"),
  };

  // use a template file with nodemailer
  transporter.use("compile", hbs(handlebarOptions));

 
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset - " + result.recordset[0].Empname + " - "+ Date.now(),
    template: "fpassword",
    context: {
      name: result.recordset[0].Empname,
      password: result.recordset[0].OTP,
    },

  };
  await transporter.sendMail(mailOptions);
    // res.send("Email sent successfully");
    res.status(200).json({ "result": 0, description: "Email sent successfully" });
      
    } catch {
      res.status(400).json({ "result": 1, description: error.message });
    }

}

async function verifyOTP(req,res)
{
    try {
    
      await poolConnect;
      const request = new sql.Request(pool);

      const { OTP } = req.body;
      if (!OTP)
      return res
        .status(400)
        .json({ message: "OTP is required" });

        const token = req.header("auth-token");
        if (!token) return res.status(401).send("Access Denied");

      const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      request.input("empid", sql.VarChar, verified.mkey);
      request.input("OTP", sql.VarChar, OTP);

      const result = await request.execute("spVerifyOTP");
    //const scalarResult = result.recordset[0].Result;

    sql.close();
   

    if (result.recordset[0].Status !== true) return res.sendStatus(401);

    
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error calling stored procedure:", err);
  }

}


async function ChangePassword(req,res)
{
    try {
    
      await poolConnect;
      const request = new sql.Request(pool);

      const { password } = req.body;
      if (!password)
      return res
        .status(400)
        .json({ message: "Password is required" });

        const token = req.header("auth-token");
        if (!token) return res.status(401).send("Access Denied");

      const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      request.input("empid", sql.VarChar, verified.mkey);
      request.input("password", sql.VarChar, password);

      const result = await request.execute("spChangePassword");
    //const scalarResult = result.recordset[0].Result;

    sql.close();
    

    if (result.recordset[0].Status !== true) return res.sendStatus(401);

    
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error calling stored procedure:", err);
  }

}

module.exports = {
  sendMail,
  verifyEmpid,
  verifyOTP,
  ChangePassword,
};
