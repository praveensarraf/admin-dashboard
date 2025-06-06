import express from 'express';
import { signup, login, logout, getMe } from '../controllers/authController.js';
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated, logout);
router.route("/me").get(isAuthenticated, getMe);

export default router;
