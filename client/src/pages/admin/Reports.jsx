import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { FiUsers, FiShoppingCart, FiTruck, FiDollarSign, FiTrendingUp, FiCalendar } from "react-icons/fi";
import api from "../../utils/db.js";

const monthlyData = [
  { month: "Jan", orders: 65, revenue: 12500, customers: 45 },
  { month: "Feb", orders: 80, revenue: 15800, customers: 52 },
  { month: "Mar", orders: 95, revenue: 18200, customers: 61 },
  { month: "Apr", orders: 110, revenue: 21500, customers: 73 },
  { month: "May", orders: 125, revenue: 24800, customers: 82 },
  { month: "Jun", orders: 145, revenue: 28900, customers: 95 },
  { month: "Jul", orders: 160, revenue: 32500, customers: 108 },
  { month: "Aug", orders: 175, revenue: 35200, customers: 115 },
  { month: "Sep", orders: 190, revenue: 38900, customers: 128 },
  { month: "Oct", orders: 210, revenue: 42500, customers: 142 },
  { month: "Nov", orders: 235, revenue: 47200, customers: 158 },
  { month: "Dec", orders: 260, revenue: 52000, customers: 175 },
];

const deliveryStatusData = [
  { name: "Delivered", value: 850, color: "#29a064" },
  { name: "In Transit", value: 120, color: "#807ce3" },
  { name: "Pending", value: 75, color: "#dfcb2a" },
  { name: "Cancelled", value: 25, color: "#eb2816" },
];

const customerGrowthData = [
  { month: "Jan", customers: 45, growth: 0 },
  { month: "Feb", customers: 52, growth: 15.5 },
  { month: "Mar", customers: 61, growth: 17.3 },
  { month: "Apr", customers: 73, growth: 19.7 },
  { month: "May", customers: 82, growth: 12.3 },
  { month: "Jun", customers: 95, growth: 15.9 },
];

function Reports() {

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalDeliveries: 0,
    totalRevenue: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {

      const [customersRes, ordersRes] = await Promise.all([
        api.get("/customer/get-customers"),
        api.get("/order/get-orders")
      ]);

      setStats({
        totalCustomers: customersRes.data.data?.length || 125,
        totalOrders: ordersRes.data.data?.length || 450,
        totalDeliveries: 380,
        totalRevenue: 52000
      });

    } catch (error) {

      console.log("Error fetching stats:", error);

      setStats({
        totalCustomers: 175,
        totalOrders: 260,
        totalDeliveries: 1070,
        totalRevenue: 52000
      });

    }

    setLoading(false);
  };

  const tooltipStyle = {
    backgroundColor: "white",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (

    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark">Reports & Analytics</h1>
        <p className="text-gray-500 mt-1">View comprehensive business analytics</p>
      </div>


      {/* STAT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <div className="stat-card">
          <h3 className="stat-value">{stats.totalCustomers}</h3>
          <p className="stat-label">Total Customers</p>
        </div>

        <div className="stat-card">
          <h3 className="stat-value">{stats.totalOrders}</h3>
          <p className="stat-label">Total Orders</p>
        </div>

        <div className="stat-card">
          <h3 className="stat-value">{stats.totalDeliveries}</h3>
          <p className="stat-label">Total Deliveries</p>
        </div>

        <div className="stat-card">
          <h3 className="stat-value">${stats.totalRevenue.toLocaleString()}</h3>
          <p className="stat-label">Total Revenue</p>
        </div>

      </div>


      {/* CHARTS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Revenue */}

        <div className="glass-card p-6">

          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>

          <ResponsiveContainer width="100%" height={300}>

            <AreaChart data={monthlyData}>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={tooltipStyle} />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#392f97"
                fill="#392f97"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>


        {/* Orders */}

        <div className="glass-card p-6">

          <h3 className="text-lg font-semibold mb-4">Monthly Orders</h3>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={monthlyData}>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={tooltipStyle} />

              <Bar dataKey="orders" fill="#685bbc" radius={[8, 8, 0, 0]} />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* DELIVERY STATUS */}

      <div className="glass-card p-6 mb-6">

        <h3 className="text-lg font-semibold mb-4">Delivery Status</h3>

        <ResponsiveContainer width="100%" height={250}>

          <PieChart>

            <Pie
              data={deliveryStatusData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
            >

              {deliveryStatusData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>


      {/* CUSTOMER GROWTH */}

      <div className="glass-card p-6">

        <h3 className="text-lg font-semibold mb-4">Customer Growth</h3>

        <ResponsiveContainer width="100%" height={250}>

          <LineChart data={customerGrowthData}>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip contentStyle={tooltipStyle} />

            <Line
              type="monotone"
              dataKey="customers"
              stroke="#29a064"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default Reports;