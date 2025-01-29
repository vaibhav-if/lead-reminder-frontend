import { useState, useEffect } from "react";

function Navbar() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    setIsDarkTheme(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (isDarkTheme) {
      localStorage.currentTheme = "dark";
    } else {
      localStorage.removeItem("currentTheme");
    }
  }, [isDarkTheme]);

  const toggleDarkMode = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="" href="/">
          Lead Reminders
        </h1>
        <div className="space-x-4">
          <button className="secondary-btn icon" onClick={toggleDarkMode}>
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
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
          </button>
          <a href="/" className="">
            About
          </a>
          <a href="/pricing" className="">
            Pricing
          </a>
          <a href="/user-details" className="">
            User Menu
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
