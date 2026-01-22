//nodemailer setup
import { WELCOME_EMAIL_TEMPLATE } from "./templates";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});
//creating a helper function that will send email through transporter
export const sendWelcomeEmail = async ({
  email,
  name,
  intro,
}: WelcomeEmailData) => {
  //html temlate to send
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace(
    "{{intro}}",
    intro,
  );

  //mail options
  const mailOptions = {
    from: `"Stocks App" <stocksapp@gmail.com`,
    to: email,
    subject: "Welcome to Stocks App - Your stock market tool is ready",
    text: "Thanks for joning Stocks app",
    html: htmlTemplate,
  };
  await transporter.sendMail(mailOptions);
};
