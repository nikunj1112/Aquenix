import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  // Employee-specific fields
  designation: String,
  salary: Number,
  aadharCard: String,
  vehicleNumber: String,
  licenseNumber: String,
  area: String,
  // Employee status
  isActive: {
    type: Boolean,
    default: true
  },
  joinDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const UserCollection = mongoose.model("users", userSchema);
