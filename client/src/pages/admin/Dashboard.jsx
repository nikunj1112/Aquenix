import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { FiUsers, FiShoppingCart, FiTruck, FiDollarSign, FiTrendingUp, FiClock } from "react-icons/fi";

const monthlyData = [
  { month: "Jan", orders: 65, revenue: 12500 },
  { month: "Feb", orders: 80, revenue: 15800 },
  { month: "Mar", orders: 95, revenue: 18200 },
  { month: "Apr", orders: 110, revenue: 21500 },
  { month: "May", orders: 125, revenue: 24800 },
  { month: "Jun", orders: 145, revenue: 28900 },
];

const deliveryData = [
  { name: "Delivered", value: 450 },
  { name: "Pending", value: 85 },
  { name: "In Progress", value: 35 },
];

const COLORS = ["#29a064", "#dfcb2a", "#392f97"];

const stats = [
  { title: "Total Customers", value: "1,234", icon: <FiUsers />, color: "bg-primary", change: "+12%" },
  { title: "Total Orders", value: "3,456", icon: <FiShoppingCart />, color: "bg-secondary", change: "+8%" },
  { title: "Total Deliveries", value: "2,890", icon: <FiTruck />, color: "bg-success", change: "+15%" },
  { title: "Total Revenue", value: "$124,500", icon: <FiDollarSign />, color: "bg-accent2", change: "+23%" },
];

const tooltipStyle = {
  backgroundColor: 'white',
  border: 'none',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
};

function Dashboard() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" stroke="#6c757d" />
              <YAxis stroke="#6c757d" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="revenue" fill="#392f97" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" stroke="#6c757d" />
              <YAxis stroke="#6c757d" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#685bbc" 
                strokeWidth={3}
                dot={{ fill: '#685bbc', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery Status */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Delivery Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={deliveryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {deliveryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {deliveryData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { icon: <FiShoppingCart />, text: "New order #1234 received", time: "2 min ago", color: "text-primary" },
              { icon: <FiTruck />, text: "Order #1230 delivered successfully", time: "15 min ago", color: "text-success" },
              { icon: <FiUsers />, text: "New customer John Doe registered", time: "1 hour ago", color: "text-secondary" },
              { icon: <FiClock />, text: "Order #1225 pending delivery", time: "2 hours ago", color: "text-warning" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-dark">{activity.text}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

