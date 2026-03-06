import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";

// Routes
import authRoutes from "./routes/auth_route.js";
import profileRoutes from "./routes/ profile_route.js";
import customerRoutes from "./routes/customer_route.js";
import orderRoutes from "./routes/order_route.js";
import deliveryRoutes from "./routes/delivery_route.js";

// Load env variables
dotenv.config();

// Connect database
connectDB();

// Create express app
const app = express();


// ================= MIDDLEWARE =================

// JSON parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
  })
);


// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/delivery", deliveryRoutes);


// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.send("AQUENIX Backend Running 🚀");
});


// ================= SERVER START =================

const PORT = process.env.PORT || 1011;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
