import { useState } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const initialCustomers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+1 234 567 8901", address: "123 Main St, New York", subscription: "Premium", status: "Active", joinDate: "2024-01-15" },
  { id: 2, name: "Sarah Smith", email: "sarah@example.com", phone: "+1 234 567 8902", address: "456 Oak Ave, Los Angeles", subscription: "Basic", status: "Active", joinDate: "2024-02-20" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+1 234 567 8903", address: "789 Pine Rd, Chicago", subscription: "Premium", status: "Inactive", joinDate: "2024-03-10" },
  { id: 4, name: "Emily Brown", email: "emily@example.com", phone: "+1 234 567 8904", address: "321 Elm St, Houston", subscription: "Standard", status: "Active", joinDate: "2024-04-05" },
  { id: 5, name: "David Wilson", email: "david@example.com", phone: "+1 234 567 8905", address: "654 Maple Dr, Phoenix", subscription: "Premium", status: "Active", joinDate: "2024-05-12" }
];

function Customers() {
  const [customers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewCustomer, setViewCustomer] = useState(null);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

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

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your customer base</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary mt-4 md:mt-0">
          <FiPlus /> Add Customer
        </button>
      </div>

      <div className="glass-card p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search customers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control pl-12" />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subscription</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="table-row">
                <td className="font-medium">{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td><span className={getBadgeClass("subscription", customer.subscription)}>{customer.subscription}</span></td>
                <td><span className={getBadgeClass("status", customer.status)}>{customer.status}</span></td>
                <td>{customer.joinDate}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => setViewCustomer(customer)} className="p-2 text-info hover:bg-info/10 rounded-lg"><FiEye /></button>
                    <button className="p-2 text-primary hover:bg-primary/10 rounded-lg"><FiEdit2 /></button>
                    <button className="p-2 text-danger hover:bg-danger/10 rounded-lg"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Add New Customer</h3>
            <form>
              <div className="mb-4"><label className="form-label">Full Name</label><input type="text" className="form-control" /></div>
              <div className="mb-4"><label className="form-label">Email</label><input type="email" className="form-control" /></div>
              <div className="mb-4"><label className="form-label">Phone</label><input type="tel" className="form-control" /></div>
              <div className="mb-4"><label className="form-label">Address</label><input type="text" className="form-control" /></div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="button" className="btn btn-primary flex-1">Add Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Customer Details</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">{viewCustomer.name.charAt(0)}</div>
              <div>
                <h4 className="text-lg font-semibold">{viewCustomer.name}</h4>
                <span className={getBadgeClass("status", viewCustomer.status)}>{viewCustomer.status}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3"><FiMail className="text-primary" /><span>{viewCustomer.email}</span></div>
              <div className="flex items-center gap-3"><FiPhone className="text-primary" /><span>{viewCustomer.phone}</span></div>
              <div className="flex items-center gap-3"><FiMapPin className="text-primary" /><span>{viewCustomer.address}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div><p className="text-sm text-gray-500">Subscription</p><p className="font-semibold">{viewCustomer.subscription}</p></div>
              <div><p className="text-sm text-gray-500">Join Date</p><p className="font-semibold">{viewCustomer.joinDate}</p></div>
            </div>
            <button onClick={() => setViewCustomer(null)} className="btn btn-primary w-full mt-6">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
