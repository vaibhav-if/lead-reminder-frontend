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
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isInactiveUser, setIsInactiveUser] = useState(false);
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
    // if (!mobile) {
    //   setErrorMessage("Mobile number is mandatory.");
    //   return;
    // }
    if (!mobilePattern.test(mobile)) {
      setErrorMessage("Please enter a valid Indian mobile number.");
      return;
    }
    if (!email) {
      setErrorMessage("Email address is mandatory.");
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
        const response = await axios.post(`${SERVER_URL}/users/login`, {
          email,
          mobile,
          otp,
        });
        if (response.data) {
          if (response.data.message == "User is inactive") {
            setIsInactiveUser(true);
          } else {
            setUser(response.data);
            navigate("/");
          }
        } else {
          setErrorMessage("Something went wrong. Please register again.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying OTP: ");
        setErrorMessage("An error occurred while verifying OTP.");
      } finally {
        recaptchaRef.current.reset();
        setIsVerifyingOtp(false);
      }
    } else {
      setIsSendingOtp(true);
      try {
        const recaptchaToken = await recaptchaRef.current.getValue();
        await axios.post(`${SERVER_URL}/users/send-otp`, {
          email,
          mobile,
          recaptchaToken,
        });
        setIsOtpSent(true);
      } catch (error) {
        console.error("Error sending OTP:");
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
      {isInactiveUser && (
        <div
          role="alert"
          className="flex items-center p-4 mb-4 text-red-700 bg-red-100 rounded-lg justify-center sm:mx-auto sm:w-full sm:max-w-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          &nbsp;
          <span className="">
            Warning! User is inactive. Plese contact support at{" "}
            <a href="mailto:contact@vsagrawal.in">contact@vsagrawal.in</a>
          </span>
        </div>
      )}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-3 text-center">Register / Sign in</h2>
        </div>

        <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
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
                  className={`block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300  focus:outline-2 focus:-outline-offset-2 focus:outline-accent sm:`}
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
          <p className="mt-3 text-center">
            <small>
              {isOtpSent
                ? "OTP has been sent on Email"
                : "OTP will be sent on Email."}
            </small>
          </p>
          <p className="text-justify">
            <small>
              By signing in, you agree to these &nbsp;
              <a href="/terms" className="" target="_blank">
                <i>Terms and Conditions</i>
              </a>
              .
            </small>
          </p>
          <p className="text-justify">
            <small className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
              WhatsApp Integration will be live soon, stay tuned for further
              updates
            </small>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
