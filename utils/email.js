const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1 Create Transporter
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 465,
    auth: {
      user: 'a96c3d66fc5845',
      pass: '74a080c54c4588',
    },
  });
  //   2 Define the email option
  const mailOptions = {
    from: 'Brijesh sajeev <hello@brijesh.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3 Send the mail
  console.log('hello00');
  const info = await transporter.sendMail(mailOptions);
  console.log(info);
};

module.exports = sendEmail;
