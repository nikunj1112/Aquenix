import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, verifyOtp, resendOtp } from "../../services/authService";
import { FiMail, FiPhone, FiShield, FiLock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [loginData, setLoginData] = useState({ email: "", phone: "", password: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [userEmail, setUserEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    setError("");
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setError("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!loginData.email && !loginData.phone) {
      setError("Please enter email or phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await loginUser({
        email: loginData.email || undefined,
        phone: loginData.phone || undefined,
        password: loginData.password
      });

      if (response.data.success) {
        setUserEmail(response.data.email || loginData.email || loginData.phone);
        setStep(2);
        setSuccess("OTP sent successfully!");
        setResendTimer(60);

        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError("Please enter valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await verifyOtp({ email: userEmail, otp });

      if (response.data.success) {
        const userData = {
          id: response.data.user?.id,
          email: response.data.user.email,
          role: response.data.user.role,
          name: response.data.user.name
        };

        login(userData, response.data.token);

        if (response.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (response.data.user.role === "delivery") {
          navigate("/delivery/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setLoading(true);

    try {
      await resendOtp({ email: userEmail });
      setSuccess("OTP resent!");
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setOtp("");
    setError("");
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card" style={{ maxWidth: "450px", width: "100%", padding: "40px" }}>

        {step === 1 && (
          <>
            <h3 className="auth-title">Welcome Back</h3>
            <p className="auth-subtitle">Sign in to AQUENIX Dashboard</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSendOtp}>

              {/* Email */}
              <div className="mb-4">
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    className="input-field pl-12"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="form-label">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    className="input-field pl-12"
                    placeholder="Enter password"
                    value={loginData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="form-label">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    className="input-field pl-12"
                    placeholder="Enter phone"
                    value={loginData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-100" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

            </form>

            <p className="text-center mt-4 text-gray-600">
              No account?{" "}
              <Link to="/signup" className="text-primary font-medium">
                Contact Admin
              </Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center mb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FiShield className="text-3xl text-primary" />
              </div>

              <h3 className="auth-title">Verify OTP</h3>

              <p className="auth-subtitle">
                Enter code sent to
                <br />
                <strong>{userEmail}</strong>
              </p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleVerifyOtp}>
              <div className="mb-4">
                <input
                  type="text"
                  className="input-field text-center text-2xl tracking-widest"
                  placeholder="000000"
                  value={otp}
                  onChange={handleOtpChange}
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-100"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
            </form>

            <div className="text-center mt-4">
              {resendTimer > 0 ? (
                <p className="text-gray-500">
                  Resend in <span className="font-medium">{resendTimer}s</span>
                </p>
              ) : (
                <button onClick={handleResendOtp} className="text-primary hover:underline">
                  Resend OTP
                </button>
              )}
            </div>

            <div className="text-center mt-3">
              <button onClick={handleBack} className="text-gray-500 hover:text-gray-700">
                ← Back
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Login;