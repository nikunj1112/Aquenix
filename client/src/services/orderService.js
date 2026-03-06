import API from "../utils/db.js";

// ================= ORDER SERVICE =================

// Get all orders
export const getAllOrders = () => {
  return API.get("/order/get-orders");
};

// Get order by ID
export const getOrderById = (id) => {
  return API.get(`/order/get-order/${id}`);
};

// Create order
export const createOrder = (data) => {
  return API.post("/order/create-order", data);
};

// Update order
export const updateOrder = (id, data) => {
  return API.put(`/order/update-order/${id}`, data);
};

// Delete order
export const deleteOrder = (id) => {
  return API.delete(`/order/delete-order/${id}`);
};

// Assign delivery person
export const assignDeliveryPerson = (id, data) => {
  return API.put(`/order/assign-delivery/${id}`, data);
};

// Update order status
export const updateOrderStatus = (id, data) => {
  return API.put(`/order/update-status/${id}`, data);
};

// Get order stats
export const getOrderStats = () => {
  return API.get("/order/stats");
};

// Get my orders (delivery partner)
export const getMyOrders = () => {
  return API.get("/order/my-orders");
};

// Get delivery partner stats
export const getDeliveryStats = () => {
  return API.get("/order/delivery-stats");
};

