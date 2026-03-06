import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { forgotPassword } from "../../services/authService";

function ForgotPassword() {

  const [formData, setFormData] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {

      const res = await forgotPassword(formData);

      if (res.data.success) {
        setMessage("OTP sent to your email!");
      }

    } catch (err) {

      setError(err.response?.data?.message || "Failed to send OTP");

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

        <Link
          to="/login"
          className="flex items-center gap-2 text-primary mb-4"
        >
          <FiArrowLeft /> Back to Login
        </Link>

        <h3 className="auth-title">Forgot Password</h3>
        <p className="auth-subtitle">Enter your email to reset password</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>

          <div className="mb-4">

            <label className="form-label">Email Address</label>

            <div className="relative">

              <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                name="email"
                className="input-field pl-12"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

          </div>

          <button
            className="btn-primary w-100"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

        </form>

      </div>

    </div>

  );
}

export default ForgotPassword;