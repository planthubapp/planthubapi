var nodemailer = require("nodemailer");
var {decryptPass} = require('../locales/temp');


function sendmail(to,subject,body)
{
    var password = decryptPass(process.env.PASS);
    const transporter = nodemailer.createTransport({
    port: 465, // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
    user: process.env.EMAIL,
    pass: password,
    },
    secure: true,
});

const mailOptions = {
    from: process.env.EMAIL, // sender address
    to:to, // list of receivers
    subject:subject,
    text:body,
};

transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
});
}
module.exports = sendmail;