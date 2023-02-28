import mongoose from "mongoose";
import bcrypt from "bcrypt";
import genId from "../helpers/genId.js";

const vetSchema = mongoose.Schema({
  name: {
    type: String,
    requierd: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  telephone: {
    type: String,
    default: null,
    trim: true,
  },
  web: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: genId(),
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
});

vetSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

vetSchema.methods.checkPassword = async function (passForm) {
  const match = bcrypt.compare(passForm, this.password);
  return match;
};

const Vet = mongoose.model("Vet", vetSchema);
export default Vet;
