import { useState, useEffect } from "react";
import { FiPackage, FiCheck, FiClock, FiTruck, FiUser, FiPhone, FiMapPin } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/db.js";

function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  const fetchAssignedOrders = async () => {
    try {
      const res = await api.get("/order/get-orders");
      const allOrders = res.data.data || [];
      
      // Filter orders assigned to current delivery person
      const myOrders = allOrders.filter(order => 
        order.deliveryPerson === user?.name || order.deliveryPerson === user?.email
      );
      setOrders(myOrders);
    } catch (error) {
      console.log("Error fetching orders:", error);
      // Mock data
      setOrders([
        { _id: "ORD001", customerName: "John Doe", address: "123 Main St", phone: "+1 234 567 8901", status: "Pending", scheduledTime: "10:00 AM" },
        { _id: "ORD002", customerName: "Sarah Smith", address: "456 Oak Ave", phone: "+1 234 567 8902", status: "Out for Delivery", scheduledTime: "11:00 AM" },
        { _id: "ORD003", customerName: "Mike Johnson", address: "789 Pine Rd", phone: "+1 234 567 8903", status: "Pending", scheduledTime: "12:00 PM" },
      ]);
    }
    setLoading(false);
  };

  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const inTransitOrders = orders.filter(o => o.status === "Out for Delivery").length;
  const completedOrders = orders.filter(o => o.status === "Delivered").length;

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/order/update-order/${orderId}`, { status: newStatus });
      fetchAssignedOrders();
    } catch (error) {
      console.log("Error updating order:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">Welcome, {user?.name || "Driver"}!</h1>
        <p className="text-gray-500 mt-1">Here's your delivery overview for today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-warning/20 text-yellow-700">
              <FiClock size={20} />
            </div>
          <h3 className="text-2xl font-bold">{pendingOrders}</h3>
          <p className="text-gray-500">Pending Deliveries</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-info/10 text-info">
              <FiTruck size={20} />
            </div>
          <h3 className="text-2xl font-bold">{inTransitOrders}</h3>
          <p className="text-gray-500">In Transit</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-success/10 text-success">
              <FiCheck size={20} />
            </div>
          <h3 className="text-2xl font-bold">{completedOrders}</h3>
          <p className="text-gray-500">Completed Today</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <FiPackage size={20} />
            </div>
          <h3 className="text-2xl font-bold">{orders.length}</h3>
          <p className="text-gray-500">Total Assigned</p>
        </div>

      {/* Today's Deliveries */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Today's Deliveries</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <FiPackage className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500">No deliveries assigned for today</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-xl">
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
                      <FiClock size={14} />
                      {order.scheduledTime || "Not scheduled"}
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`badge ${
                    order.status === "Delivered" ? "badge-success" :
                    order.status === "Out for Delivery" ? "badge-info" :
                    "badge-warning"
                  }`}>
                    {order.status}
                  </span>
                  
                  {order.status === "Pending" && (
                    <button 
                      onClick={() => updateStatus(order._id, "Out for Delivery")}
                      className="btn-primary text-sm py-2"
                    >
                      Start Delivery
                    </button>
                  )}
                  
                  {order.status === "Out for Delivery" && (
                    <button 
                      onClick={() => updateStatus(order._id, "Delivered")}
                      className="btn-primary text-sm py-2"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <a href="/delivery/orders" className="stat-card hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <FiPackage size={20} />
            </div>
            <div>
              <h4 className="font-semibold">View All Orders</h4>
              <p className="text-sm text-gray-500">See your complete delivery list</p>
            </div>
        </a>
        
        <a href="/delivery/tracking" className="stat-card hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/10 text-success">
              <FiTruck size={20} />
            </div>
            <div>
              <h4 className="font-semibold">Track Deliveries</h4>
              <p className="text-sm text-gray-500">Update delivery status</p>
            </div>
        </a>
        
        <a href="/delivery/customers" className="stat-card hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-info/10 text-info">
              <FiUser size={20} />
            </div>
            <div>
              <h4 className="font-semibold">Customer Info</h4>
              <p className="text-sm text-gray-500">View customer details</p>
            </div>
        </a>
      </div>
  );
}

export default Dashboard;
