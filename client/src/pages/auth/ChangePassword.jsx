import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { changePassword } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function ChangePassword() {

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError("");
    setMessage("");

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {

      const res = await changePassword({
        email: user?.email,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      if (res.data.success) {

        setMessage("Password changed successfully!");

        setTimeout(() => {
          logout();
          navigate("/login");
        }, 2000);

      }

    } catch (err) {

      setError(err.response?.data?.message || "Failed to change password");

    }

    setLoading(false);

  };

  return (

    <div className="auth-wrapper">

      <div
        className="glass-card"
        style={{
          maxWidth: "450px",
          width: "100%",
          padding: "40px"
        }}
      >

        <h3 className="auth-title">Change Password</h3>
        <p className="auth-subtitle">Update your password</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>

          <div className="mb-4">

            <label className="form-label">Current Password</label>

            <div className="relative">

              <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="oldPassword"
                className="input-field pl-12"
                placeholder="Enter current password"
                value={formData.oldPassword}
                onChange={handleChange}
              />

            </div>

          </div>


          <div className="mb-4">

            <label className="form-label">New Password</label>

            <div className="relative">

              <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                className="input-field pl-12"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
              />

            </div>

          </div>


          <div className="mb-4">

            <label className="form-label">Confirm New Password</label>

            <div className="relative">

              <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                className="input-field pl-12"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>

            </div>

          </div>


          <button
            className="btn-primary w-100"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>

        </form>

      </div>

    </div>

  );
}

export default ChangePassword;