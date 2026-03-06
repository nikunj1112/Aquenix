import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiLogOut, FiMenu } from "react-icons/fi";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          AQUENIX
        </Link>
      </div>
      
      <div className="nav-right">
        <div className="nav-user-info">
          <FiUser className="user-icon" />
          <span className="nav-user">{user?.name || user?.email}</span>
        </div>
        
        <button className="nav-logout" onClick={logout}>
          <FiLogOut />
          Logout
        </button>
        
        <button className="mobile-menu-btn">
          <FiMenu />
        </button>
      </div>
    </div>
  );
}

export default Navbar;

