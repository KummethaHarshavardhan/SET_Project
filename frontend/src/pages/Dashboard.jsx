import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import SummaryCard from "../components/SummaryCard";
import { getDashboardSummary } from "../services/expenseService";
import "../styles/dashboard.css";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    thisMonth: 0,
    recentExpenses: [],
    recentIncomes: [],
  });

  useEffect(() => {
    let mounted = true;

    getDashboardSummary()
      .then((data) => {
        if (mounted) setSummary(data);
      })
      .catch((err) => console.error("Failed to load dashboard summary:", err));

    return () => (mounted = false);
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">
        <Sidebar />

        <main className="dashboard-main">

          <div className="dashboard-header">
            <div>
              <h2>Dashboard</h2>
              <p>Welcome to Smart Expense Tracker 👋</p>
            </div>

            <div className="dashboard-actions">
              <Link to="/add-expense">
                <button>Add Expense</button>
              </Link>

              <Link to="/expenses">
                <button>View Expenses</button>
              </Link>

              <Link to="/add-income">
                <button>Add Income</button>
              </Link>

              <Link to="/income">
                <button>View Income</button>
              </Link>
            </div>
          </div>

          <div className="summary-section">
            <SummaryCard
              title="Total Income"
              amount={`₹${summary.totalIncome}`}
              className="income-card"
            />

            <SummaryCard
              title="Total Expense"
              amount={`₹${summary.totalExpense}`}
              className="expense-card"
            />

            <SummaryCard
              title="Balance"
              amount={`₹${summary.balance}`}
              className="balance-card"
            />

            <SummaryCard
              title="This Month"
              amount={`₹${summary.thisMonth}`}
              className="month-card"
            />
          </div>

          <div className="recent-expenses">
            <h3>Recent Expenses</h3>
            <div className="table-responsive">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recentExpenses.length === 0 ? (
                    <tr>
                      <td colSpan="4">No expenses available.</td>
                    </tr>
                  ) : (
                    summary.recentExpenses.map((expense) => (
                      <tr key={expense.id}>
                        <td>{expense.title}</td>
                        <td>{expense.category}</td>
                        <td>₹{expense.amount}</td>
                        <td>{expense.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="recent-expenses">
            <h3>Recent Income</h3>
            <div className="table-responsive">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recentIncomes.length === 0 ? (
                    <tr>
                      <td colSpan="4">No income entries available.</td>
                    </tr>
                  ) : (
                    summary.recentIncomes.map((income) => (
                      <tr key={income.id}>
                        <td>{income.title}</td>
                        <td>{income.category}</td>
                        <td>₹{income.amount}</td>
                        <td>{income.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;