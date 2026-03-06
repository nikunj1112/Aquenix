// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import  { UserCollection } from '../models/user_model.js';
// import { AuthCollection } from '../models/auth_model.js';
// import { OtpCollection } from '../models/otp_model.js';
// import { sendOtpEmail } from '../services/service.js';


// // User Signup Controller
// export const signup = async (req, res) => {
//     try {
//       const { name, email, password, role } = req.body;
//       if (!name || !email || !password) {
//         return res.status(400).json({
//           success: false,
//           message: "All fields are required"
//         });
//       }
  
//       const existingUser = await AuthCollection.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({
//           success: false,
//           message: "Email already registered"
//         });
//       }
  
//       const hashedPassword = await bcrypt.hash(password, 12);
  
//       const profile = await UserCollection.create({
//         email,
//         name
//       });
  
//       await AuthCollection.create({
//         name,
//         email,
//         password: hashedPassword,
//         role: role || "delivery",
//         user: profile._id
//       });
  
//       return res.status(201).json({
//         success: true,
//         message: "User registered successfully"
//       });
  
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: "Signup failed",
//         error: error.message
//       });
//     }
//   };


// // User Signin & send opt Controller 
// export const signin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) { // Validate input
//             return res.status(400).json({
//                 success: false,
//                 message: "Email and password are required"
//             });
//         }

//         const user = await AuthCollection.findOne({ email }); // Find user by email
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid email or password"
//             });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password); // Check password
//         if (!isPasswordValid) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid email or password"
//             });
//         }

//         const otp = String(Math.floor(100000 + Math.random() * 900000));// Generate 6-digit OTP
//         const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

//         await OtpCollection.findOneAndUpdate( // Store OTP in DB
//             { email },
//             { otp, expiry },
//             { upsert: true, new: true }
//         );

//         await sendOtpEmail(email, otp); // Send OTP to email

//         return res.status(200).json({ // Success response
//             success: true,
//             message: "OTP sent to email"
//         });

//     } catch (error) { // Error handling
//         return res.status(500).json({
//             success: false,
//             message: "Signin failed",
//             error: error.message
//         });
//     }
// };


// // verify OTP function
// export const verifyOTP = async (req, res) => {
//     try {
//         const { email, otp } = req.body;

//         if (!email || !otp) { // Input validation
//             return res.status(400).json({
//                 success: false,
//                 message: "Email and OTP are required"
//             });
//         }

//         const record = await OtpCollection.findOne({ email }); // Find OTP record

//         if (!record) { // OTP existence check
//             return res.status(400).json({
//                 success: false,
//                 message: "OTP not found or expired"
//             });
//         }

//         if (record.expiry < new Date()) { // OTP expiry check
//             await OtpCollection.deleteOne({ email });
//             return res.status(400).json({
//                 success: false,
//                 message: "OTP expired"
//             });
//         }

//         if (record.otp !== otp) { // OTP match check
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid OTP"
//             });
//         }

//         const user = await AuthCollection.findOne({ email }); // Find user
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

     

//         const token = jwt.sign(
//             { 
//               id: user._id, 
//               email: user.email, 
//               role: user.role   // 👈 YE ADD KARNA HAI
//             },
//             process.env.SECRET_KEY,
//             { expiresIn: "1h" }
//           );

//         res.cookie("auth_token", token, { // Store token in cookie
//             httpOnly: true,
//             maxAge: 60 * 60 * 1000, // 1 hour
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "strict"
//         });

//         await OtpCollection.deleteOne({ email }); //  Delete OTP record after successful verification

//         return res.status(200).json({  // Success response
//             success: true,
//             message: "OTP verified successfully",
//             token
//         });

//     } catch (err) { // Error handling
//         return res.status(500).json({
//             success: false,
//             message: "OTP verification failed",
//             error: err.message
//         });
//     }
// };


// // User signout Controller
// export const signout = async (req, res) => {
//     try {
//         res.clearCookie("auth_token", { // Clear auth_token cookie
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "strict"
//         });

//         return res.status(200).json({ // Success response
//             success: true,
//             message: "User signed out successfully"
//         });

//     } catch (error) {
//         return res.status(500).json({ // Error handling
//             success: false,
//             message: "Signout failed",
//             error: error.message
//         });
//     }
// };


// // user checkLoginStatus Controller
// export const checkLoginStatus = async (req, res) => {
//     try {
//         const token = req.cookies.auth_token;

//         if (!token) {
//             return res.status(200).json({
//                 loggedIn: false,
//                 message: "User not logged in"
//             });
//         }

