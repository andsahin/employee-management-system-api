import Handlebars from "handlebars";
import nodemailer from "nodemailer";

export const sendEmail = async (source, replacements, to, subject) => {
  const template = Handlebars.compile(source);
  const htmlToSend = template(replacements);

  var transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.SMTP_EMAIL_ADDRESS,
      pass: process.env.SMTP_EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: "",
    to: to,
    subject: subject, //"Reset Password Request",
    html: htmlToSend,
  };

  return await transporter.sendMail(mailOptions);
};
