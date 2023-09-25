const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "mario.castro.jr.23@gmail.com",
    pass: "jhxhhkejcyykubof",
  },
  tls: {
    ciphers: "SSLv3",
  },
});

module.exports = transporter;
