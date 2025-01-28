function Navbar() {
  return (
    <nav className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="" href="/">
          Lead Reminders
        </h1>
        <div className="space-x-4">
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
