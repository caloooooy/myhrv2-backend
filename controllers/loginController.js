
const databaseModel = require("../models/databaseModel.js");
const sql = require("mssql");
const config = require("../config/databaseConfig.js");
const cookieparser = require('cookie-parser'); 
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
      { expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRES}
    );

    const refreshToken = jwt.sign({ 
      mkey: result.recordset[0].mkey
  }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRES}); 

  res.cookie('jwt', refreshToken, { httpOnly: true,  
    sameSite: 'None', secure: true,  
    maxAge: 24 * 60 * 60 * 1000 }); 


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


async function RefreshToken(req, res) {
  console.log(req.cookies);
  if (req.cookies?.jwt) { 
  
    // Destructuring refreshToken from cookie 
    const refreshToken = req.cookies.jwt; 
    console.log(refreshToken);

    // Verifying refresh token 
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,  
    (err, decoded) => { 
        if (err) { 

            // Wrong Refesh Token 
            return res.status(406).json({ message: 'Unauthorized' }); 
        } 
        else { 
            // Correct token we send a new access token 
            const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            req.user = verified;

            const accessToken = jwt.sign(
              {
                mkey: verified.mkey,
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRES}
            );
            return res.json({ accessToken }); 
        } 
    }) 
} else { 
    return res.status(406).json({ message: 'Unauthorized' }); 
}   
}


module.exports = {
  getLoginByUser,
  RefreshToken,
};
