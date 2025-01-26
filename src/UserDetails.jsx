import { useState } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

function UserDetails() {
  const { user, setUser, logout } = useUser();
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const navigate = useNavigate();

  const handleSaveDetails = async () => {
    const updatedUser = { ...user, name, email };

    try {
      const response = await axios.put(
        `${SERVER_URL}/users/${user?.id}`,
        updatedUser
      );
      setUser(response.data);
      // TODO Change cookies logic to send tokens
      Cookies.set("user", JSON.stringify(response.data), { expires: 7 });
      alert("Details saved!");
      navigate("/");
    } catch (error) {
      console.error("Error saving user details:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}

export default UserDetails;
