import { useState, useEffect } from "react";
import { useUser } from "./UserContext";
import axios from "axios";

const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

function Leads() {
  const { user } = useUser();
  const [leads, setLeads] = useState([]);
  const [newLead, setNewLead] = useState({
    id: null,
    name: "",
    mobile: "",
    email: "",
    meeting_date: "",
    meeting_notes: "",
    userId: "",
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
      const userId = user?.id;
      console.log(user);
      if (!userId) {
        console.error("User ID is not available.");
        return;
      }
      const response = await axios.get(`${SERVER_URL}/users/${userId}/leads`);
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

    const userId = user?.id;
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    if (editIndex !== null) {
      await updateLead(leads[editIndex].id, newLead, userId);
      setEditIndex(null);
    } else {
      // Add new lead if editIndex is null
      await createLead(newLead, userId);
    }
    resetNewLead();
    fetchLeads(); // Refresh leads after adding/updating
  };

  const createLead = async (lead, userId) => {
    try {
      await axios.post(`${SERVER_URL}/leads`, { ...lead, userId });
    } catch (error) {
      setErrorMessage(
        "Error adding lead, please make sure to enter unique phone numbers"
      );
      console.error("Error adding lead:", error);
    }
  };

  const updateLead = async (id, lead, userId) => {
    try {
      await axios.put(`${SERVER_URL}/leads/${id}`, { ...lead, userId });
    } catch (error) {
      setErrorMessage(
        "Error updating lead, please make sure to enter unique phone numbers"
      );
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
      await axios.patch(`${SERVER_URL}/leads/${id}/deactivate`);
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
      <div class="w-full items-center">
        <h2 className="mb-2">Add Leads Form</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newLead.name}
            onChange={handleChange}
            className="border p-2 rounded transition duration-300 ease shadow-sm focus:shadow-md focus:outline-none"
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={newLead.mobile}
            onChange={handleChange}
            className="border  p-2 rounded transition duration-300 ease shadow-sm focus:shadow-md focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newLead.email}
            onChange={handleChange}
            className="border  p-2 rounded transition duration-300 ease shadow-sm focus:shadow-md focus:outline-none"
          />
          <input
            type="date"
            name="meeting_date"
            value={newLead.meeting_date}
            onChange={handleChange}
            className="border  p-2 rounded transition duration-300 ease shadow-sm focus:shadow-md focus:outline-none"
          />
          <textarea
            type="text"
            name="meeting_notes"
            placeholder="Meeting Notes (max 50 characters)"
            value={newLead.meeting_notes}
            onChange={handleChange}
            maxLength={50}
            className="border  p-2 rounded transition duration-300 ease shadow-sm focus:shadow-md focus:outline-none"
            rows={1}
          />
          <button
            onClick={handleAddLead}
            className={`  p-2 rounded ${editIndex !== null ? "" : ""}`}
          >
            {editIndex !== null ? "Update Lead" : "Add Lead"}
          </button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      {/* Table Section: Search and Filter Section */}
      <div class="w-full flex justify-between items-center mb-2 mt-20">
        <div>
          <h2 class="">Leads Records</h2>
        </div>
        <div class="ml-3">
          <div class="w-full max-w-sm min-w-[200px] relative">
            <div class="relative flex gap-2">
              <input
                type="text"
                placeholder="Search by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-11 h-10 pl-3 py-2 bg-transparent  text-slate-700 text-sm border rounded transition duration-300 ease focus:outline-none shadow-sm focus:shadow-md"
              />
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="w-full pr-11 h-10 pl-3 py-2 bg-transparent  text-slate-700 text-sm border rounded transition duration-300 ease focus:outline-none shadow-sm focus:shadow-md"
              >
                <option value="all">All Leads</option>
                <option value="active">Active Leads</option>
                <option value="inactive">Inactive Leads</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="relative flex flex-col w-full h-full overflow-scroll shadow-md rounded-lg bg-clip-border">
        <table class="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th class="p-4 border-b">
                <p class="block leading-none">Name</p>
              </th>
              <th class="p-4 border-b">
                <p class="block leading-none">Mobile</p>
              </th>
              <th class="p-4 border-b">
                <p class="block leading-none">Email</p>
              </th>
              <th class="p-4 border-b">
                <p class="block leading-none">Meeting Date</p>
              </th>
              <th class="p-4 border-b">
                <p class="block leading-none">Meeting Notes</p>
              </th>
              <th class="p-4 border-b">
                <p class="block leading-none">Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead, index) => (
              <tr key={lead.id}>
                {editIndex === index ? (
                  <>
                    <td className="p-4 border-b border-slate-200 py-5">
                      <input
                        type="text"
                        value={newLead.name}
                        onChange={(e) =>
                          setNewLead({ ...newLead, name: e.target.value })
                        }
                        className=""
                      />
                    </td>
                    <td className="p-4 border-b border-slate-200 py-5">
                      <input
                        type="text"
                        value={newLead.mobile}
                        onChange={(e) =>
                          setNewLead({ ...newLead, mobile: e.target.value })
                        }
                        className=""
                      />
                    </td>
                    <td className="p-4 border-b border-slate-200 py-5">
                      <input
                        type="email"
                        value={newLead.email}
                        onChange={(e) =>
                          setNewLead({ ...newLead, email: e.target.value })
                        }
                        className=""
                      />
                    </td>
                    <td className="p-4 border-b border-slate-200 py-5">
                      <input
                        type="date"
                        value={newLead.meeting_date}
                        onChange={(e) =>
                          setNewLead({
                            ...newLead,
                            meeting_date: e.target.value,
                          })
                        }
                        className=""
                      />
                    </td>
                    <td className="p-4 border-b border-slate-200 py-5">
                      <input
                        type="text"
                        value={newLead.meeting_notes}
                        onChange={(e) =>
                          setNewLead({
                            ...newLead,
                            meeting_notes: e.target.value,
                          })
                        }
                        className=""
                      />
                    </td>
                    <td className={`p-4 border-b border-slate-200 py-5`}>
                      <button
                        onClick={() => {
                          handleAddLead();
                        }}
                        className="  p-1 rounded mr-1"
                      >
                        Save
                      </button>
                      <button onClick={handleCancel} className="  p-1 rounded">
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td
                      className={`p-4 border-b border-slate-200 py-5 ${
                        lead.is_active ? "" : "line-through"
                      }`}
                    >
                      <small class="">{lead.name}</small>
                    </td>
                    <td
                      className={`p-4 border-b border-slate-200 py-5 ${
                        lead.is_active ? "" : "line-through"
                      }`}
                    >
                      <small class="">{lead.mobile}</small>
                    </td>
                    <td
                      className={`p-4 border-b border-slate-200 py-5 ${
                        lead.is_active ? "" : "line-through"
                      }`}
                    >
                      <small class="">{lead.email}</small>
                    </td>
                    <td
                      className={`p-4 border-b border-slate-200 py-5 ${
                        lead.is_active ? "" : "line-through"
                      }`}
                    >
                      <small class="">{lead.meeting_date}</small>
                    </td>
                    <td
                      className={`p-4 border-b border-slate-200 py-5 ${
                        lead.is_active ? "" : "line-through"
                      }`}
                    >
                      <small class="">{lead.meeting_notes}</small>
                    </td>
                    <td className={`p-4 border-b border-slate-200 py-5`}>
                      {lead.is_active ? (
                        <>
                          <button
                            onClick={() => handleEditLead(index)}
                            className=""
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className=""
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
    </div>
  );
}

export default Leads;
