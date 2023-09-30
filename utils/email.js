const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const Transport = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Brijesh Sajeev <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      // return nodemailer.createTransport({
      //   service: 'SendGrid',
      //   auth: {
      //     user: process.env.SENDGRID_USERNAME,
      //     pass: process.env.SENDGRID_PASSWORD,
      //   },
      // });
      return nodemailer.createTransport(
        new Transport({ apiKey: process.env.API_KEY_BREVO }),
      );
    }

    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    // auth: {
    //   user: process.env.EMAIL_USERNAME,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    return nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'a96c3d66fc5845',
        pass: '74a080c54c4588',
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText.convert(html),
      html,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};

/*
const sendEmail = async (options) => {
  // 1 Create Transporter
  // const transporter = nodemailer.createTransport({
  //   host: 'sandbox.smtp.mailtrap.io',
  //   port: 465,
  //   auth: {
  //     user: 'a96c3d66fc5845',
  //     pass: '74a080c54c4588',
  //   },
  // });
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

*/
