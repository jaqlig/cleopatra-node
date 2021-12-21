require('dotenv').config()
const nodemailer = require('nodemailer');

exports.sendNotification = function(mail, msg) {

    let transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    })
    
    message = {
        from: process.env.EMAIL_USER,
        to: mail,
        subject: "Cleopatra | Zarejestrowaliśmy dla Ciebie nową wizytę w salonie",
        text: msg,
    }
    
    transporter.sendMail(message, function (err, info) {
        if (err) console.log(err);
        else console.log(info);
    });

};
