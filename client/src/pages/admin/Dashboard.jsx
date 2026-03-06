
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FiUsers, FiShoppingCart, FiTruck, FiDollarSign, FiTrendingUp, FiClock } from "react-icons/fi";
import { getOrderStats, getCustomers, getEmployees } from "../../services/userService";

const COLORS = ["#29a064", "#dfcb2a", "#392f97"];

const tooltipStyle = {
  backgroundColor: 'white',
  border: 'none',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
};

function Dashboard() {
  const [animate, setAnimate] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalEmployees: 0,
    outForDelivery: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAnimate(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [orderRes, customerRes, employeeRes] = await Promise.all([
        getOrderStats(),
        getCustomers(),
        getEmployees()
      ]);

      if (orderRes.data.success) {
        const orderStats = orderRes.data.stats;
        setStats({
          totalOrders: orderStats.totalOrders || 0,
          pendingOrders: orderStats.pendingOrders || 0,
          outForDelivery: orderStats.outForDelivery || 0,
          deliveredOrders: orderStats.deliveredOrders || 0,
          totalRevenue: orderStats.totalRevenue || 0,
          totalCustomers: customerRes.data.data?.length || 0,
          totalEmployees: employeeRes.data.employees?.length || 0
        });
        setRecentOrders(orderStats.recentOrders || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deliveryData = [
    { name: "Delivered", value: stats.deliveredOrders },
    { name: "Pending", value: stats.pendingOrders },
    { name: "In Progress", value: stats.outForDelivery || 0 },
  ];

  const statCards = [
    { title: "Total Customers", value: stats.totalCustomers, icon: <FiUsers />, color: "bg-primary", change: "+12%" },
    { title: "Total Orders", value: stats.totalOrders, icon: <FiShoppingCart />, color: "bg-secondary", change: "+8%" },
    { title: "Total Deliveries", value: stats.deliveredOrders, icon: <FiTruck />, color: "bg-success", change: "+15%" },
    { title: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: <FiDollarSign />, color: "bg-accent2", change: "+23%" },
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className="stat-card"
            style={{
              opacity: animate ? 1 : 0,
              transform: animate ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.5s ease ${index * 100}ms`
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                {stat.icon}
              </div>
              <span className="text-success text-sm font-medium flex items-center gap-1">
                <FiTrendingUp /> {stat.change}
              </span>
            </div>
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Delivery Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deliveryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {deliveryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Orders Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10 text-success">
                  <FiTruck />
                </div>
                <span className="font-medium">Delivered</span>
              </div>
              <span className="font-bold text-success">{stats.deliveredOrders}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10 text-warning">
                  <FiClock />
                </div>
                <span className="font-medium">Pending</span>
              </div>
              <span className="font-bold text-warning">{stats.pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <FiShoppingCart />
                </div>
                <span className="font-medium">In Progress</span>
              </div>
              <span className="font-bold text-primary">{stats.outForDelivery || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="font-medium">{order.customerName}</td>
                    <td>{order.phone}</td>
                    <td className="max-w-xs truncate">{order.address}</td>
                    <td>
                      <span className={`badge ${
                        order.status === 'Delivered' ? 'badge-success' :
                        order.status === 'Out for Delivery' ? 'badge-info' :
                        'badge-warning'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No orders yet. Create your first order!
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

