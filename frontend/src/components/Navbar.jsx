import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaWallet } from "react-icons/fa";
import { useSidebar } from "../context/SidebarContext";
import { logoutUser } from "../services/authService";
import "../styles/navbar.css";

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { toggleSidebar } = useSidebar();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logoutUser();
    closeMenu();
  };

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/income", label: "Income" },
    { to: "/expenses", label: "Expenses" },
    { to: "/reports", label: "Reports" },
    { to: "/analytics", label: "Analytics" },
    { to: "/recordings", label: "Recordings" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand-wrap">
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar menu"
        >
          <FaBars />
        </button>

        <Link to="/dashboard" className="navbar-logo">
          <FaWallet className="navbar-logo-icon" />
          <span>Smart Expense Tracker</span>
        </Link>
      </div>

      <ul className={`navbar-menu ${menuOpen ? "open" : ""}`}>
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              onClick={closeMenu}
              className={location.pathname === link.to ? "active" : ""}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="navbar-right-actions">
        <Link to="/login" onClick={handleLogout} className="navbar-logout">
          <button type="button">LOGOUT</button>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle header menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
