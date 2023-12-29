const nodemailer = require("nodemailer");

const emailController = {
  sendEmail: (email) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "megatreemall3@gmail.com", 
        pass: "kdks hwqs zkrv dlqh", 
      },
    });
    console.log('ccvx');

    const mailOptions = {
      from: "megatreemall3@gmail.com", 
      to: email,
      subject: "Account Created Successfully",
      text: `Your Account Has Successfully Been Created. Your Account Will Be Verified Within The Next 24 hours. Thank You`,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Email sent:", info.response);
          resolve(info.response);
        }
      });
    });
  },
};

module.exports = emailController;

