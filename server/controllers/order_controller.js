import { OrderCollection } from "../models/order_model.js";

// ================= CREATE ORDER =================
export const createOrder = async (req, res) => {
  try {
    const { customerName, email, phone, address, scheduledTime, notes, amount } = req.body;

    if (!customerName || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Customer name, phone, and address are required"
      });
    }

    const order = await OrderCollection.create({
      customerName,
      email,
      phone,
      address,
      scheduledTime,
      notes,
      amount
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= UPDATE ORDER =================
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, email, phone, address, status, deliveryPerson, scheduledTime, notes, amount } = req.body;

    const order = await OrderCollection.findByIdAndUpdate(
      id,
      { customerName, email, phone, address, status, deliveryPerson, scheduledTime, notes, amount },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Order updated successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET ALL ORDERS =================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderCollection.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET ORDER BY ID =================
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderCollection.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= DELETE ORDER =================
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderCollection.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= ASSIGN DELIVERY PERSON =================
export const assignDeliveryPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryPerson } = req.body;

    const order = await OrderCollection.findByIdAndUpdate(
      id,
      { deliveryPerson, status: "Out for Delivery" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Delivery person assigned successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET ORDER STATISTICS =================
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await OrderCollection.countDocuments();
    const pendingOrders = await OrderCollection.countDocuments({ status: "Pending" });
    const outForDelivery = await OrderCollection.countDocuments({ status: "Out for Delivery" });
    const deliveredOrders = await OrderCollection.countDocuments({ status: "Delivered" });
    
    const orders = await OrderCollection.find().sort({ createdAt: -1 }).limit(5);
    
    // Calculate revenue from delivered orders
    const deliveredOrderDocs = await OrderCollection.find({ status: "Delivered" });
    const totalRevenue = deliveredOrderDocs.reduce((sum, order) => sum + (order.amount || 0), 0);

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        outForDelivery,
        deliveredOrders,
        totalRevenue,
        recentOrders: orders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= UPDATE ORDER STATUS =================
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await OrderCollection.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
