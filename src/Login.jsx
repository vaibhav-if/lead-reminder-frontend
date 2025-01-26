import React, { useState, useRef } from "react";
import { useUser } from "./UserContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const dummyOTP = "123456"; // Dummy OTP for authentication

const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

function Login() {
  const { user, fetchUser } = useUser();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false); // Set to false to enable captcha verification and update site key
  const recaptchaRef = useRef();
  const navigate = useNavigate();

  // Regex pattern for validating Indian mobile numbers
  const mobilePattern = /^[6-9]\d{9}$/;

  const handleLogin = async () => {
    if (!mobile) {
      setErrorMessage("Mobile number is mandatory.");
      return;
    }
    if (!mobilePattern.test(mobile)) {
      setErrorMessage("Please enter a valid Indian mobile number.");
      return;
    }
    if (!captchaVerified) {
      setErrorMessage("Please verify that you are not a robot.");
      return;
    }
    if (isOtpSent) {
      try {
        await axios.post(`${SERVER_URL}/verify-otp`, {
          mobile,
          otp,
        });
        const fetchedUser = await fetchUser(mobile);
        if (fetchedUser) {
          Cookies.set("user", JSON.stringify({ ...fetchedUser }), {
            expires: 7,
          });
          navigate("/");
        } else {
          setErrorMessage("Something went wrong. Please register again.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        setErrorMessage(
          "An error occurred while verifying OTP. Please enter correct OTP."
        );
      }
    } else {
      const recaptchaToken = await recaptchaRef.current.getValue();
      recaptchaRef.current.reset();

      try {
        await axios.post(`${SERVER_URL}/send-otp`, {
          mobile,
          recaptchaToken,
        });
        setIsOtpSent(true);
      } catch (error) {
        console.error("Error sending OTP:", error);
        setErrorMessage("An error occurred while sending OTP.");
      }
    }
  };

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaVerified(true);
      setErrorMessage("");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter Mobile Number"
        value={mobile}
        onChange={(e) => {
          setMobile(e.target.value);
          setErrorMessage("");
        }}
        className={`input ${
          !mobilePattern.test(mobile) && mobile ? "input-error" : ""
        }`}
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
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.REACT_APP_SITE_KEY}
        onChange={handleCaptchaChange}
      />
      <button onClick={handleLogin}>
        {isOtpSent ? "Verify OTP & Login" : "Send OTP"}
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default Login;
