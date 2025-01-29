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
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleSaveDetails = async () => {
    setIsSaving(true);
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
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-6 text-center">User Details</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block  font-medium ">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={25}
                  className={`block w-full`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block  font-medium ">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Your Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="mobile" className="block  font-medium ">
                Mobile Number
              </label>
              <div className="mt-2">
                <input
                  id="mobile"
                  name="mobile"
                  type="text"
                  placeholder="WhatsApp Mobile Number"
                  value={user.mobile}
                  readOnly
                  className={`block w-full cursor-not-allowed`}
                />
              </div>
            </div>

            <div>
              <button
                className="w-full justify-center mt-2"
                onClick={handleSaveDetails}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Details"}
              </button>
            </div>

            <div>
              <button
                className="secondary-btn flex w-full justify-center"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetails;
