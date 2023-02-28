import Vet from "../models/Vet.js";
import genJWT from "../helpers/genJWT.js";
import genId from "../helpers/genId.js";
import emailRegister from "../helpers/emailRegister.js";
import emailForgetPwd from "../helpers/emailForgetPwd.js";

const signUp = async (req, res) => {
  const { name, email } = req.body;
  const existUser = await Vet.findOne({ email });
  if (existUser) {
    console.log(`${name} ya existe`);
    const error = new Error("Usuario ya registrado");
    return res.status(404).json({ msg: error.message });
  }

  try {
    //Guarda un nuevo veterinario en mongoDB
    const vet = new Vet(req.body);
    const vetSaved = await vet.save();

    emailRegister({
      email,
      name,
      token: vetSaved.token,
    });
    res.json(vetSaved);
  } catch (error) {
    console.log(error);
  }
};

const profile = (req, res) => {
  const { vet } = req;
  res.json(vet);
};

const confirm = async (req, res) => {
  const token = req.params.token;

  const confirmToken = await Vet.findOne({ token });
  if (!confirmToken) {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    confirmToken.token = null;
    confirmToken.confirmed = true;
    await confirmToken.save();
    res.json({ msg: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const authenticate = async (req, res) => {
  const { email, password } = req.body;

  const user = await Vet.findOne({ email });
  if (!user) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  if (!user.confirmed) {
    const error = new Error("Usuario no confirmado");
    return res.status(404).json({ msg: error.message });
  }

  const match = await user.checkPassword(password);

  if (match) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: genJWT(user.id),
    });
    console.log("token generado correctamente");
  } else {
    console.log("password incorrecto y token no generado");
    const error = new Error("Password incorrecto");
    return res.status(404).json({ msg: error.message });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const existsVet = await Vet.findOne({ email });
  if (!existsVet) {
    const error = new Error("EL usuario no existe");
    return res.status(400).json({ msg: error.message });
  }
  try {
    existsVet.token = genId();
    await existsVet.save();

    emailForgetPwd({
      email,
      name: existsVet.name,
      token: existsVet.token,
    });

    res.json({ msg: "Te llegará un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const checkToken = async (req, res) => {
  const { token } = req.params;
  const validToken = await Vet.findOne({ token });

  if (validToken) {
    res.json({ msg: "Token valido y el usuario existe" });
  } else {
    const error = new Error("Token no valido");
    return res.status(400).json({ msg: error.message });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const vet = await Vet.findOne({ token });
  if (!vet) {
    const error = new Error("Ha habido un eror");
    return res.status(400).json({ msg: error.message });
  }

  try {
    vet.token = null;
    vet.password = password;
    await vet.save();
    res.json({ msg: "Password modificado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const updateProfile = async (req, res) => {
  const vet = await Vet.findById(req.params.id);
  if (!vet) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }
  const { email } = req.body;
  if (vet.email !== req.body.email) {
    const existsEmail = await Vet.findOne({ email });
    if (existsEmail) {
      const error = new Error("Este usuario/email ya existe");
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    vet.name = req.body.name;
    vet.web = req.body.web;
    vet.telephone = req.body.telephone;
    vet.email = req.body.email;

    const vetUpdated = await vet.save();
    res.json(vetUpdated);
  } catch (error) {
    console.log(error);
  }
};

const updatePassword = async (req, res) => {
  const { id } = req.vet;
  const { pwd_actual, pwd_new } = req.body;

  //Comprobar que el usuario/vet existe
  const vet = await Vet.findById(id);
  if (!vet) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }
  //Comprobar que el pwd que se escribe en el imput coincide con la BD
  if (await vet.checkPassword(pwd_actual)) {
    //Guardar nuevo password
    vet.password = pwd_new;
    await vet.save();
    res.json({ msg: "Password almacenado correctamente" });
  } else {
    const error = new Error("EL password actual es incorrecto");
    return res.status(400).json({ msg: error.message });
  }

  //Almacenar cambios
};

export {
  signUp,
  profile,
  confirm,
  authenticate,
  forgetPassword,
  checkToken,
  newPassword,
  updateProfile,
  updatePassword,
};
