import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Auth Pages */

import FirstPage from "./pages/auth/firstPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";

/* Admin Pages */

import Dashboard from "./pages/admin/Dashboard";
import Customers from "./pages/admin/Customers";
import Orders from "./pages/admin/Orders";
import Deliveries from "./pages/admin/Deliveries";
import Employees from "./pages/admin/Employees";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";

/* Delivery Pages */

import DeliveryDashboard from "./pages/delivery/Dashboard";
import AssignedOrders from "./pages/delivery/AssignedOrders";
import DeliveryTracking from "./pages/delivery/DeliveryTracking";
import CustomerInfo from "./pages/delivery/CustomerInfo";
import Profile from "./pages/delivery/Profile";

/* Layouts */

import AdminLayout from "./layouts/AdminLayout";
import DeliveryLayout from "./layouts/DeliveryLayout";

/* Protected Route */

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <Router>

      <Routes>

        {/* Auth Pages */}

        <Route path="/" element={<FirstPage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/change-password" element={<ChangePassword />} />



        {/* ADMIN ROUTES */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <Customers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <Orders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/deliveries"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <Deliveries />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <Employees />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <Reports />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />



        {/* DELIVERY ROUTES */}

        <Route
          path="/delivery/dashboard"
          element={
            <ProtectedRoute allowedRoles={["delivery"]}>
              <DeliveryLayout>
                <DeliveryDashboard />
              </DeliveryLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/delivery/orders"
          element={
            <ProtectedRoute allowedRoles={["delivery"]}>
              <DeliveryLayout>
                <AssignedOrders />
              </DeliveryLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/delivery/tracking"
          element={
            <ProtectedRoute allowedRoles={["delivery"]}>
              <DeliveryLayout>
                <DeliveryTracking />
              </DeliveryLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/delivery/customers"
          element={
            <ProtectedRoute allowedRoles={["delivery"]}>
              <DeliveryLayout>
                <CustomerInfo />
              </DeliveryLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/delivery/profile"
          element={
            <ProtectedRoute allowedRoles={["delivery"]}>
              <DeliveryLayout>
                <Profile />
              </DeliveryLayout>
            </ProtectedRoute>
          }
        />

      </Routes>

    </Router>

  );
}

export default App;
