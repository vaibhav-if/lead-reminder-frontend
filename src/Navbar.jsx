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
    <nav className="p-4 pt-0">
      <div className="flex justify-between items-center">
        <a href="/">
          <h1 className="no-underline">Lead Reminders</h1>
        </a>
        <div className="space-x-4">
          <button
            className="secondary-btn relative group"
            onClick={toggleDarkMode}
          >
            {isDarkTheme ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.0}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
            )}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Dark/Light Mode
            </div>
          </button>
          <a href="/about" className="">
            About
          </a>
          <a href="/pricing" className="">
            Pricing
          </a>
          <a href="/user-details" className="">
            User
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
