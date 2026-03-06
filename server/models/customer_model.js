import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String, required: true },
  address: String,
  subscription: {
    type: String,
    enum: ["Basic", "Standard", "Premium"],
    default: "Basic"
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  },
  joinDate: { type: Date, default: Date.now },
  notes: String,
  preference: String,
  createdAt: { type: Date, default: Date.now }
});

export const CustomerCollection = mongoose.model("customers", customerSchema);
