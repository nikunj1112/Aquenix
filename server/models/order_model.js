import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: String,
  phone: { type: String, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Assigned", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Pending"
  },
  deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  deliveryPersonName: String,
  scheduledTime: String,
  date: { type: String, default: new Date().toISOString().split('T')[0] },
  notes: String,
  amount: { type: Number, default: 0 },
  trackingHistory: [
    {
      status: { type: String, required: true },
      time: { type: Date, default: Date.now },
      description: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export const OrderCollection = mongoose.model("orders", orderSchema);

