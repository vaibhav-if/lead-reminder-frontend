import { useState, useEffect } from "react";
import axios from "axios";

const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

function Leads() {
  const [leads, setLeads] = useState([]);
  const [newLead, setNewLead] = useState({
    name: "",
    mobile: "",
    email: "",
    meeting_date: "",
    meeting_notes: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("active");

  // Regex pattern for validating Indian mobile numbers (Refactor to common file)
  const mobilePattern = /^[6-9]\d{9}$/;

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/leads`);
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLead((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleAddLead = async () => {
    const { name, mobile, meeting_date, meeting_notes } = newLead;
    if (!name) {
      setErrorMessage("Name is mandatory.");
      return;
    }

    if (!mobile) {
      setErrorMessage("Mobile number is mandatory.");
      return;
    }

    if (!mobilePattern.test(mobile)) {
      setErrorMessage("Please enter a valid Indian mobile number.");
      return;
    }

    if (!meeting_date) {
      setErrorMessage("Meeting date is mandatory.");
      return;
    }

    if (meeting_notes.length > 50) {
      setErrorMessage("Meeting notes cannot exceed 50 characters.");
      return;
    }

    if (editIndex !== null) {
      await updateLead(leads[editIndex].id, newLead);
      setEditIndex(null);
    } else {
      // Add new lead if editIndex is null
      await createLead(newLead);
    }
    resetNewLead();
    fetchLeads(); // Refresh leads after adding/updating
  };

  const createLead = async (lead) => {
    try {
      await axios.post(`${SERVER_URL}/leads`, {
        ...lead,
        is_active: true,
      });
    } catch (error) {
      console.error("Error adding lead:", error);
    }
  };

  const updateLead = async (id, lead) => {
    try {
      await axios.put(`${SERVER_URL}/leads/${id}`, lead);
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const handleEditLead = (index) => {
    setNewLead(leads[index]);
    setEditIndex(index);
  };

  const handleCancel = () => {
    resetNewLead();
    setEditIndex(null);
  };

  const resetNewLead = () => {
    setNewLead({
      name: "",
      mobile: "",
      email: "",
      meeting_date: "",
      meeting_notes: "",
    });
  };

  const handleDeleteLead = async (id) => {
    try {
      // Soft delete by marking the lead inactive
      await axios.put(`${SERVER_URL}/leads/${id}`, {
        is_active: false,
      });
      fetchLeads(); // Refresh leads after deletion
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
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
    <div>
      <h2 className="text-dark-blue text-2xl mb-4">Add Leads Form</h2>
      <div className="flex flex-col md:flex-row gap-2">
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
          placeholder="Meeting Notes (max 50 characters)"
          value={newLead.meeting_notes}
          onChange={handleChange}
          maxLength={50}
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Search and Filter Section */}
      <div className="mb-2 mt-20 flex justify-between items-center">
        <h2 className="text-dark-blue text-2xl">Leads Records</h2>
        <div className="flex gap-2">
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
                      onClick={handleCancel}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leads;
