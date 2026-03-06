import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const response = await loginUser(formData);

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

      setError(err.response?.data?.message || "Login failed. Please try again.");

    } finally {

      setLoading(false);

    }

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

        <h3 className="auth-title">Welcome Back</h3>
        <p className="auth-subtitle">Sign in to AQUENIX Dashboard</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

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
                autoComplete="email"
              />

            </div>

          </div>


          {/* PASSWORD */}

          <div className="mb-4">

            <label className="form-label">Password</label>

            <div className="relative">

              <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input-field pl-12 pr-12"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>

            </div>

          </div>


          {/* FORGOT PASSWORD */}

          <div className="flex justify-end mb-4">

            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>

          </div>


          {/* BUTTON */}

          <button
            className="btn-primary w-100"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>


        <p className="text-center mt-4 text-gray-600">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-primary font-medium hover:underline"
          >
            Create Account
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Login;