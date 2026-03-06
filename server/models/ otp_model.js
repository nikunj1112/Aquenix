import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({

  email: String,

  otp: String,

  expiry: Date

});

export const OtpCollection = mongoose.model("otp", otpSchema);