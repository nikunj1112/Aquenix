import { Link } from "react-router-dom";

function Sidebar(){

return(

<div className="sidebar">

<h2>AQUENIX</h2>

<ul>

<li><Link to="/admin/dashboard">Dashboard</Link></li>

<li><Link to="/admin/customers">Customers</Link></li>

<li><Link to="/admin/orders">Orders</Link></li>

<li><Link to="/admin/employees">Employees</Link></li>

<li><Link to="/admin/reports">Reports</Link></li>

</ul>

</div>

);

}

export default Sidebar;