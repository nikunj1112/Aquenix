import express from "express";
import {
  createDelivery,
  updateDelivery,
  getAllDeliveries,
  getDeliveryById,
  deleteDelivery
} from "../controllers/delivery_controller.js";
import { protect } from "../middleware/auth_middleware.js";
import { authorize } from "../middleware/role_middleware.js";

const router = express.Router();

/* ================= DELIVERY ROUTES ================= */

// Create delivery
router.post(
  "/create-delivery",
  protect,
  createDelivery
);

// Update delivery
router.put(
  "/update-delivery/:id",
  protect,
  updateDelivery
);

// Get all deliveries
router.get(
  "/get-deliveries",
  protect,
  getAllDeliveries
);

// Get delivery by id
router.get(
  "/get-delivery/:id",
  protect,
  getDeliveryById
);

// Delete delivery
router.delete(
  "/delete-delivery/:id",
  protect,
  authorize("admin"),
  deleteDelivery
);

export default router;
