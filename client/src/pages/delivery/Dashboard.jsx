import { useState, useEffect } from "react";
import { FiPackage, FiCheck, FiClock, FiTruck, FiUser, FiMapPin, FiRefreshCw, FiPhone } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { getMyOrders, getDeliveryStats, updateOrderStatus } from "../../services/orderService";

function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    pending: 0,
    outForDelivery: 0,
    delivered: 0
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await getDeliveryStats();
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      const ordersRes = await getMyOrders();
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.data);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      fetchData();
    } catch (error) {
      console.log("Error updating order:", error);
    }
    setUpdating(null);
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

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark">
            Welcome, {user?.name || "Driver"}!
          </h1>
          <p className="text-gray-500 mt-1">
            Here's your delivery overview for today
          </p>
        </div>

        <button
          onClick={fetchData}
          className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90"
        >
          <FiRefreshCw size={20} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-warning/20 text-yellow-700">
              <FiClock size={20} />
            </div>
            <h3 className="text-2xl font-bold">{stats.pending}</h3>
          </div>
          <p className="text-gray-500">Pending</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-info/10 text-info">
              <FiTruck size={20} />
            </div>
            <h3 className="text-2xl font-bold">{stats.outForDelivery}</h3>
          </div>
          <p className="text-gray-500">In Transit</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-success/10 text-success">
              <FiCheck size={20} />
            </div>
            <h3 className="text-2xl font-bold">{stats.delivered}</h3>
          </div>
          <p className="text-gray-500">Completed</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <FiPackage size={20} />
            </div>
            <h3 className="text-2xl font-bold">{stats.totalAssigned}</h3>
          </div>
          <p className="text-gray-500">Total Assigned</p>
        </div>

      </div>

      {/* Deliveries */}
      <div className="glass-card p-6">

        <h2 className="text-xl font-semibold mb-4">Today's Deliveries</h2>

        {orders.length === 0 ? (

          <div className="text-center py-8">
            <FiPackage className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500">No deliveries assigned</p>
          </div>

        ) : (

          <div className="space-y-4">

            {orders.map((order) => (

              <div
                key={order._id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-xl"
              >

                <div className="flex items-start gap-4 mb-4 md:mb-0">

                  <div className="p-3 rounded-xl bg-white">
                    <FiPackage className="text-primary" />
                  </div>

                  <div>
                    <h4 className="font-semibold">{order.customerName}</h4>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <FiMapPin size={14} />
                      {order.address}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <FiPhone size={14} />
                      {order.phone}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <FiClock size={14} />
                      {order.scheduledTime || "Not scheduled"}
                    </div>

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <span
                    className={`badge ${
                      order.status === "Delivered"
                        ? "badge-success"
                        : order.status === "Out for Delivery"
                        ? "badge-info"
                        : order.status === "Assigned"
                        ? "badge-warning"
                        : "badge-primary"
                    }`}
                  >
                    {order.status}
                  </span>

                  {(order.status === "Pending" || order.status === "Assigned") && (

                    <button
                      onClick={() =>
                        handleUpdateStatus(order._id, "Out for Delivery")
                      }
                      disabled={updating === order._id}
                      className="btn-primary text-sm py-2 disabled:opacity-50"
                    >
                      {updating === order._id ? "..." : "Start Delivery"}
                    </button>

                  )}

                  {order.status === "Out for Delivery" && (

                    <button
                      onClick={() =>
                        handleUpdateStatus(order._id, "Delivered")
                      }
                      disabled={updating === order._id}
                      className="btn-primary text-sm py-2 disabled:opacity-50"
                    >
                      {updating === order._id ? "..." : "Mark Delivered"}
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

        <a
          href="/delivery/orders"
          className="stat-card hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <FiPackage size={20} />
            </div>
            <div>
              <h4 className="font-semibold">View All Orders</h4>
              <p className="text-sm text-gray-500">Complete delivery list</p>
            </div>
          </div>
        </a>

        <a
          href="/delivery/tracking"
          className="stat-card hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/10 text-success">
              <FiTruck size={20} />
            </div>
            <div>
              <h4 className="font-semibold">Track Deliveries</h4>
              <p className="text-sm text-gray-500">Update delivery status</p>
            </div>
          </div>
        </a>

        <a
          href="/delivery/customers"
          className="stat-card hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-info/10 text-info">
              <FiUser size={20} />
            </div>
            <div>
              <h4 className="font-semibold">Customer Info</h4>
              <p className="text-sm text-gray-500">View customer details</p>
            </div>
          </div>
        </a>

      </div>

    </div>
  );
}

export default Dashboard;