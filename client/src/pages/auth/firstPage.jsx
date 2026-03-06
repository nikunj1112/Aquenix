import { Link } from "react-router-dom";

function FirstPage() {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>AQUENIX</h1>
        <p>
          Modern Water Supply Management System. Streamline your delivery operations, 
          manage customers efficiently, and grow your business with AQUENIX.
        </p>
        <div className="auth-buttons">
          <Link to="/login" className="primary-btn">
            Sign In
          </Link>
          <Link to="/signup" className="secondary-btn">
            Get Started
          </Link>
        </div>
      </div>
      <div className="auth-right">
        <div className="glass-card" style={{ padding: "40px", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "16px", color: "#110532" }}>
            💧 AQUENIX
          </h2>
          <p style={{ color: "#6c757d", marginBottom: "24px" }}>
            Smart Water Supply Management
          </p>
          <div style={{ textAlign: "left", marginTop: "20px" }}>
            <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ 
                width: "32px", height: "32px", borderRadius: "50%", background: "#392f97", 
                color: "white", display: "flex", alignItems: "center", justifyContent: "center" 
              }}>✓</span>
              <span style={{ color: "#453f6f" }}>OTP-based Secure Authentication</span>
            </div>
            <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ 
                width: "32px", height: "32px", borderRadius: "50%", background: "#392f97", 
                color: "white", display: "flex", alignItems: "center", justifyContent: "center" 
              }}>✓</span>
              <span style={{ color: "#453f6f" }}>Role-based Access Control</span>
            </div>
            <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ 
                width: "32px", height: "32px", borderRadius: "50%", background: "#392f97", 
                color: "white", display: "flex", alignItems: "center", justifyContent: "center" 
              }}>✓</span>
              <span style={{ color: "#453f6f" }}>Real-time Order Tracking</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ 
                width: "32px", height: "32px", borderRadius: "50%", background: "#392f97", 
                color: "white", display: "flex", alignItems: "center", justifyContent: "center" 
              }}>✓</span>
              <span style={{ color: "#453f6f" }}>Analytics & Reports</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirstPage;

