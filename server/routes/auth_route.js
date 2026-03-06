import express from "express";

import {
  signup,
  signin,
  verifyOTP,
  signout,
  checkLoginStatus,
  changePassword,
  forgotPassword,
  changeForgotPassword
} from "../controllers/auth_controller.js";

const router = express.Router();

/* ================= AUTH ROUTES ================= */

// Signup
router.post("/signup", signup);

// Signin (send OTP)
router.post("/signin", signin);

// Verify OTP
router.post("/verify-otp", verifyOTP);

// Logout
router.post("/signout", signout);

// Check login
router.get("/check-login", checkLoginStatus);

// Change password
router.post("/change-password", changePassword);

// Forgot password (send OTP)
router.post("/forgot-password", forgotPassword);

// Reset password using OTP
router.post("/change-forgot-password", changeForgotPassword);

export default router;