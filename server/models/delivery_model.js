import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "orders" },
  customerName: { type: String, required: true },
  phone: String,
  address: { type: String, required: true },
  deliveryPerson: String,
  status: {
    type: String,
    enum: ["Pending", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Pending"
  },
  scheduledTime: String,
  actualDeliveryTime: Date,
  date: { type: String, default: new Date().toISOString().split('T')[0] },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

export const DeliveryCollection = mongoose.model("deliveries", deliverySchema);
