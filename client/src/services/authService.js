import API from "../utils/db.js";

// ================= SIGNUP =================
export const signupUser = (data) => {
  return API.post("/auth/signup", data);
};

// ================= LOGIN =================
export const loginUser = (data) => {
  return API.post("/auth/signin", data);
};

// ================= VERIFY OTP =================
export const verifyOtp = (data) => {
  return API.post("/auth/verify-otp", data);
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = (data) => {
  return API.post("/auth/forgot-password", data);
};

// ================= CHANGE FORGOT PASSWORD =================
export const changeForgotPassword = (data) => {
  return API.post("/auth/change-forgot-password", data);
};

// ================= CHANGE PASSWORD =================
export const changePassword = (data) => {
  return API.post("/auth/change-password", data);
};

// ================= CHECK LOGIN =================
export const checkLogin = () => {
  return API.get("/auth/check-login");
};

// ================= LOGOUT =================
export const logoutUser = () => {
  return API.post("/auth/signout");
};