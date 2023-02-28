import nodemailer from "nodemailer";

const emailRegister = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token } = data;
  const info = await transport.sendMail({
    from: "Administrador de Veterinario APP <apv@correo.com>",
    to: `${email}`,
    subject: "Comprueba tu cuenta en APV",
    text: "Comprueba tu cuenta en APV",
    html: `<p>Hola: ${name}, comprueba tu cuenta en APV.</p>
    <p>Tu cuenta ya esta lista, compruebalo en el siguiente enlace:
    <a href="${process.env.FRONTEND_URL}/confirm/${token}">Comprobar cuenta </a></p>

    <p>Si no creaste esta cuenta, ignora este correo.</p>
    `,
  });
  console.log("Mensaje enviado: %s", info.messageId);
};

export default emailRegister;
