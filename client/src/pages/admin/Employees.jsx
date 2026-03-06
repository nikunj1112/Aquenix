import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import api from "../../utils/db.js";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "delivery"
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/profile/get-all-users");
      setEmployees(res.data.data || []);
    } catch (error) {
      console.log("Error fetching employees:", error);
      // Mock data
      setEmployees([
        { _id: "1", name: "John Smith", email: "john@example.com", phone: "+1 234 567 8901", address: "123 Main St", role: "delivery", createdAt: "2024-01-01" },
        { _id: "2", name: "Mike Wilson", email: "mike@example.com", phone: "+1 234 567 8902", address: "456 Oak Ave", role: "delivery", createdAt: "2024-01-05" },
        { _id: "3", name: "Sarah Davis", email: "sarah@example.com", phone: "+1 234 567 8903", address: "789 Pine Rd", role: "admin", createdAt: "2024-01-10" },
      ]);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/profile/add-user", formData);
      fetchEmployees();
      setShowModal(false);
      setFormData({ name: "", email: "", phone: "", address: "", role: "delivery" });
    } catch (error) {
      console.log("Error adding employee:", error);
    }
  };

  const deleteEmployee = async (email) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      try {
        await api.delete(`/profile/delete-user/${email}`);
        fetchEmployees();
      } catch (error) {
        console.log("Error deleting employee:", error);
      }
    }
  };

  const updateRole = async (email, newRole) => {
    try {
      await api.put("/profile/update-role", { email, role: newRole });
      fetchEmployees();
    } catch (error) {
      console.log("Error updating role:", error);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.phone?.includes(searchTerm)
  );

  const getRoleBadge = (role) => {
    return role === "admin" ? "badge badge-primary" : "badge badge-info";
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
          <h1 className="text-3xl font-bold text-dark">Employees</h1>
          <p className="text-gray-500 mt-1">Manage your team members</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary mt-4 md:mt-0 flex items-center gap-2">
          <FiPlus /> Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <FiUser size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-xl font-bold">{employees.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-info/10 text-info">
              <FiTruck size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Staff</p>
              <p className="text-xl font-bold">{employees.filter(e => e.role === "delivery").length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/10 text-success">
              <FiUser size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-xl font-bold">{employees.filter(e => e.role === "admin").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search employees..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="form-control pl-12" 
          />
        </div>
      </div>

      {/* Employees Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee._id} className="table-row">
                  <td className="font-medium">{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone || "N/A"}</td>
                  <td>{employee.address || "N/A"}</td>
                  <td>
                    <span className={getRoleBadge(employee.role)}>{employee.role}</span>
                  </td>
                  <td>{employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : "N/A"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setViewEmployee(employee)} 
                        className="p-2 text-info hover:bg-info/10 rounded-lg"
                      >
                        <FiSearch />
                      </button>
                      <button 
                        onClick={() => updateRole(employee.email, employee.role === "admin" ? "delivery" : "admin")}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                        title="Toggle Role"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => deleteEmployee(employee.email)} 
                        className="p-2 text-danger hover:bg-danger/10 rounded-lg"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Add New Employee</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  className="form-control" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  name="email"
                  className="form-control" 
                  value={formData.email}
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
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Address</label>
                <textarea 
                  name="address"
                  className="form-control" 
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Role</label>
                <select 
                  name="role"
                  className="form-control"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="delivery">Delivery Staff</option>
                  <option value="admin">Admin</option>
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
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {viewEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                {viewEmployee.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{viewEmployee.name}</h3>
                <span className={getRoleBadge(viewEmployee.role)}>{viewEmployee.role}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FiMail className="text-primary" />
                <span>{viewEmployee.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="text-primary" />
                <span>{viewEmployee.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3">
                <FiMapPin className="text-primary" />
                <span>{viewEmployee.address || "N/A"}</span>
              </div>
            </div>
            <button 
              onClick={() => setViewEmployee(null)} 
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

export default Employees;

