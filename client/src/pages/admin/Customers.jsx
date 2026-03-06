
import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from "../../services/userService";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    subscription: "Basic",
    notes: "",
    preference: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      if (response.data.success) {
        setCustomers(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editCustomer) {
        await updateCustomer(editCustomer._id, formData);
      } else {
        await addCustomer(formData);
      }
      await fetchCustomers();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    
    try {
      await deleteCustomer(id);
      await fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const openEdit = (customer) => {
    setEditCustomer(customer);
    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      subscription: customer.subscription || "Basic",
      notes: customer.notes || "",
      preference: customer.preference || ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      subscription: "Basic",
      notes: "",
      preference: ""
    });
    setError("");
  };

  const getBadgeClass = (type, value) => {
    if (type === "subscription") {
      if (value === "Premium") return "badge badge-primary";
      if (value === "Standard") return "badge badge-info";
      return "badge badge-warning";
    }
    if (type === "status") {
      return value === "Active" ? "badge badge-success" : "badge badge-danger";
    }
    return "badge";
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your customer base</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary mt-4 md:mt-0 flex items-center gap-2">
          <FiPlus /> Add Customer
        </button>
      </div>

      <div className="glass-card p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search customers by name, email or phone..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="form-control pl-12" 
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {filteredCustomers.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Subscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="table-row">
                  <td className="font-medium">{customer.name}</td>
                  <td>{customer.email || "-"}</td>
                  <td>{customer.phone}</td>
                  <td className="max-w-xs truncate">{customer.address || "-"}</td>
                  <td><span className={getBadgeClass("subscription", customer.subscription)}>{customer.subscription || "Basic"}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => setViewCustomer(customer)} className="p-2 text-info hover:bg-info/10 rounded-lg"><FiEye /></button>
                      <button onClick={() => openEdit(customer)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(customer._id)} className="p-2 text-danger hover:bg-danger/10 rounded-lg"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? "No customers found matching your search" : "No customers yet. Add your first customer!"}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">{editCustomer ? "Edit Customer" : "Add New Customer"}</h3>
            {error && <div className="alert alert-danger mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label">Full Name *</label>
                <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="mb-4">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="form-label">Phone *</label>
                <input type="tel" className="form-control" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
              </div>
              <div className="mb-4">
                <label className="form-label">Address</label>
                <input type="text" className="form-control" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="form-label">Subscription</label>
                <select className="form-control" value={formData.subscription} onChange={(e) => setFormData({...formData, subscription: e.target.value})}>
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label">Notes</label>
                <textarea className="form-control" rows="2" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={closeModal} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1" disabled={submitting}>
                  {submitting ? "Saving..." : (editCustomer ? "Update" : "Add Customer")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Customer Details</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                {viewCustomer.name?.charAt(0) || "?"}
              </div>
              <div>
                <h4 className="text-lg font-semibold">{viewCustomer.name}</h4>
                <span className={getBadgeClass("subscription", viewCustomer.subscription)}>{viewCustomer.subscription || "Basic"}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3"><FiMail className="text-primary" /><span>{viewCustomer.email || "-"}</span></div>
              <div className="flex items-center gap-3"><FiPhone className="text-primary" /><span>{viewCustomer.phone}</span></div>
              <div className="flex items-center gap-3"><FiMapPin className="text-primary" /><span>{viewCustomer.address || "-"}</span></div>
            </div>
            {viewCustomer.notes && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">Notes</p>
                <p>{viewCustomer.notes}</p>
              </div>
            )}
            <button onClick={() => setViewCustomer(null)} className="btn btn-primary w-full mt-6">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;

