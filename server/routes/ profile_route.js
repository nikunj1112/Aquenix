import express from "express";

import {
  addUser,
  updateUser,
  getAllUser,
  getUserById,
  deleteUser,
  updateUserRole
} from "../controllers/profile_controller.js";

import { protect } from "../middleware/auth_middleware.js";
import { authorize } from "../middleware/role_middleware.js";

const router = express.Router();

/* ================= PROFILE ROUTES ================= */

// Add employee
router.post(
  "/add-user",
  protect,
  authorize("admin"),
  addUser
);

// Update employee
router.put(
  "/update-user",
  protect,
  authorize("admin"),
  updateUser
);

// Update role
router.put(
  "/update-role",
  protect,
  authorize("admin"),
  updateUserRole
);

// Get all users
router.get(
  "/get-all-users",
  protect,
  authorize("admin"),
  getAllUser
);

// Get user by email
router.get(
  "/get-user/:email",
  protect,
  authorize("admin"),
  getUserById
);

// Delete user
router.delete(
  "/delete-user/:email",
  protect,
  authorize("admin"),
  deleteUser
);

export default router; 