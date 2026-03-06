import express from "express";
import {
  addCustomer,
  updateCustomer,
  getAllCustomers,
  getCustomerById,
  deleteCustomer
} from "../controllers/customer_controller.js";
import { protect } from "../middleware/auth_middleware.js";
import { authorize } from "../middleware/role_middleware.js";

const router = express.Router();

/* ================= CUSTOMER ROUTES ================= */

// Add customer
router.post(
  "/add-customer",
  protect,
  authorize("admin"),
  addCustomer
);

// Update customer
router.put(
  "/update-customer/:id",
  protect,
  authorize("admin"),
  updateCustomer
);

// Get all customers
router.get(
  "/get-customers",
  protect,
  getAllCustomers
);

// Get customer by id
router.get(
  "/get-customer/:id",
  protect,
  getCustomerById
);

// Delete customer
router.delete(
  "/delete-customer/:id",
  protect,
  authorize("admin"),
  deleteCustomer
);

export default router;
