import Leads from "./Leads";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-light-gray flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav className="bg-dark-blue text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Lead Reminders</h1>
          <div className="space-x-4">
            <a href="#about" className="hover:text-cyan">
              About
            </a>
            <a href="#pricing" className="hover:text-cyan">
              Pricing
            </a>
            <a href="#user-menu" className="hover:text-cyan">
              User Menu
            </a>
          </div>
        </div>
      </nav>

      <main id="main-content" className="flex-grow p-4">
        <Leads />
      </main>

      <footer className="bg-dark-blue text-white text-center p=4">
        &copy; {new Date().getFullYear()} Lead Reminders. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
