const nodemailer=require("nodemailer")
const config=require("config");
const gmailPass=process.env.GMAIL || config.get("gmailPassword")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:"onl.lot.win@gmail.com",
      pass: gmailPass
    }
  });

  const sendEmailToWinner=(moneysWon, email, userName, )=>{

    const mailOptions = {
        from: "onl.lot.win@gmail.com",
        to: email,
        subject: "Congratulations",
        text: `Congratulations ${userName} You have won ${moneysWon} euros.`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  }

module.exports=sendEmailToWinner