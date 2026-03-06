import { CustomerCollection } from "../models/customer_model.js";

// ================= ADD CUSTOMER =================
export const addCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, subscription, notes, preference } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required"
      });
    }

    const existing = await CustomerCollection.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Customer with this email already exists"
      });
    }

    const customer = await CustomerCollection.create({
      name,
      email,
      phone,
      address,
      subscription,
      notes,
      preference
    });

    res.status(201).json({
      success: true,
      message: "Customer added successfully",
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= UPDATE CUSTOMER =================
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, subscription, status, notes, preference } = req.body;

    const customer = await CustomerCollection.findByIdAndUpdate(
      id,
      { name, email, phone, address, subscription, status, notes, preference },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    res.json({
      success: true,
      message: "Customer updated successfully",
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET ALL CUSTOMERS =================
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await CustomerCollection.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET CUSTOMER BY ID =================
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await CustomerCollection.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= DELETE CUSTOMER =================
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await CustomerCollection.findByIdAndDelete(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    res.json({
      success: true,
      message: "Customer deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
