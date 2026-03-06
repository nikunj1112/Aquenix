import { useState } from "react";
import { FiUser, FiLock, FiMail, FiPhone, FiMapPin, FiSave, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { changePassword } from "../../services/authService";

function Settings() {

  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: ""
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setMessage("Profile updated successfully!");
  };

  const handlePasswordSubmit = async (e) => {

    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {

      const res = await changePassword({
        email: user?.email,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      if (res.data.success) {
        setMessage("Password changed successfully!");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }

    } catch (err) {

      setError(err.response?.data?.message || "Failed to change password");

    }
  };

  return (

    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account settings</p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* SIDEBAR */}

        <div className="md:col-span-1">

          <div className="glass-card p-4">

            <nav className="space-y-2">

              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === "profile" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
              >
                <FiUser className="inline mr-2" /> Profile
              </button>

              <button
                onClick={() => setActiveTab("password")}
                className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === "password" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
              >
                <FiLock className="inline mr-2" /> Change Password
              </button>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 rounded-lg text-danger hover:bg-danger/10"
              >
                <FiLogOut className="inline mr-2" /> Logout
              </button>

            </nav>

          </div>

        </div>


        {/* CONTENT */}

        <div className="md:col-span-3">

          {/* PROFILE */}

          {activeTab === "profile" && (

            <div className="glass-card p-6">

              <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

              {message && activeTab === "profile" && (
                <div className="alert alert-success mb-4">{message}</div>
              )}

              <form onSubmit={handleProfileSubmit}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>

                    <label className="form-label">Full Name</label>

                    <div className="relative">

                      <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

                      <input
                        type="text"
                        name="name"
                        className="input-field pl-12"
                        value={profileData.name}
                        onChange={handleProfileChange}
                      />

                    </div>

                  </div>


                  <div>

                    <label className="form-label">Email</label>

                    <div className="relative">

                      <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

                      <input
                        type="email"
                        name="email"
                        className="input-field pl-12"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        disabled
                      />

                    </div>

                  </div>


                  <div>

                    <label className="form-label">Phone</label>

                    <div className="relative">

                      <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

                      <input
                        type="tel"
                        name="phone"
                        className="input-field pl-12"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        placeholder="Enter phone"
                      />

                    </div>

                  </div>


                  <div>

                    <label className="form-label">Address</label>

                    <div className="relative">

                      <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

                      <input
                        type="text"
                        name="address"
                        className="input-field pl-12"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        placeholder="Enter address"
                      />

                    </div>

                  </div>

                </div>


                <button type="submit" className="btn-primary mt-4">
                  <FiSave className="inline mr-2" /> Save Changes
                </button>

              </form>

            </div>

          )}


          {/* PASSWORD */}

          {activeTab === "password" && (

            <div className="glass-card p-6">

              <h2 className="text-xl font-semibold mb-4">Change Password</h2>

              {error && <div className="alert alert-danger mb-4">{error}</div>}

              {message && activeTab === "password" && (
                <div className="alert alert-success mb-4">{message}</div>
              )}

              <form onSubmit={handlePasswordSubmit}>

                <div className="mb-4">

                  <label className="form-label">Current Password</label>

                  <input
                    type="password"
                    name="oldPassword"
                    className="input-field"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />

                </div>


                <div className="mb-4">

                  <label className="form-label">New Password</label>

                  <input
                    type="password"
                    name="newPassword"
                    className="input-field"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />

                </div>


                <div className="mb-4">

                  <label className="form-label">Confirm New Password</label>

                  <input
                    type="password"
                    name="confirmPassword"
                    className="input-field"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />

                </div>


                <button type="submit" className="btn-primary">
                  <FiLock className="inline mr-2" /> Change Password
                </button>

              </form>

            </div>

          )}

        </div>

      </div>

    </div>

  );
}

export default Settings;