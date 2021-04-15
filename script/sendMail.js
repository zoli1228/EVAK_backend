const nodemailer = require('nodemailer')
const mailTemplate = require('./mailTemplates')

async function sendMail(username, email, verificationId, template) {

    let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    secure: true,
    port: 465,
    auth: {
      user: "info@evak.hu",
      pass: "Zoltan91-dt",
    },
  });
  const emailTemplate = mailTemplate.setUp(template, username, email, verificationId)
  
  const mailOptions = {
    from: "EVAK Rendszer <info@evak.hu>",
    to: email,
    cc: "info@evak.hu",
    subject: "Regisztráció megerősítése",
    html: emailTemplate
   };

   await transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
        console.log(err)
        res.send("Error: " + err)
    } else 
    {
        console.log(template + " Email sent to " + email)}
  })}

  module.exports = sendMail