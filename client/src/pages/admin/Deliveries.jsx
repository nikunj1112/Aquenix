import { useState, useEffect } from "react";
import { FiSearch, FiTruck, FiMapPin, FiClock, FiCheck, FiX, FiUser } from "react-icons/fi";
import api from "../../utils/db.js";

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await api.get("/delivery/get-deliveries");
      setDeliveries(res.data.data || []);
    } catch (error) {
      console.log("Error fetching deliveries:", error);
      // Mock data
      setDeliveries([
        { _id: "DEL001", orderId: "ORD001", customerName: "John Doe", address: "123 Main St", deliveryPerson: "Mike", status: "In Transit", scheduledTime: "10:00 AM", date: "2024-01-15" },
        { _id: "DEL002", orderId: "ORD002", customerName: "Sarah Smith", address: "456 Oak Ave", deliveryPerson: "John", status: "Delivered", scheduledTime: "11:00 AM", date: "2024-01-15" },
        { _id: "DEL003", orderId: "ORD003", customerName: "Mike Johnson", address: "789 Pine Rd", deliveryPerson: "Mike", status: "Pending", scheduledTime: "12:00 PM", date: "2024-01-15" },
        { _id: "DEL004", orderId: "ORD004", customerName: "Emily Brown", address: "321 Elm St", deliveryPerson: "John", status: "Delivered", scheduledTime: "09:00 AM", date: "2024-01-14" },
      ]);
    }
    setLoading(false);
  };

  const updateDeliveryStatus = async (id, status) => {
    try {
      await api.put(`/delivery/update-delivery/${id}`, { status });
      fetchDeliveries();
    } catch (error) {
      console.log("Error updating delivery:", error);
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.deliveryPerson?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && delivery.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "badge badge-success";
      case "In Transit":
        return "badge badge-info";
      case "Pending":
        return "badge badge-warning";
      case "Cancelled":
        return "badge badge-danger";
      default:
        return "badge";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FiCheck className="text-success" />;
      case "In Transit":
        return <FiTruck className="text-info" />;
      case "Pending":
        return <FiClock className="text-warning" />;
      default:
        return <FiX className="text-danger" />;
    }
  };

  // Calculate stats
  const todayDeliveries = deliveries.filter(d => d.date === new Date().toISOString().split('T')[0]);
  const delivered = todayDeliveries.filter(d => d.status === "Delivered").length;
  const inTransit = todayDeliveries.filter(d => d.status === "In Transit").length;
  const pending = todayDeliveries.filter(d => d.status === "Pending").length;

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
        <h1 className="text-3xl font-bold text-dark">Deliveries</h1>
        <p className="text-gray-500 mt-1">Manage and track all deliveries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <FiTruck size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Today</p>
              <p className="text-xl font-bold">{todayDeliveries.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/10 text-success">
              <FiCheck size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-xl font-bold">{delivered}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-info/10 text-info">
              <FiTruck size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Transit</p>
              <p className="text-xl font-bold">{inTransit}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning/20 text-yellow-700">
              <FiClock size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold">{pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search deliveries..." 
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
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Delivery Person</th>
                <th>Scheduled Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((delivery) => (
                <tr key={delivery._id} className="table-row">
                  <td className="font-medium">{delivery.orderId}</td>
                  <td>{delivery.customerName}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-gray-400" />
                      {delivery.address}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-400" />
                      {delivery.deliveryPerson || "Not Assigned"}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <FiClock className="text-gray-400" />
                      {delivery.scheduledTime || "N/A"}
                    </div>
                  </td>
                  <td>
                    <span className={getStatusBadge(delivery.status)}>
                      {delivery.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {delivery.status === "Pending" && (
                        <button 
                          onClick={() => updateDeliveryStatus(delivery._id, "In Transit")}
                          className="p-2 text-info hover:bg-info/10 rounded-lg"
                          title="Start Delivery"
                        >
                          <FiTruck />
                        </button>
                      )}
                      {delivery.status === "In Transit" && (
                        <button 
                          onClick={() => updateDeliveryStatus(delivery._id, "Delivered")}
                          className="p-2 text-success hover:bg-success/10 rounded-lg"
                          title="Mark as Delivered"
                        >
                          <FiCheck />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDeliveries.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No deliveries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Deliveries;

