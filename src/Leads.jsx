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
      <div className="w-full items-center">
        <h2 className="mb-2">Add Leads Form</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newLead.name}
            onChange={handleChange}
            className=""
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={newLead.mobile}
            onChange={handleChange}
            className=""
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newLead.email}
            onChange={handleChange}
            className=""
          />
          <input
            type="date"
            name="meeting_date"
            value={newLead.meeting_date}
            onChange={handleChange}
            className=""
          />
          <textarea
            type="text"
            name="meeting_notes"
            placeholder="Meeting Notes (max 50 characters)"
            value={newLead.meeting_notes}
            onChange={handleChange}
            maxLength={50}
            className=""
            rows={1}
          />
          <button onClick={handleAddLead} className="">
            {editIndex !== null ? "Update Lead" : "Add Lead"}
          </button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      {/* Table Section: Search and Filter Section */}
      <div className="w-full flex justify-between items-center mb-2 mt-20">
        <div>
          <h2 className="">Leads Records</h2>
        </div>
        <div className="ml-3">
          <div className="w-full max-w-sm min-w-[200px] relative">
            <div className="relative flex gap-2">
              <input
                type="text"
                placeholder="Search by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=""
              />
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className=""
              >
                <option value="all">All Leads</option>
                <option value="active">Active Leads</option>
                <option value="inactive">Inactive Leads</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col w-full h-full overflow-scroll shadow-md rounded-lg bg-clip-border">
        <table className="w-full text-left table-auto min-w-max table-fixed">
          <thead>
            <tr>
              <th className="w-1/6 p-4 border-b">
                <p className="block leading-none">Name</p>
              </th>
              <th className="w-1/6 p-4 border-b">
                <p className="block leading-none">Mobile</p>
              </th>
              <th className="w-1/3 p-4 border-b">
                <p className="block leading-none">Email</p>
              </th>
              <th className="w-1/6 p-4 border-b">
                <p className="block leading-none">Meeting Date</p>
              </th>
              <th className="w-1/3 p-4 border-b">
                <p className="block leading-none">Meeting Notes</p>
              </th>
              <th className="w-1/6 p-4 border-b text-center">
                <p className="block leading-none">Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead, index) => (
              <tr key={lead.id}>
                {editIndex === index ? (
                  <>
                    <td className="p-4 border-b border-slate-200">
                      <input
                        type="text"
                        value={newLead.name}
                        onChange={(e) =>
                          setNewLead({ ...newLead, name: e.target.value })
                        }
                        className=""
                      />
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      <input
                        type="text"
                        value={newLead.mobile}
                        onChange={(e) =>
                          setNewLead({ ...newLead, mobile: e.target.value })
                        }
                        className=""
                      />
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      <input
                        type="email"
                        value={newLead.email}
                        onChange={(e) =>
                          setNewLead({ ...newLead, email: e.target.value })
                        }
                        className=""
                      />
                    </td>
                    <td className="p-4 border-b border-slate-200">
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
                    <td className="p-4 border-b border-slate-200">
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
                    <td className={`p-4 border-b border-slate-200 text-center`}>
                      <button
                        onClick={() => {
                          handleAddLead();
                        }}
                        className=""
                      >
                        Save
                      </button>
                      <button onClick={handleCancel} className="">
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td
                      className={`p-4 border-b border-slate-200 ${
                        lead.is_active ? "" : "line-through"
                      }`}
                    >
                      <p className="">{lead.name}</p>
                    </td>
                    <td
                      className={`p-4 border-b border-slate-200 ${
                        lead.is_active ? "" : "line-through"
                      }`}
                    >
                      <p className="">{lead.mobile}</p>
                    </td>
                    <td
                      className={`p-4 border-b border-slate-200 ${
                        lead.is_active ? "" : "line-through"
                      }`}
                    >
                      <p className="whitespace-normal break-all">
                        {lead.email}
                      </p>
                    </td>
                    <td
                      className={`p-4 border-b border-slate-200 ${
                        lead.is_active ? "" : "line-through"
                      }`}
                    >
                      <p className="">{lead.meeting_date}</p>
                    </td>
                    <td
                      className={`p-4 border-b border-slate-200 ${
                        lead.is_active ? "" : "line-through"
                      }`}
                    >
                      <p className="whitespace-normal break-all">
                        {lead.meeting_notes}
                      </p>
                    </td>
                    <td className={`p-4 border-b border-slate-200 text-center`}>
                      {lead.is_active ? (
                        <>
                          <button
                            onClick={() => handleEditLead(index)}
                            className="relative group"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                              />
                            </svg>
                            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Edit Lead
                            </div>
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="secondary-btn relative group"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Deactivate
                            </div>
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
