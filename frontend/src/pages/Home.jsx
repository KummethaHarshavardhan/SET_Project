import { Link } from "react-router-dom";
import { FaWallet, FaChartPie, FaShieldAlt } from "react-icons/fa";

function Home() {
  return (
    <div className="home-container">
      <h1>💰 Smart Expense Tracker</h1>

      <p>
        Take control of your finances with an easy-to-use expense management
        system. Track daily expenses, analyze spending patterns, and make
        smarter financial decisions with insightful reports and analytics.
      </p>

      <div className="home-buttons">
        <Link to="/login">
          <button>Login</button>
        </Link>

        <Link to="/register">
          <button>Get Started</button>
        </Link>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <FaWallet className="feature-icon" />
          <h3>Expense Tracking</h3>
          <p>
            Record and organize your daily income and expenses with ease.
          </p>
        </div>

        <div className="feature-card">
          <FaChartPie className="feature-icon" />
          <h3>Reports & Analytics</h3>
          <p>
            Visualize your spending trends using reports and analytics.
          </p>
        </div>

        <div className="feature-card">
          <FaShieldAlt className="feature-icon" />
          <h3>Secure Access</h3>
          <p>
            Login securely and manage your personal financial information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;