import mongoose from "mongoose";

const authSchema = new mongoose.Schema({

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["admin", "delivery"],
    default: "delivery"
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }

});

export const AuthCollection = mongoose.model("auth", authSchema);