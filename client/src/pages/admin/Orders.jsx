import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiCheck, FiX, FiClock } from "react-icons/fi";
import api from "../../utils/db.js";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, customersRes, employeesRes] = await Promise.all([
        api.get("/order/get-orders"),
        api.get("/customer/get-customers"),
        api.get("/profile/get-all-users")
      ]);
      setOrders(ordersRes.data.data || []);
      setCustomers(customersRes.data.data || []);
      setEmployees(employeesRes.data.data || []);
    } catch (error) {
      console.log("Error fetching data:", error);
      // Use mock data if API fails
      setOrders([
        { _id: "ORD001", customerName: "John Doe", address: "123 Main St", phone: "+1 234 567 8901", status: "Pending", deliveryPerson: null, date: "2024-01-15" },
        { _id: "ORD002", customerName: "Sarah Smith", address: "456 Oak Ave", phone: "+1 234 567 8902", status: "Delivered", deliveryPerson: "Mike", date: "2024-01-14" },
        { _id: "ORD003", customerName: "Mike Johnson", address: "789 Pine Rd", phone: "+1 234 567 8903", status: "Out for Delivery", deliveryPerson: "John", date: "2024-01-14" },
      ]);
    }
    setLoading(false);
  };

  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    phone: "",
    status: "Pending",
    deliveryPerson: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/order/create-order", formData);
      fetchData();
      setShowModal(false);
      setFormData({ customerName: "", address: "", phone: "", status: "Pending", deliveryPerson: "" });
    } catch (error) {
      console.log("Error creating order:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/order/update-order/${id}`, { status });
      fetchData();
    } catch (error) {
      console.log("Error updating order:", error);
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await api.delete(`/order/delete-order/${id}`);
        fetchData();
      } catch (error) {
        console.log("Error deleting order:", error);
      }
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone?.includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "badge badge-success";
      case "Out for Delivery":
        return "badge badge-info";
      case "Pending":
        return "badge badge-warning";
      case "Cancelled":
        return "badge badge-danger";
      default:
        return "badge";
    }
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark">Orders</h1>
          <p className="text-gray-500 mt-1">Manage customer orders</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary mt-4 md:mt-0 flex items-center gap-2">
          <FiPlus /> Create Order
        </button>
      </div>

      <div className="glass-card p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="form-control pl-12" 
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="table-row">
                  <td className="font-medium">{order._id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.phone}</td>
                  <td>{order.address}</td>
                  <td>
                    <span className={getStatusBadge(order.status)}>{order.status}</span>
                  </td>
                  <td>{order.date || "N/A"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setViewOrder(order)} 
                        className="p-2 text-info hover:bg-info/10 rounded-lg"
                      >
                        <FiEye />
                      </button>
                      <button 
                        onClick={() => updateStatus(order._id, order.status === "Pending" ? "Out for Delivery" : "Delivered")} 
                        className="p-2 text-success hover:bg-success/10 rounded-lg"
                      >
                        <FiCheck />
                      </button>
                      <button 
                        onClick={() => deleteOrder(order._id)} 
                        className="p-2 text-danger hover:bg-danger/10 rounded-lg"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Create New Order</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label">Customer Name</label>
                <input 
                  type="text" 
                  name="customerName"
                  className="form-control" 
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Phone</label>
                <input 
                  type="tel" 
                  name="phone"
                  className="form-control" 
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Address</label>
                <textarea 
                  name="address"
                  className="form-control" 
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Assign Delivery Person</label>
                <select 
                  name="deliveryPerson"
                  className="form-control"
                  value={formData.deliveryPerson}
                  onChange={handleChange}
                >
                  <option value="">Select Delivery Person</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Order Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold">{viewOrder._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-semibold">{viewOrder.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold">{viewOrder.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-semibold">{viewOrder.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={getStatusBadge(viewOrder.status)}>{viewOrder.status}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">{viewOrder.date || "N/A"}</p>
              </div>
            </div>
            <button 
              onClick={() => setViewOrder(null)} 
              className="btn-primary w-full mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;

