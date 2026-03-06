import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  subscription: {
    type: String,
    enum: ["Basic", "Standard", "Premium"],
    default: "Basic"
  },
  deliveryPreferences: {
    timeSlot: { type: String, default: "Morning" },
    instructions: String
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  },
  joinDate: { type: Date, default: Date.now },
  notes: String,
  // Order history (references to orders)
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "orders"
  }],
  // Payment records
  payments: [{
    amount: Number,
    date: Date,
    method: String,
    status: String,
    transactionId: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const CustomerCollection = mongoose.model("customers", customerSchema);
