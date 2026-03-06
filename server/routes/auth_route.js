import express from "express";

import {
  signup,
  signin,
  verifyOTP,
  resendOTP,
  signout,
  checkLoginStatus,
  changePassword,
  forgotPassword,
  changeForgotPassword,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployees
} from "../controllers/auth_controller.js";

const router = express.Router();

/* ================= AUTH ROUTES ================= */

// Signup (Admin creates employees)
router.post("/signup", signup);

// Signin (send OTP)
router.post("/signin", signin);

// Resend OTP
router.post("/resend-otp", resendOTP);

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

/* ================= EMPLOYEE MANAGEMENT (Admin Only) ================= */

// Get all employees
router.get("/employees", getAllEmployees);

// Create new employee
router.post("/employees", createEmployee);

// Update employee
router.put("/employees/:id", updateEmployee);

// Delete (deactivate) employee
router.delete("/employees/:id", deleteEmployee);

export default router;
