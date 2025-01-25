// UserDetails.jsx
import { useState } from "react";
import { useUser } from "./UserContext";
import axios from "axios";

function UserDetails() {
  const { user, setUser } = useUser();
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");

  const handleSaveDetails = async () => {
    const updatedUser = { ...user, name, email };

    try {
      await axios.post("http://localhost:3000/users", updatedUser); // Save new user to backend
      setUser(updatedUser);
      alert("Details saved!");
    } catch (error) {
      console.error("Error saving user details:", error);
    }
  };

  return (
    <div className="user-details-container">
      <h2>User Details</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Mobile Number"
        value={user.mobile}
        readOnly
      />
      <input
        type="email"
        placeholder="Email ID"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSaveDetails}>Save Details</button>
    </div>
  );
}

export default UserDetails;
