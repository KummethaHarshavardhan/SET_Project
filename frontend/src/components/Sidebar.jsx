import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaMoneyBillWave,
  FaWallet,
  FaChartPie,
  FaChartLine,
  FaUserCircle,
  FaMicrophone,
  FaTimes,
} from "react-icons/fa";
import { useSidebar } from "../context/SidebarContext";

function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();

  const handleLinkClick = () => {
    closeSidebar();
  };

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header-row">
          <h3>Navigation</h3>
          <button
            className="sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li>
            <NavLink
              to="/dashboard"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/add-expense"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaPlusCircle />
              <span>Add Expense</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/add-income"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaMoneyBillWave />
              <span>Add Income</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/expenses"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaWallet />
              <span>Expenses</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/income"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaMoneyBillWave />
              <span>Income</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/reports"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaChartPie />
              <span>Reports</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/analytics"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaChartLine />
              <span>Analytics</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/recordings"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaMicrophone />
              <span>Recordings</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/profile"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUserCircle />
              <span>Profile</span>
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
}

export default Sidebar;