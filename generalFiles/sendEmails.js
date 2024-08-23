import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

const { EMAIL_PASS, EMAIL, EMAIL_OWNER } = process.env;

const EMAIL_SETTINGS = {
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASS,
  },
};

export const sendEmailVerification = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport(EMAIL_SETTINGS);

    const mailOptions = {
      from: EMAIL,
      to: [email],
      html: `<h2>Děkujeme za registraci na naši stránce</h2> <p>Prosím, ověřte svůj e-mailovou adresu.</p> <a href="http://localhost:3000/verify/${token}">Ověřit email!</a>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export const sendEmailRecoveryPassword = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport(EMAIL_SETTINGS);

    const mailOptions = {
      from: EMAIL,
      to: [email],
      html: `<p>Pro obnovení hesla stačí kliknout na <a href="http://localhost:3000/password/${token}">Obnovit heslo</a>.</p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export const sendEmailForOwnerCreateOrder = async (
  { name, surname, message, email, phone },
  attachments
) => {
  try {
    const transporter = nodemailer.createTransport(EMAIL_SETTINGS);

    const mailOptions = {
      from: EMAIL,
      to: [EMAIL_OWNER],
      html: `

<h2>Dobré odpoledne, pane Štefánek</h2>
<h3>Pan ${name} ${surname}, dnes zaregistroval objednávku na webových stránkách: </h3>
      <h4>kontaktní údaje:</h4>
      <ul><li><a href="tel:${phone}">${phone}</a></li><li><a href="mailto:${email}">${email}</a></li></ul>
            <h4>Zpráva od zákazníka</h4>
            <p> "${message} "</p>
            `,
      attachments,
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.log(error);
  }
};

export const sendEmailCreatePassword = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: EMAIL,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: [email],
      html: `<a href="http://localhost:3000/api/users/${token}">Register account</a>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export const sendEmailCreateOrder = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: EMAIL,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: [email],
      html: "<p>Thank</p>",
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export const sendEmailCreateReviews = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: EMAIL,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: [EMAIL_OWNER],
      html: "<p>You have a new review</p>",
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
