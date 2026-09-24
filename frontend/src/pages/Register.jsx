import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaChartPie,
  FaShieldAlt,
  FaBolt,
  FaWallet,
} from "react-icons/fa";
import { registerUser } from "../services/authService";
import { useToast } from "../context/ToastContext";
import AuthVideoBackground from "../components/AuthVideoBackground";
import "../styles/login.css";

function Register() {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (formData.password !== formData.confirmPassword) {
      const message = "Passwords do not match!";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);

      await registerUser(formData);

      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        (typeof err === "string" ? err : "") ||
        "Registration failed";
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
        {/* Left Showcase Panel */}
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
              Start managing your <span>money smarter.</span>
            </h1>

            <p>
              Create your free account and monitor your income, expenses,
              savings, and financial goals from one secure dashboard.
            </p>

            <ul className="showcase-features">
              <li>
                <span className="showcase-feature-icon">
                  <FaChartPie />
                </span>
                <div>
                  <strong>Expense Analytics</strong>
                  <span>Track every transaction with interactive insights.</span>
                </div>
              </li>

              <li>
                <span className="showcase-feature-icon">
                  <FaBolt />
                </span>
                <div>
                  <strong>Fast & Easy</strong>
                  <span>Add income and expenses in just a few clicks.</span>
                </div>
              </li>

              <li>
                <span className="showcase-feature-icon">
                  <FaShieldAlt />
                </span>
                <div>
                  <strong>Secure Data</strong>
                  <span>Your financial information stays safe and private.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-mobile-logo">
              <FaWallet /> Smart Expense Tracker
            </div>

            <h2>Create Account</h2>

            <p className="auth-subtitle">
              Create your account to start managing your expenses.
            </p>

            {error && <p className="error-text">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Full Name</label>

                <div className="input-box">
                  <FaUser className="input-icon" />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

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
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />

                  <span
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="input-group">
                <label>Confirm Password</label>

                <div className="input-box">
                  <FaLock className="input-icon" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />

                  <span
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <button className="btn" disabled={loading}>
                {loading ? (
                  <span className="btn-spinner-wrap">
                    <span className="btn-spinner" />
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="auth-link">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;