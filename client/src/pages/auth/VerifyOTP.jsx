import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import OTPInput from "otp-input-react";
import api from "../../utils/db.js";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      
      if (response.data.success) {
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Redirect based on role
        if (response.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (response.data.user.role === "delivery") {
          navigate("/delivery/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/auth/forgot-password", { email });
      setError("");
      alert("OTP resent successfully!");
    } catch (err) {
      setError("Failed to resend OTP");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card" style={{ maxWidth: "450px", width: "100%", padding: "40px" }}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
            <FiLock size={32} />
          </div>
          <h3 className="auth-title">Verify OTP</h3>
          <p className="auth-subtitle">Enter the 6-digit code sent to your email</p>
          <p className="text-sm text-gray-500 mt-2">{email}</p>
        </div>

        {error && <div className="alert alert-danger mb-4">{error}</div>}

        <form onSubmit={handleVerify}>
          <div className="mb-6">
            <OTPInput 
              value={otp} 
              onChange={setOtp} 
              OTPLength={6} 
              otpType="number"
              disabled={false}
              inputStyles={{
                width: "100%",
                height: "50px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                textAlign: "center",
                fontSize: "20px",
                marginRight: "8px"
              }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary w-100" 
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Didn't receive the code?{" "}
            <button 
              onClick={handleResend}
              className="text-primary font-medium hover:underline bg-transparent border-none cursor-pointer"
            >
              Resend OTP
            </button>
          </p>
        </div>

        <p className="text-center mt-4">
          <button 
            onClick={() => navigate("/login")}
            className="text-primary font-medium hover:underline bg-transparent border-none cursor-pointer"
          >
            Back to Login
          </button>
        </p>
      </div>
  );
}

export default VerifyOTP;
