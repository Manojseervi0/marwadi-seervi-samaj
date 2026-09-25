const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, text }) {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_PORT == 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      await transporter.sendMail({
        from: `"Marwadi Portal" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
      });
      return true;
    } catch (err) {
      console.error('[Email Service] Error sending email:', err);
      return false;
    }
  } else {
    // Development mode fallback
    console.log(`\n[Email Service - DEV MODE] Email intended for ${to}:`);
    console.log(`Subject: ${subject}`);
    console.log(`Text: ${text}\n`);
    return true;
  }
}

module.exports = { sendEmail };
