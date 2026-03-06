import { useState, useEffect } from "react";
import { FiTruck, FiMapPin, FiCheck, FiClock, FiNavigation } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/db.js";

function DeliveryTracking() {

  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {

    try {

      const res = await api.get("/order/get-orders");

      const allOrders = res.data.data || [];

      const myOrders = allOrders.filter(order =>
        order.deliveryPerson === user?.name ||
        order.deliveryPerson === user?.email
      );

      setOrders(myOrders);

    } catch (error) {

      console.log("Error fetching orders:", error);

      setOrders([
        { _id: "ORD001", customerName: "John Doe", address: "123 Main St", status: "Pending", scheduledTime: "10:00 AM", lat: 40.7128, lng: -74.0060 },
        { _id: "ORD002", customerName: "Sarah Smith", address: "456 Oak Ave", status: "Out for Delivery", scheduledTime: "11:00 AM", lat: 40.7580, lng: -73.9855 },
        { _id: "ORD003", customerName: "Mike Johnson", address: "789 Pine Rd", status: "Delivered", scheduledTime: "09:00 AM", lat: 40.7484, lng: -73.9857 },
      ]);

    }

    setLoading(false);

  };

  const updateStatus = async (orderId, status) => {

    try {

      await api.put(`/order/update-order/${orderId}`, { status });

      fetchOrders();

    } catch (error) {

      console.log("Error updating status:", error);

    }

  };

  const pendingCount = orders.filter(o => o.status === "Pending").length;
  const inTransitCount = orders.filter(o => o.status === "Out for Delivery").length;
  const deliveredCount = orders.filter(o => o.status === "Delivered").length;

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
        <h1 className="text-3xl font-bold text-dark">Delivery Tracking</h1>
        <p className="text-gray-500 mt-1">Track and manage your delivery routes</p>
      </div>


      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="glass-card p-4">

          <div className="flex items-center gap-3">

            <div className="p-3 rounded-xl bg-warning/20 text-yellow-700">
              <FiClock size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold">{pendingCount}</p>
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
              <p className="text-xl font-bold">{inTransitCount}</p>
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
              <p className="text-xl font-bold">{deliveredCount}</p>
            </div>

          </div>

        </div>

      </div>


      {/* Route List */}

      <div className="glass-card p-6">

        <h2 className="text-xl font-semibold mb-4">Today's Route</h2>

        <div className="space-y-4">

          {orders.map((order, index) => (

            <div key={order._id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">

              <div className="flex flex-col items-center">

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    order.status === "Delivered"
                      ? "bg-success text-white"
                      : order.status === "Out for Delivery"
                      ? "bg-info text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >

                  {order.status === "Delivered" ? (
                    <FiCheck size={18} />
                  ) : order.status === "Out for Delivery" ? (
                    <FiTruck size={18} />
                  ) : (
                    <span className="font-bold">{index + 1}</span>
                  )}

                </div>

                {index < orders.length - 1 && (
                  <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                )}

              </div>


              <div className="flex-1">

                <div className="flex items-start justify-between">

                  <div>

                    <h4 className="font-semibold">{order.customerName}</h4>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <FiMapPin size={14} />
                      {order.address}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <FiClock size={14} />
                      {order.scheduledTime}
                    </div>

                  </div>


                  <div className="text-right">

                    <span
                      className={`badge ${
                        order.status === "Delivered"
                          ? "badge-success"
                          : order.status === "Out for Delivery"
                          ? "badge-info"
                          : "badge-warning"
                      }`}
                    >
                      {order.status}
                    </span>

                  </div>

                </div>


                <div className="mt-3 flex gap-2">

                  {order.status === "Pending" && (

                    <button
                      onClick={() => updateStatus(order._id, "Out for Delivery")}
                      className="btn-primary text-sm py-2"
                    >
                      <FiNavigation className="inline mr-1" />
                      Start
                    </button>

                  )}

                  {order.status === "Out for Delivery" && (

                    <button
                      onClick={() => updateStatus(order._id, "Delivered")}
                      className="btn-primary text-sm py-2"
                    >
                      <FiCheck className="inline mr-1" />
                      Complete
                    </button>

                  )}

                </div>

              </div>

            </div>

          ))}


          {orders.length === 0 && (

            <div className="text-center py-8 text-gray-500">
              No deliveries assigned
            </div>

          )}

        </div>

      </div>

    </div>

  );

}

export default DeliveryTracking;