const nodemailer = require('nodemailer')
const mailTemplate = require('./mailTemplates')
const myLogger = require('./logger.js')

async function sendMail(template, username, email, verificationId, newPw, subject) {

    let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    secure: true,
    port: 465,
    auth: {
      user: "info@evak.hu",
      pass: "Zoltan91-dt",
    },
  });
  const emailTemplate = mailTemplate.setUp(template, username, email, verificationId, newPw)
  
  const mailOptions = {
    from: "EVAK Rendszer <info@evak.hu>",
    to: email,
    subject: subject,
    html: emailTemplate
   };

   transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
        myLogger("Email küldési hiba: sendMail.js: " + err)
    } else 
    {
        myLogger(template + " Email sent to " + email)
        myLogger("Message info: " + JSON.stringify(info))
      }
  })}

  module.exports = sendMail