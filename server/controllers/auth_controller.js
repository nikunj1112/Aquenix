import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserCollection } from "../models/user_model.js";
import { AuthCollection } from "../models/auth_model.js";
import { OtpCollection } from "../models/ otp_model.js";
import { sendOtpEmail } from "../services/service.js";


// ================= SIGNUP (Admin creates employees) =================
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Only admin can create new users
    // For now, allow signup for admin, otherwise default to delivery
    
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await AuthCollection.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or phone already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const profile = await UserCollection.create({
      email,
      name,
      phone
    });

    // Determine role - default to delivery employee
    const userRole = role === "admin" ? "admin" : "delivery";

    await AuthCollection.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: userRole,
      user: profile._id
    });

    res.status(201).json({
      success: true,
      message: `User registered successfully as ${userRole}`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= SIGNIN (Send OTP) =================
export const signin = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Accept either email or phone
    const loginField = email || phone;
    
    if (!loginField) {
      return res.status(400).json({
        success: false,
        message: "Email or phone is required"
      });
    }

    // Find user by email or phone
    const user = await AuthCollection.findOne({
      $or: [{ email: loginField }, { phone: loginField }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user is active
    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Contact admin."
      });
    }

    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in database
    await OtpCollection.findOneAndUpdate(
      { email: user.email },
      { otp, expiry, phone: user.phone },
      { upsert: true, returnDocument: 'after' }
    );

    // Send OTP via email
    await sendOtpEmail(user.email, otp);

    // Also try to send SMS (if service available)
    // await sendOtpSms(user.phone, otp);

    res.json({
      success: true,
      message: "OTP sent to your email",
      email: user.email // Return email for OTP verification
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

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    const record = await OtpCollection.findOne({ email });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired"
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (record.expiry < new Date()) {
      await OtpCollection.deleteOne({ email });
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    // Find user
    const user = await AuthCollection.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user is active
    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated"
      });
    }

    // Generate JWT token
    const token = jwt.sign({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    }, process.env.SECRET_KEY, {
      expiresIn: "7d"
    });

    // Delete OTP after successful verification
    await OtpCollection.deleteOne({ email });

    // Set HTTP-only cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict"
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= RESEND OTP =================
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await AuthCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate new OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await OtpCollection.findOneAndUpdate(
      { email },
      { otp, expiry },
      { upsert: true, returnDocument: 'after' }
    );

    await sendOtpEmail(email, otp);

    res.json({
      success: true,
      message: "OTP resent successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= LOGOUT =================
export const signout = (req, res) => {
  res.clearCookie("auth_token");
  res.json({
    success: true,
    message: "Logout successful"
  });
};


// ================= CHECK LOGIN STATUS =================
export const checkLoginStatus = async (req, res) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.json({
        loggedIn: false
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Get fresh user data
    const user = await AuthCollection.findById(decoded.id).select('-password');

    if (!user || user.isActive === false) {
      return res.json({
        loggedIn: false
      });
    }

    res.json({
      loggedIn: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone
      }
    });

  } catch {
    res.json({
      loggedIn: false
    });
  }
};


// ================= CHANGE PASSWORD (Authenticated User) =================
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await AuthCollection.findById(decoded.id);

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
        message: "Current password is incorrect"
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


// ================= FORGOT PASSWORD (Send OTP) =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await AuthCollection.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      return res.json({
        success: true,
        message: "If email exists, OTP will be sent"
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await OtpCollection.findOneAndUpdate(
      { email },
      { otp, expiry, purpose: "password_reset" },
      { upsert: true, returnDocument: 'after' }
    );

    await sendOtpEmail(email, otp);

    res.json({
      success: true,
      message: "If email exists, OTP will be sent"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= RESET FORGOT PASSWORD =================
export const changeForgotPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required"
      });
    }

    const record = await OtpCollection.findOne({ email });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired"
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (record.expiry < new Date()) {
      await OtpCollection.deleteOne({ email });
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


// ================= ADMIN: CREATE EMPLOYEE =================
export const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, password, role, designation, area } = req.body;

    // Verify admin is making the request
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can create employees" });
    }

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await AuthCollection.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or phone already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const profile = await UserCollection.create({
      email,
      name,
      phone,
      designation: designation || "Delivery Boy",
      area
    });

    const userRole = role === "admin" ? "admin" : "delivery";

    await AuthCollection.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: userRole,
      user: profile._id
    });

    res.status(201).json({
      success: true,
      message: `Employee created successfully as ${userRole}`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= ADMIN: UPDATE EMPLOYEE =================
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, designation, area, isActive } = req.body;

    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can update employees" });
    }

    const user = await AuthCollection.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Update auth collection
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (isActive !== undefined) user.isActive = isActive;
    await user.save();

    // Update user profile
    if (user.user) {
      await UserCollection.findByIdAndUpdate(user.user, {
        $set: { designation, area, updatedAt: new Date() }
      });
    }

    res.json({
      success: true,
      message: "Employee updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= ADMIN: DELETE EMPLOYEE =================
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can delete employees" });
    }

    const user = await AuthCollection.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Don't allow deleting admin
    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "Cannot delete admin" });
    }

    // Soft delete - deactivate instead of delete
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: "Employee deactivated successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= ADMIN: GET ALL EMPLOYEES =================
export const getAllEmployees = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can view employees" });
    }

    const employees = await AuthCollection.find({ role: "delivery" })
      .select('-password')
      .populate('user', 'designation area')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      employees
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

