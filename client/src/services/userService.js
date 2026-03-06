import API from "../utils/db.js";

export const getAllUsers = () => {
  return API.get("/profile/get-all-users");
};

export const getUser = (email) => {
  return API.get(`/profile/get-user/${email}`);
};

export const addUser = (data) => {
  return API.post("/profile/add-user", data);
};

export const updateUser = (data) => {
  return API.put("/profile/update-user", data);
};

export const deleteUser = (email) => {
  return API.delete(`/profile/delete-user/${email}`);
};

export const updateRole = (data) => {
  return API.put("/profile/update-role", data);
};

// ================= ORDER SERVICES =================

export const getOrders = () => {
  return API.get("/order/get-orders");
};

export const getOrderStats = () => {
  return API.get("/order/stats");
};

export const createOrder = (data) => {
  return API.post("/order/create-order", data);
};

export const updateOrder = (id, data) => {
  return API.put(`/order/update-order/${id}`, data);
};

export const deleteOrder = (id) => {
  return API.delete(`/order/delete-order/${id}`);
};

export const assignDelivery = (id, data) => {
  return API.put(`/order/assign-delivery/${id}`, data);
};

export const updateOrderStatus = (id, data) => {
  return API.put(`/order/update-status/${id}`, data);
};

// ================= CUSTOMER SERVICES =================

export const getCustomers = () => {
  return API.get("/customer/get-customers");
};

export const addCustomer = (data) => {
  return API.post("/customer/add-customer", data);
};

export const updateCustomer = (id, data) => {
  return API.put(`/customer/update-customer/${id}`, data);
};

export const deleteCustomer = (id) => {
  return API.delete(`/customer/delete-customer/${id}`);
};

// ================= DELIVERY SERVICES =================

export const getDeliveries = () => {
  return API.get("/delivery/get-deliveries");
};

export const createDelivery = (data) => {
  return API.post("/delivery/create-delivery", data);
};

export const updateDelivery = (id, data) => {
  return API.put(`/delivery/update-delivery/${id}`, data);
};

export const deleteDelivery = (id) => {
  return API.delete(`/delivery/delete-delivery/${id}`);
};

// ================= EMPLOYEE SERVICES =================

export const getEmployees = () => {
  return API.get("/auth/employees");
};

export const createEmployee = (data) => {
  return API.post("/auth/employees", data);
};

export const updateEmployee = (id, data) => {
  return API.put(`/auth/employees/${id}`, data);
};

export const deleteEmployee = (id) => {
  return API.delete(`/auth/employees/${id}`);
};
