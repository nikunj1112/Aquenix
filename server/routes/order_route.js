import express from "express";
import {
  createOrder,
  updateOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  assignDeliveryPerson,
  getOrderStats,
  updateOrderStatus,
  getDeliveryPartnerOrders,
  getDeliveryPartnerStats
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

// Get order stats (for dashboard)
router.get(
  "/stats",
  protect,
  getOrderStats
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

// Assign delivery person (admin only)
router.put(
  "/assign-delivery/:id",
  protect,
  authorize("admin"),
  assignDeliveryPerson
);

// Update order status (for delivery person and admin)
router.put(
  "/update-status/:id",
  protect,
  authorize("admin", "delivery"),
  updateOrderStatus
);

// Get orders assigned to delivery partner
router.get(
  "/my-orders",
  protect,
  authorize("delivery"),
  getDeliveryPartnerOrders
);

// Get delivery partner stats
router.get(
  "/delivery-stats",
  protect,
  authorize("delivery"),
  getDeliveryPartnerStats
);

export default router;

