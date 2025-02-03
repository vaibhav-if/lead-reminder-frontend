import { useState } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./config";

// Regex pattern for validating Indian mobile numbers (Refactor to common file)
const mobilePattern = /^[6-9]\d{9}$/;

function UserDetails() {
  const { user, setUser, logout } = useUser();
  const [name, setName] = useState(user.name || "");
  const [email] = useState(user.email || "");
  const [mobile] = useState(user.mobile || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const navigate = useNavigate();

  const handleSaveDetails = async () => {
    setIsSaving(true);
    const updatedUser = { ...user, name, mobile };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/${user?.id}`,
        updatedUser
      );
      setUser(response.data);
      navigate("/");
    } catch (error) {
      console.error("Error saving user details:");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeactivate = async () => {
    const confirmDeactivate = window.confirm(
      "This action is irreversible. You will not be able to login to your account again. Do you really want to deactivate?"
    );
    if (confirmDeactivate) {
      setIsDeactivating(true);
      try {
        await axios.patch(`${API_BASE_URL}/users/${user?.id}/deactivate`);
        console.log("deactivated");
        logout();
        navigate("/login");
      } catch (error) {
        console.error("Error deactivating user details:");
      } finally {
        setIsDeactivating(false);
      }
    }
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
                  // onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full cursor-not-allowed`}
                  readOnly
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
                  value={mobile}
                  className={`block w-full cursor-not-allowed`}
                  readOnly
                  maxLength={10}
                />
                {!mobilePattern.test(mobile) && mobile && (
                  <p className="text-sm text-primary mt-1">
                    Please enter a valid 10-digit mobile number.
                  </p>
                )}
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
            <div>
              <button
                onClick={handleDeactivate}
                className="flex items-center w-full text-white bg-red-500 hover:bg-red-700 justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
                &nbsp; {isDeactivating ? "Deactivating..." : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetails;
