import express from "express";
import {
  createOrder,
  updateOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  assignDeliveryPerson
} from "../controllers/order_controller.js";
import { protect } from "../middleware/auth_middleware.js";
import { authorize } from "../middleware/role_middleware.js";

const router = express.Router();

/* ================= ORDER ROUTES ================= */

// Create order
router.post(
  "/create-order",
  protect,
  createOrder
);

// Update order
router.put(
  "/update-order/:id",
  protect,
  updateOrder
);

// Get all orders
router.get(
  "/get-orders",
  protect,
  getAllOrders
);

// Get order by id
router.get(
  "/get-order/:id",
  protect,
  getOrderById
);

// Delete order
router.delete(
  "/delete-order/:id",
  protect,
  authorize("admin"),
  deleteOrder
);

// Assign delivery person
router.put(
  "/assign-delivery/:id",
  protect,
  authorize("admin"),
  assignDeliveryPerson
);

export default router;
