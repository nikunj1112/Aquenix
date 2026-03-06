import { Link } from "react-router-dom";
import "../../App.css";

function FirstPage() {
  return (
    <div className="auth-container">

      <div className="auth-left">
        <h1>AQUENIX</h1>

        <p>
          Water Supply Management System —  
          Manage customers, deliveries, and orders with ease.
        </p>

        <div className="auth-buttons">

          <Link to="/login">
            <button className="primary-btn">Login</button>
          </Link>

          <Link to="/signup">
            <button className="secondary-btn">Create Account</button>
          </Link>

        </div>

      </div>

      <div className="auth-right">

        <div className="auth-card">

          <h2>Welcome to AQUENIX</h2>

          <p>
            Manage your water supply business efficiently with our
            modern dashboard and delivery management tools.
          </p>

        </div>

      </div>

    </div>
  );
}

export default FirstPage;