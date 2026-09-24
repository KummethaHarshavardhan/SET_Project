import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IncomeForm from "../components/IncomeForm";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { createIncome } from "../services/incomeService";
import { useToast } from "../context/ToastContext";
import "../styles/expense.css";

function Income() {
  const navigate = useNavigate();
  const toast = useToast();
  const [error, setError] = useState("");

  const handleAddIncome = async (incomeData) => {
    try {
      await createIncome(incomeData);
      toast.success("Income added successfully!");
      navigate("/income");
    } catch (err) {
      const message = err?.message || "Failed to add income";
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
            <h2>Add New Income</h2>
            <p>Fill in the details below to add a new income.</p>
          </div>

          {error && <div className="error-box">{error}</div>}

          <IncomeForm buttonText="Add Income" onSubmit={handleAddIncome} />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Income;