//         const decoded = jwt.verify(token, process.env.SECRET_KEY);

//         return res.status(200).json({
//             loggedIn: true,
//             message: "User is Already Logged In",
//             user: {
//                 id: decoded.id,
//                 email: decoded.email,
//                 role: decoded.role   // 👈 ADD THIS
//             }
//         });

//     } catch (error) {
//         return res.status(200).json({
//             loggedIn: false,
//             message: "Login First"
//         });
//     }
// };

// // user change password Controller
// export const changePassword = async (req, res) => {
//     try {
//         const { email, oldPassword, newPassword } = req.body;


//         if (!email || !oldPassword || !newPassword) { // Input validation
//             return res.status(400).json({
//                 success: false,
//                 message: "Email, old password and new password are required"
//             });
//         }

//         if (newPassword.length < 6) { // New password length check
//             return res.status(400).json({
//                 success: false,
//                 message: "New password must be at least 6 characters"
//             });
//         }

//         const user = await AuthCollection.findOne({ email }); // Find user by email
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password); // Check old password
//         if (!isOldPasswordValid) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Old password is incorrect"
//             });
//         }

//         const isSamePassword = await bcrypt.compare(newPassword, user.password); // Check if new password is different
//         if (isSamePassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: "New password must be different from old password"
//             });
//         }

//         const hashedNewPassword = await bcrypt.hash(newPassword, 12); // Hash new password
//         user.password = hashedNewPassword;
//         await user.save();

//         return res.status(200).json({ // Success response
//             success: true,
//             message: "Password changed successfully"
//         });

//     } catch (error) { // Error handling
//         return res.status(500).json({
//             success: false,
//             message: "Change password failed",
//             error: error.message
//         });
//     }
// };


// // forgot password Controller
// export const forgotPassword = async (req, res) => {
//     try {
//         const { email } = req.body;

//         if (!email) { // Input validation
//             return res.status(400).json({
//                 success: false,
//                 message: "Email is required"
//             });
//         }

//         const user = await AuthCollection.findOne({ email }); // Find user by email
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate 6-digit OTP
//         const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

//         await OtpCollection.findOneAndUpdate( // Store OTP in DB
//             { email },
//             { otp, expiry },
//             { upsert: true, new: true }
//         );

//         await sendOTP(email, otp); // Send OTP to email

//         return res.status(200).json({ // Success response
//             success: true,
//             message: "OTP sent to email"
//         });

//     } catch (error) { // Error handling
//         return res.status(500).json({
//             success: false,
//             message: "Failed to send OTP",
//             error: error.message
//         });
//     }
// };

// // change forgot password Controller
// export const changeForgotPassword = async (req, res) => {
//     try {
//         const { email, otp, newPassword } = req.body;

//         if (!email || !otp || !newPassword) { // Input validation
//             return res.status(400).json({
//                 success: false,
//                 message: "Email, OTP and new password are required"
//             });
//         }

//         const record = await OtpCollection.findOne({ email }); // Find OTP record

//         if (!record) { // OTP existence check
//             return res.status(400).json({
//                 success: false,
//                 message: "OTP not found or expired"
//             });
//         }

//         if (record.expiry < new Date()) { // OTP expiry check
//             await OtpCollection.deleteOne({ email });
//             return res.status(400).json({
//                 success: false,
//                 message: "OTP expired"
//             });
//         }

//         if (record.otp !== otp) { // OTP match check
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid OTP"

//             });
//         }

//         const user = await AuthCollection.findOne({ email }); // Find user
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         const hashedNewPassword = await bcrypt.hash(newPassword, 12); // Hash new password
//         user.password = hashedNewPassword;
//         await user.save();

//         await OtpCollection.deleteOne({ email }); // Delete OTP record after successful password change

//         return res.status(200).json({ // Success response
//             success: true,
//             message: "Password changed successfully"
//         });

//     } catch (error) { // Error handling
//         return res.status(500).json({
//             success: false,
//             message: "Failed to change password",
//             error: error.message
//         });
//     }
// };


import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserCollection } from "../models/user_model.js";
import { AuthCollection } from "../models/auth_model.js";
import { OtpCollection } from "../models/ otp_model.js";
import { sendOtpEmail } from "../services/service.js";


// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {

    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
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
      name,
      phone
    });

    await AuthCollection.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "customer",
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

    // Skip OTP for testing - direct login
    const token = jwt.sign({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    }, process.env.SECRET_KEY, {
      expiresIn: "7d"
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        email: user.email,
        role: user.role,
        name: user.name
      }
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