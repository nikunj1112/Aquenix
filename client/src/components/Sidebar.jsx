import { Link, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiUsers, 
  FiShoppingCart, 
  FiTruck, 
  FiUserCheck, 
  FiBarChart2, 
  FiSettings,
  FiPackage
} from "react-icons/fi";

function Sidebar() {
  const location = useLocation();
  
  const adminMenuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FiHome /> },
    { path: "/admin/customers", label: "Customers", icon: <FiUsers /> },
    { path: "/admin/orders", label: "Orders", icon: <FiShoppingCart /> },
    { path: "/admin/deliveries", label: "Deliveries", icon: <FiTruck /> },
    { path: "/admin/employees", label: "Employees", icon: <FiUserCheck /> },
    { path: "/admin/reports", label: "Reports", icon: <FiBarChart2 /> },
    { path: "/admin/settings", label: "Settings", icon: <FiSettings /> },
  ];

  const deliveryMenuItems = [
    { path: "/delivery/dashboard", label: "Dashboard", icon: <FiHome /> },
    { path: "/delivery/orders", label: "Assigned Orders", icon: <FiPackage /> },
    { path: "/delivery/tracking", label: "Tracking", icon: <FiTruck /> },
    { path: "/delivery/customers", label: "Customers", icon: <FiUsers /> },
    { path: "/delivery/profile", label: "Profile", icon: <FiUserCheck /> },
  ];

  // Determine which menu to show based on current path
  const isDeliveryRoute = location.pathname.startsWith('/delivery');
  const menuItems = isDeliveryRoute ? deliveryMenuItems : adminMenuItems;

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        💧 AQUENIX
      </div>
      
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              className={location.pathname === item.path ? "active" : ""}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="sidebar-footer justify-end">
        <p>Water Supply Management</p>
      </div>
    </div>
  );
}

export default Sidebar;

