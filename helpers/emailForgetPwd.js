import nodemailer from "nodemailer";

const emailForgetPwd = async (data) => {
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
    from: "Administrador de Veterinario APP",
    to: email,
    subject: "Recupera tu password",
    text: "Recupera tu password",
    html: `<p>Hola: ${name}, has solicitado recuperar tu password.</p>

    <p>Ves al siguiente enlace para generar un nuevo password:
    <a href="${process.env.FRONTEND_URL}/forget-password/${token}">Reestablecer password. </a></p>

    <p>Si no creaste esta cuenta, ignora este correo.</p>
    `,
  });
  console.log("Mensaje enviado: %s", info.messageId);
};

export default emailForgetPwd;
