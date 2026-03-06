import { useState } from "react";
import { FiUser, FiMail, FiPhone, FiLock, FiLogOut, FiSave } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../utils/db.js";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: ""
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    
    try {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    }
    
    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.post("/auth/change-password", {
        email: user.email,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to change password" });
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account settings</p>
      </div>

      {message.text && (
        <div className={`alert mb-4 ${message.type === "success" ? "alert-success" : "alert-danger"}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <div className="glass-card p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-4xl font-bold mx-auto mb-4">
              {user?.name?.charAt(0) || "U"}
            </div>
            <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
            <p className="text-gray-500">{user?.email || "user@example.com"}</p>
            <span className="badge badge-info mt-2">Delivery Partner</span>
          </div>
          
          <div className="mt-6 space-y-3">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "profile" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FiUser />
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "password" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FiLock />
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-all mt-4"
            >
              <FiLogOut />
              Logout
            </button>
          </div>

        {/* Content */}
        <div className="lg:col-span-2">
          {activeTab === "profile" && (
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={profileData.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      disabled
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Role</label>
                    <input
                      type="text"
                      className="form-control"
                      value="Delivery Partner"
                      disabled
                    />
                  </div>
                <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
                  <FiSave />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-6">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="max-w-md">
                <div className="mb-4">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    className="form-control"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
                  <FiLock />
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          )}
        </div>
    </div>
  );
}

export default Profile;
