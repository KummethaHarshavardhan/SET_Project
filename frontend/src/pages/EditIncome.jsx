import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IncomeForm from "../components/IncomeForm";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { getIncomeById, updateIncome } from "../services/incomeService";
import { useToast } from "../context/ToastContext";
import "../styles/expense.css";

function EditIncome() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [existingIncome, setExistingIncome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getIncomeById(id)
      .then((data) => {
        if (mounted) setExistingIncome(data);
      })
      .catch((err) => {
        if (mounted) {
          const message = err?.message || "Could not load this income entry";
          setError(message);
          toast.error(message);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleUpdateIncome = async (updatedIncome) => {
    try {
      await updateIncome(id, updatedIncome);
      toast.success("Income updated successfully!");
      navigate("/income");
    } catch (err) {
      const message = err?.message || "Failed to update income";
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

          <div className="page-header">
            <h2>Edit Income</h2>
            <p>
              Update your income information and keep your records accurate.
            </p>
          </div>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {loading ? (
            <Loader />
          ) : (
            existingIncome && (
              <IncomeForm
                initialData={existingIncome}
                buttonText="Update Income"
                onSubmit={handleUpdateIncome}
              />
            )
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
}

export default EditIncome;
