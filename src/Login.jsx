// Login.jsx
import { useState } from "react";
import { useUser } from "./UserContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const dummyOTP = "123456"; // Dummy OTP for authentication

function Login() {
  const { setUser, fetchUser } = useUser();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (isOtpSent) {
      if (otp === dummyOTP) {
        await fetchUser(mobile);
        Cookies.set("user", JSON.stringify({ mobile }), { expires: 7 });
        navigate("/");
      } else {
        setErrorMessage("Invalid OTP");
      }
    } else {
      // TODO: Send OTP logic here (dummy implementation)
      console.log("Sending OTP to:", mobile);
      setIsOtpSent(true);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      {isOtpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </>
      )}
      <button onClick={handleLogin}>
        {isOtpSent ? "Verify OTP" : "Send OTP"}
      </button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default Login;
