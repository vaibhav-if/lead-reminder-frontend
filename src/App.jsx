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
    setLeads(leads.filter((lead) => lead.id !== id));
  };

  return (
    <div className="min-h-screen bg-light-gray p-4">
      <h1 className="text-dark-blue text-3xl mb-4">Leads Reminders</h1>

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
          {leads.map((lead, index) => (
            <tr key={lead.id}>
              <td className="border px-4 py-2">{lead.name}</td>
              <td className="border px-4 py-2">{lead.mobile}</td>
              <td className="border px-4 py-2">{lead.email}</td>
              <td className="border px-4 py-2">{lead.meeting_date}</td>
              <td className="border px-4 py-2">{lead.meeting_notes}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEditLead(index)}
                  className="bg-cyan text-white p-1 rounded mr-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteLead(lead.id)}
                  className="bg-pink-red text-white p-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
