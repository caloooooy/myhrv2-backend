// controllers/emailController.js
const transporter = require("../config/emailConfig");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

async function verifyEmpid(req,res)
{
    try {
    console.log(req.body);
    const { empid } = req.body;
    if (!empid)
      return res
        .status(400)
        .json({ message: "Employee ID is required" });

    await sql.connect(config);
    const request = new sql.Request();
      console.log(rew.body.empid)
    request.query('SELECT dbo.fnVerifyEmpID ('+req.body+');',(err,result) =>{
      if(err){
        console.error('Error executing query:', err);
        return;
      }
      if (result.recordset[0].Status !== true) return res.sendStatus(401);

    });
    sql.close();
    res.json({ result: result.recordset[0].Status });
  } catch (err) {
    console.error("Error calling stored procedure:", err);
  }

}

// Send an email
async function sendMail(req, res) {

  const { email, name, password } = req.body;

  console.log(email);
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
    subject: "Test Email 9",
    template: "fpassword",
    context: {
      name: name,
      password: password,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    // res.send("Email sent successfully");
    res.status(200).json({ result: 0, description: "Email sent successfully" });
  } catch (error) {
    res.status(400).json({ result: 1, description: error.message });
  }
}

module.exports = {
  sendMail,
  verifyEmpid,
};
