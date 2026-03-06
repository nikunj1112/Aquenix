import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserCollection } from "../models/user_model.js";
import { AuthCollection } from "../models/auth_model.js";
import { OtpCollection } from "../models/ otp_model.js";
import { sendOtpEmail } from "../services/service.js";


// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const existingUser = await AuthCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const profile = await UserCollection.create({
      email,
      name
    });

    await AuthCollection.create({
      email,
      password: hashedPassword,
      role: role || "delivery",
      user: profile._id
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// ================= SIGNIN =================
export const signin = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await AuthCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const expiry = new Date(Date.now() + 3 * 60 * 1000);

    await OtpCollection.findOneAndUpdate(
      { email },
      { otp, expiry },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otp);

    res.json({
      success: true,
      message: "OTP sent to email"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ================= VERIFY OTP =================
export const verifyOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const record = await OtpCollection.findOne({ email });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (record.expiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    await OtpCollection.deleteOne({ email });

    const user = await AuthCollection.findOne({ email });

    const token = jwt.sign({
      id: user._id,
      email: user.email,
      role: user.role
    }, process.env.SECRET_KEY, {
      expiresIn: "1h"
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 3600000
    });

    res.json({
      success: true,
      message: "Login successful"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ================= SIGNOUT =================
export const signout = (req, res) => {

  res.clearCookie("auth_token");

  res.json({
    success: true,
    message: "Logout successful"
  });

};


// ================= CHECK LOGIN =================
export const checkLoginStatus = (req, res) => {

  try {

    const token = req.cookies.auth_token;

    if (!token) {
      return res.json({
        loggedIn: false
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    res.json({
      loggedIn: true,
      user: decoded
    });

  } catch {

    res.json({
      loggedIn: false
    });

  }

};


// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {

  try {

    const { email, oldPassword, newPassword } = req.body;

    const user = await AuthCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Old password incorrect"
      });
    }

    const hashed = await bcrypt.hash(newPassword, 12);

    user.password = hashed;

    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await AuthCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const expiry = new Date(Date.now() + 3 * 60 * 1000);

    await OtpCollection.findOneAndUpdate(
      { email },
      { otp, expiry },
      { upsert: true }
    );

    await sendOtpEmail(email, otp);

    res.json({
      success: true,
      message: "OTP sent to email"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ================= CHANGE FORGOT PASSWORD =================
export const changeForgotPassword = async (req, res) => {

  try {

    const { email, otp, newPassword } = req.body;

    const record = await OtpCollection.findOne({ email });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found"
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (record.expiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    const hashed = await bcrypt.hash(newPassword, 12);

    await AuthCollection.updateOne(
      { email },
      { $set: { password: hashed } }
    );

    await OtpCollection.deleteOne({ email });

    res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};