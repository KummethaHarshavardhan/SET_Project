import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "../components/ExpenseForm";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { createExpense } from "../services/expenseService";
import { useToast } from "../context/ToastContext";
import "../styles/expense.css";

function AddExpense() {
  const navigate = useNavigate();
  const toast = useToast();
  const [error, setError] = useState("");

  const handleAddExpense = async (expenseData) => {
    try {
      await createExpense(expenseData);
      toast.success("Expense added successfully!");
      navigate("/expenses");
    } catch (err) {
      const message = err?.message || "Failed to add expense";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">
        <Sidebar />

        <main className="dashboard-main">

          <div className="add-expense-header">
            <h2>Add New Expense</h2>
            <p>Fill in the details below to add a new expense.</p>
          </div>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <ExpenseForm
            buttonText="Add Expense"
            onSubmit={handleAddExpense}
          />

        </main>
      </div>

      <Footer />
    </div>
  );
}

export default AddExpense;