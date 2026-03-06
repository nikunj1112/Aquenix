import { useState, useEffect } from "react";
import { FiSearch, FiPhone, FiMapPin, FiClock, FiCheck, FiTruck } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/db.js";

function AssignedOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/get-orders");
      const allOrders = res.data.data || [];
      
      // Filter orders assigned to current delivery person
      const myOrders = allOrders.filter(order => 
        order.deliveryPerson === user?.name || 
        order.deliveryPerson === user?.email ||
        !order.deliveryPerson // Show unassigned orders too
      );
      setOrders(myOrders);
    } catch (error) {
      console.log("Error fetching orders:", error);
      // Mock data
      setOrders([
        { _id: "ORD001", customerName: "John Doe", address: "123 Main St, New York", phone: "+1 234 567 8901", status: "Pending", scheduledTime: "10:00 AM", date: "2024-01-15" },
        { _id: "ORD002", customerName: "Sarah Smith", address: "456 Oak Ave, Los Angeles", phone: "+1 234 567 8902", status: "Out for Delivery", scheduledTime: "11:00 AM", date: "2024-01-15" },
        { _id: "ORD003", customerName: "Mike Johnson", address: "789 Pine Rd, Chicago", phone: "+1 234 567 8903", status: "Delivered", scheduledTime: "09:00 AM", date: "2024-01-14" },
        { _id: "ORD004", customerName: "Emily Brown", address: "321 Elm St, Houston", phone: "+1 234 567 8904", status: "Pending", scheduledTime: "02:00 PM", date: "2024-01-15" },
      ]);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/order/update-order/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.log("Error updating order:", error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm);
    
    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && order.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "badge badge-success";
      case "Out for Delivery":
        return "badge badge-info";
      case "Pending":
        return "badge badge-warning";
      default:
        return "badge";
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark">Assigned Orders</h1>
        <p className="text-gray-500 mt-1">View and manage your delivery tasks</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by customer name, order ID or phone..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="form-control pl-12" 
            />
          </div>
          <select 
            className="form-control md:w-48"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order._id} className="glass-card p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-lg">{order._id}</span>
                  <span className={getStatusBadge(order.status)}>{order.status}</span>
                </div>
                <h3 className="font-semibold text-lg">{order.customerName}</h3>
                <div className="flex flex-col gap-1 mt-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-primary" />
                    <span>{order.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-primary" />
                    <span>{order.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-primary" />
                    <span>{order.scheduledTime || "Not scheduled"} - {order.date}</span>
                  </div>
              </div>
              
              <div className="flex gap-2">
                {order.status === "Pending" && (
                  <button 
                    onClick={() => updateStatus(order._id, "Out for Delivery")}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FiTruck />
                    Start Delivery
                  </button>
                )}
                {order.status === "Out for Delivery" && (
                  <button 
                    onClick={() => updateStatus(order._id, "Delivered")}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FiCheck />
                    Mark Delivered
                  </button>
                )}
                {order.status === "Delivered" && (
                  <div className="text-success flex items-center gap-2">
                    <FiCheck />
                    Completed
                  </div>
                )}
              </div>
          </div>
        ))}
        
        {filteredOrders.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
  );
}

export default AssignedOrders;
