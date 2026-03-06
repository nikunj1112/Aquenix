import { useState, useEffect } from "react";
import { FiSearch, FiUser, FiPhone, FiMapPin, FiMail, FiClock } from "react-icons/fi";
import api from "../../utils/db.js";

function CustomerInfo() {

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {

    try {

      const res = await api.get("/customer/get-customers");
      setCustomers(res.data.data || []);

    } catch (error) {

      console.log("Error fetching customers:", error);

      setCustomers([
        { _id: "1", name: "John Doe", email: "john@example.com", phone: "+1 234 567 8901", address: "123 Main St, New York", notes: "Leave at door", preference: "Morning" },
        { _id: "2", name: "Sarah Smith", email: "sarah@example.com", phone: "+1 234 567 8902", address: "456 Oak Ave, Los Angeles", notes: "Ring bell twice", preference: "Afternoon" },
        { _id: "3", name: "Mike Johnson", email: "mike@example.com", phone: "+1 234 567 8903", address: "789 Pine Rd, Chicago", notes: "Call before delivery", preference: "Evening" },
        { _id: "4", name: "Emily Brown", email: "emily@example.com", phone: "+1 234 567 8904", address: "321 Elm St, Houston", notes: "Gate code: 1234", preference: "Morning" },
      ]);

    }

    setLoading(false);

  };

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (

    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark">Customer Information</h1>
        <p className="text-gray-500 mt-1">View customer details and delivery preferences</p>
      </div>


      <div className="glass-card p-4 mb-6">

        <div className="relative">

          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control pl-12"
          />

        </div>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {filteredCustomers.map((customer) => (

          <div
            key={customer._id}
            className="glass-card p-4 cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => setSelectedCustomer(customer)}
          >

            <div className="flex items-center gap-3 mb-3">

              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                {customer.name?.charAt(0)}
              </div>

              <div>
                <h3 className="font-semibold">{customer.name}</h3>
                <p className="text-sm text-gray-500">{customer.phone}</p>
              </div>

            </div>


            <div className="text-sm text-gray-600">

              <div className="flex items-center gap-2 mb-1">
                <FiMapPin size={14} />
                <span className="truncate">{customer.address}</span>
              </div>

              {customer.preference && (

                <div className="flex items-center gap-2">
                  <FiClock size={14} />
                  <span>Prefers: {customer.preference}</span>
                </div>

              )}

            </div>

          </div>

        ))}

      </div>


      {selectedCustomer && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="glass-card w-full max-w-lg p-6">

            <div className="flex items-center gap-4 mb-6">

              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                {selectedCustomer.name?.charAt(0)}
              </div>

              <div>
                <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                <span className="badge badge-primary">Regular</span>
              </div>

            </div>


            <div className="space-y-4">

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FiMail className="text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedCustomer.email}</p>
                </div>
              </div>


              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FiPhone className="text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedCustomer.phone}</p>
                </div>
              </div>


              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FiMapPin className="text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{selectedCustomer.address}</p>
                </div>
              </div>


              {selectedCustomer.notes && (

                <div className="p-3 bg-warning/10 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Delivery Notes</p>
                  <p className="font-medium">{selectedCustomer.notes}</p>
                </div>

              )}

            </div>


            <button
              onClick={() => setSelectedCustomer(null)}
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

export default CustomerInfo;