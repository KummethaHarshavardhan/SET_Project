import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaChartPie,
  FaShieldAlt,
  FaBolt,
  FaWallet,
} from "react-icons/fa";
import { loginUser } from "../services/authService";
import { useToast } from "../context/ToastContext";
import AuthVideoBackground from "../components/AuthVideoBackground";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await loginUser(formData);
      toast.success("Welcome back! Logged in successfully.");
      navigate("/dashboard");
    } catch (err) {
      const message = err?.message || "Invalid email or password";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthVideoBackground />

      <div className="auth-shell">
        {/* Brand / Showcase panel */}
        <div className="auth-showcase">
          <div className="showcase-blob showcase-blob-1" />
          <div className="showcase-blob showcase-blob-2" />

          <div className="showcase-content">
            <div className="showcase-logo">
              <span className="showcase-logo-icon">
                <FaWallet />
              </span>
              Smart Expense Tracker
            </div>

            <h1>
              Take control of <span>every rupee</span> you spend.
            </h1>

            <p>
              Track expenses, monitor income and uncover spending insights —
              all in one place, built to keep your money organized.
            </p>

            <ul className="showcase-features">
              <li>
                <span className="showcase-feature-icon">
                  <FaChartPie />
                </span>
                <div>
                  <strong>Smart Insights</strong>
                  <span>Visual reports that reveal where your money goes</span>
                </div>
              </li>

              <li>
                <span className="showcase-feature-icon">
                  <FaBolt />
                </span>
                <div>
                  <strong>Real-time Sync</strong>
                  <span>Your data updates instantly, on every device</span>
                </div>
              </li>

              <li>
                <span className="showcase-feature-icon">
                  <FaShieldAlt />
                </span>
                <div>
                  <strong>Private &amp; Secure</strong>
                  <span>Your financial data stays yours, always</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Form panel */}
        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-mobile-logo">
              <FaWallet /> Smart Expense Tracker
            </div>

            <h2>Welcome back</h2>
            <p className="auth-subtitle">
              Login to continue managing your expenses.
            </p>

            {error && <p className="error-text">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email Address</label>

                <div className="input-box">
                  <FaEnvelope className="input-icon" />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>

                <div className="input-box">
                  <FaLock className="input-icon" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />

                  <span
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className="checkbox-group">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
              </div>

              <button className="btn" disabled={loading}>
                {loading ? (
                  <span className="btn-spinner-wrap">
                    <span className="btn-spinner" />
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="auth-link">
              Don't have an account? <Link to="/register">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
