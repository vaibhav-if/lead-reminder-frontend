import React, { useState, useRef } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

axios.defaults.withCredentials = true;

const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

function Login() {
  const { setUser } = useUser();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false); // Set to false to enable captcha verification and update site key
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
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
      setIsVerifyingOtp(true);
      try {
        if (!otp) {
          setErrorMessage("Please enter the verification code.");
          return;
        }
        const response = await axios.post(`${SERVER_URL}/login`, {
          mobile,
          otp,
        });
        console.log(response);
        if (response.data) {
          setUser(response.data);
          navigate("/");
        } else {
          setErrorMessage("Something went wrong. Please register again.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying OTP: ", error);
        setErrorMessage("An error occurred while verifying OTP.");
      } finally {
        recaptchaRef.current.reset();
        setIsVerifyingOtp(false);
      }
    } else {
      setIsSendingOtp(true);
      try {
        const recaptchaToken = await recaptchaRef.current.getValue();
        await axios.post(`${SERVER_URL}/send-otp`, {
          mobile,
          recaptchaToken,
        });
        setIsOtpSent(true);
      } catch (error) {
        console.error("Error sending OTP:", error);
        setErrorMessage("An error occurred while sending OTP.");
      } finally {
        setIsSendingOtp(false);
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
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center">Sign in or Create an Account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="mobile" className="block  font-medium ">
                Mobile Number
              </label>
              <div className="mt-2">
                <input
                  id="mobile"
                  name="mobile"
                  type="text"
                  placeholder="Enter WhatsApp Mobile Number"
                  value={mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setMobile(value);
                      setErrorMessage("");
                    }
                  }}
                  pattern="\d{10}"
                  maxLength={10}
                  className={`block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300  focus:outline-2 focus:-outline-offset-2 focus:outline-accent sm:`}
                />
                {!mobilePattern.test(mobile) && mobile && (
                  <p className="text-sm text-primary mt-1">
                    Please enter a valid 10-digit mobile number.
                  </p>
                )}
              </div>
            </div>

            {isOtpSent && (
              <div>
                <label htmlFor="otp" className="block  font-medium ">
                  Enter OTP
                </label>
                <div className="mt-2">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="Enter Verification Code"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6) {
                        setOtp(e.target.value);
                        setErrorMessage("");
                      }
                    }}
                    pattern="\d{6}"
                    maxLength={6}
                    className={`block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300  focus:outline-2 focus:-outline-offset-2 focus:outline-accent sm:`}
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.REACT_APP_SITE_KEY}
                  onChange={handleCaptchaChange}
                />
              </div>
            </div>

            <div>
              <button
                className="flex w-full justify-center rounded-md px-3 py-1.5  font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                onClick={handleLogin}
                disabled={isSendingOtp || isVerifyingOtp}
              >
                {isOtpSent
                  ? isVerifyingOtp
                    ? "Verifying..."
                    : "Verify OTP & Login"
                  : isSendingOtp
                  ? "Sending..."
                  : "Send OTP"}
              </button>
            </div>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <p className="mt-5 text-center">
            {isOtpSent
              ? "OTP has been sent on Whatsapp"
              : "OTP will be sent on WhatsApp."}
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
