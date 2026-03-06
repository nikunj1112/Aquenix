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
      amount,
      trackingHistory: [{
        status: "Pending",
        time: new Date(),
        description: "Order has been created and is waiting for assignment"
      }]
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
    const { customerName, email, phone, address, status, deliveryPerson, deliveryPersonName, scheduledTime, notes, amount } = req.body;

    const order = await OrderCollection.findByIdAndUpdate(
      id,
      { customerName, email, phone, address, status, deliveryPerson, deliveryPersonName, scheduledTime, notes, amount },
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
    const { deliveryPerson, deliveryPersonName } = req.body;

    const order = await OrderCollection.findByIdAndUpdate(
      id,
      { 
        deliveryPerson, 
        deliveryPersonName,
        status: "Assigned" 
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Add tracking history entry
    order.trackingHistory.push({
      status: "Assigned",
      time: new Date(),
      description: `Order assigned to ${deliveryPersonName || 'delivery partner'}`
    });
    await order.save();

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

// ================= GET ORDERS FOR DELIVERY PARTNER =================
export const getDeliveryPartnerOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await OrderCollection.find({ 
      deliveryPerson: userId 
    }).sort({ createdAt: -1 });

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

// ================= GET DELIVERY PARTNER STATS =================
export const getDeliveryPartnerStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const totalAssigned = await OrderCollection.countDocuments({ deliveryPerson: userId });
    const pending = await OrderCollection.countDocuments({ deliveryPerson: userId, status: "Assigned" });
    const outForDelivery = await OrderCollection.countDocuments({ deliveryPerson: userId, status: "Out for Delivery" });
    const delivered = await OrderCollection.countDocuments({ deliveryPerson: userId, status: "Delivered" });

    res.json({
      success: true,
      stats: {
        totalAssigned,
        pending,
        outForDelivery,
        delivered
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= UPDATE ORDER STATUS (For Delivery Partner) =================
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await OrderCollection.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Update status
    order.status = status;

    // Add tracking history entry
    const statusDescriptions = {
      "Assigned": "Order has been assigned to a delivery partner",
      "Out for Delivery": "Order is out for delivery",
      "Delivered": "Order has been delivered successfully",
      "Cancelled": "Order has been cancelled"
    };

    order.trackingHistory.push({
      status: status,
      time: new Date(),
      description: statusDescriptions[status] || "Status updated"
    });

    await order.save();

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

// ================= GET ORDER STATISTICS =================
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await OrderCollection.countDocuments();
    const pendingOrders = await OrderCollection.countDocuments({ status: "Pending" });
    const assignedOrders = await OrderCollection.countDocuments({ status: "Assigned" });
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
        assignedOrders,
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

