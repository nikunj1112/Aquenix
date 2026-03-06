import { DeliveryCollection } from "../models/delivery_model.js";

// ================= CREATE DELIVERY =================
export const createDelivery = async (req, res) => {
  try {
    const { orderId, customerName, phone, address, deliveryPerson, scheduledTime, notes } = req.body;

    if (!customerName || !address) {
      return res.status(400).json({
        success: false,
        message: "Customer name and address are required"
      });
    }

    const delivery = await DeliveryCollection.create({
      orderId,
      customerName,
      phone,
      address,
      deliveryPerson,
      scheduledTime,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Delivery created successfully",
      data: delivery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= UPDATE DELIVERY =================
export const updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, phone, address, status, deliveryPerson, scheduledTime, actualDeliveryTime, notes } = req.body;

    const delivery = await DeliveryCollection.findByIdAndUpdate(
      id,
      { customerName, phone, address, status, deliveryPerson, scheduledTime, actualDeliveryTime, notes },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found"
      });
    }

    res.json({
      success: true,
      message: "Delivery updated successfully",
      data: delivery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET ALL DELIVERIES =================
export const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await DeliveryCollection.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: deliveries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET DELIVERY BY ID =================
export const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await DeliveryCollection.findById(id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found"
      });
    }

    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= DELETE DELIVERY =================
export const deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await DeliveryCollection.findByIdAndDelete(id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found"
      });
    }

    res.json({
      success: true,
      message: "Delivery deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
