import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  email: { type: String, unique: true, required: true },

  name: String,
  phone: String,
  address: String,
  education: String,
  age: Number,
  exp: String,
  image: String

});

export const UserCollection = mongoose.model("users", userSchema);