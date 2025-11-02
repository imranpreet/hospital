const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text){
  if (!process.env.SMTP_USER) {
    console.log(`[notifier] To: ${to} | Subject: ${subject} | Text: ${text}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  try{
    await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text });
    console.log('[notifier] email sent to', to);
  }catch(err){
    console.error('[notifier] email error', err.message);
  }
}

module.exports = sendEmail;
