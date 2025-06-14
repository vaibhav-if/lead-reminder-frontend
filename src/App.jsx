import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./UserContext";
import Login from "./Login";
import UserDetails from "./UserDetails";
import Leads from "./Leads";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PrivateRoute from "./PrivateRoute";
import Terms from "./Terms";
import "./App.css";

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="flex-grow p-4">
            <Routes>
              <Route path="/" element={<PrivateRoute component={Leads} />} />
              <Route
                path="/user-details"
                element={<PrivateRoute component={UserDetails} />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
