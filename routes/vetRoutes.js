import express from "express";
import {
  signUp,
  profile,
  confirm,
  authenticate,
  forgetPassword,
  checkToken,
  newPassword,
  updateProfile,
  updatePassword,
} from "../controllers/vetController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", signUp);
router.get("/confirm/:token", confirm);
router.post("/login", authenticate);
router.post("/forget-password", forgetPassword);
router.route("/forget-password/:token").get(checkToken).post(newPassword);

//Routers privados
router.get("/profile", checkAuth, profile);
router.put("/profile/:id", checkAuth, updateProfile);
router.put("/update-password", checkAuth, updatePassword);

export default router;
