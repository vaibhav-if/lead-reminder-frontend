import { useState } from "react";
import "./App.css";

function App() {
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "abc",
      mobile: "1234",
      email: "abc@abc.com",
      meeting_date: "2025-02-10",
      meeting_notes: "Some notes",
      is_active: true,
    },
  ]);

  const [newLead, setNewLead] = useState({
    name: "",
    mobile: "",
    email: "",
    meeting_date: "",
    meeting_notes: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("active"); // 'all', 'active', 'inactive'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLead((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLead = () => {
    if (editIndex !== null) {
      // Edit existing lead
      const updatedLeads = [...leads];
      updatedLeads[editIndex] = { ...updatedLeads[editIndex], ...newLead };
      setLeads(updatedLeads);
      setEditIndex(null);
    } else {
      // Add new lead
      setLeads((prev) => [
        ...prev,
        { id: prev.length + 1, ...newLead, is_active: true },
      ]);
    }
    setNewLead({
      name: "",
      mobile: "",
      email: "",
      meeting_date: "",
      meeting_notes: "",
    });
  };

  const handleEditLead = (index) => {
    setNewLead(leads[index]);
    setEditIndex(index);
  };

  const handleDeleteLead = (id) => {
    // Soft deleting leads by marking them inactive
    setLeads(
      leads.map((lead) =>
        lead.id === id ? { ...lead, is_active: false } : lead
      )
    );
  };

  const filteredLeads = leads.filter((lead) => {
    const isActiveFilter =
      filterActive === "active"
        ? lead.is_active
        : filterActive === "inactive"
        ? !lead.is_active
        : true;
    return (
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      isActiveFilter
    );
  });

  return (
    <div className="min-h-screen bg-light-gray flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav className="bg-dark-blue text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Lead Reminders</h1>
          <div className="space-x-4">
            <a href="#about" className="hover:text-cyan">
              About
            </a>
            <a href="#pricing" className="hover:text-cyan">
              Pricing
            </a>
            <a href="#user-menu" className="hover:text-cyan">
              User Menu
            </a>
          </div>
        </div>
      </nav>

      <main id="main-content" className="flex-grow p-4">
        <h2 className="text-dark-blue text-2xl mb-4">Add Leads Form</h2>
        <div className="mb-4 flex flex-col md:flex-row gap-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newLead.name}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={newLead.mobile}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newLead.email}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          />
          <input
            type="date"
            name="meeting_date"
            value={newLead.meeting_date}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
          />
          <input
            type="text"
            name="meeting_notes"
            placeholder="Meeting Notes"
            value={newLead.meeting_notes}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
          />
          <button
            onClick={handleAddLead}
            className={`bg-cyan text-white p-2 rounded ${
              editIndex !== null ? "bg-pink-red" : ""
            }`}
          >
            {editIndex !== null ? "Update Lead" : "Add Lead"}
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          />
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="all">All Leads</option>
            <option value="active">Active Leads</option>
            <option value="inactive">Inactive Leads</option>
          </select>
        </div>

        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Mobile</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Meeting Date</th>
              <th className="border px-4 py-2">Meeting Notes</th>
              <th className="border px-4 py-2">Actions</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead, index) => (
              <tr key={lead.id}>
                {editIndex === index ? (
                  <>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={newLead.name}
                        onChange={(e) =>
                          setNewLead({ ...newLead, name: e.target.value })
                        }
                        className="border border-gray-300 p-1 rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={newLead.mobile}
                        onChange={(e) =>
                          setNewLead({ ...newLead, mobile: e.target.value })
                        }
                        className="border border-gray-300 p-1 rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="email"
                        value={newLead.email}
                        onChange={(e) =>
                          setNewLead({ ...newLead, email: e.target.value })
                        }
                        className="border border-gray-300 p-1 rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="date"
                        value={newLead.meeting_date}
                        onChange={(e) =>
                          setNewLead({
                            ...newLead,
                            meeting_date: e.target.value,
                          })
                        }
                        className="border border-gray-300 p-1 rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={newLead.meeting_notes}
                        onChange={(e) =>
                          setNewLead({
                            ...newLead,
                            meeting_notes: e.target.value,
                          })
                        }
                        className="border border-gray-300 p-1 rounded"
                      />
                    </td>
                    <td className={`border px-4 py-2`}>
                      <button
                        onClick={() => {
                          handleAddLead();
                        }}
                        className="bg-cyan text-white p-1 rounded mr-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditIndex(null)}
                        className="bg-pink-red text-white p-1 rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td
                      className={`border px-4 py-2 ${
                        lead.is_active ? "" : "line-through"
                      }`}
                    >
                      {lead.name}
                    </td>
                    <td
                      className={`border px-4 py-2 ${
                        lead.is_active ? "" : "line-through"
                      }`}
                    >
                      {lead.mobile}
                    </td>
                    <td
                      className={`border px-4 py-2 ${
                        lead.is_active ? "" : "line-through"
                      }`}
                    >
                      {lead.email}
                    </td>
                    <td
                      className={`border px-4 py-2 ${
                        lead.is_active ? "" : "line-through"
                      }`}
                    >
                      {lead.meeting_date}
                    </td>
                    <td
                      className={`border px-4 py-2 ${
                        lead.is_active ? "" : "line-through"
                      }`}
                    >
                      {lead.meeting_notes}
                    </td>
                    <td className={`border px-4 py-2`}>
                      {lead.is_active ? (
                        <>
                          <button
                            onClick={() => handleEditLead(index)}
                            className="bg-cyan text-white p=1 rounded mr=1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="bg-pink-red text-white p=1 rounded"
                          >
                            Deactivate
                          </button>
                        </>
                      ) : (
                        <>Inactive</>
                      )}
                    </td>
                  </>
                )}
                <td
                  className={`border px=4 py=2 ${
                    lead.is_active ? "text-green" : "text-red"
                  }`}
                >
                  {lead.is_active ? "Active" : "Inactive"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer className="bg-dark-blue text-white text-center p=4">
        &copy; {new Date().getFullYear()} Lead Reminders. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
