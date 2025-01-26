function Navbar() {
  return (
    <nav className="bg-dark-blue text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" href="/">
          Lead Reminders
        </h1>
        <div className="space-x-4">
          <a href="/" className="hover:text-cyan">
            About
          </a>
          <a href="/pricing" className="hover:text-cyan">
            Pricing
          </a>
          <a href="/user-details" className="hover:text-cyan">
            User Menu
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
