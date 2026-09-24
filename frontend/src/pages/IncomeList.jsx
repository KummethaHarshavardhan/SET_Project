import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IncomeTable from "../components/IncomeTable";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import ConfirmDialog from "../components/ConfirmDialog";
import { getIncomes, deleteIncome } from "../services/incomeService";
import { useToast } from "../context/ToastContext";
import "../styles/expense.css";

function IncomeList() {
  const toast = useToast();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const loadIncomes = () => {
    setLoading(true);

    getIncomes({
      search: search || undefined,
      category: category || undefined,
    })
      .then((data) => setIncomes(data))
      .catch((err) => toast.error(err?.message || "Failed to load income"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(loadIncomes, 300);
    return () => clearTimeout(timeout);
  }, [search, category]);

  const handleDelete = (id) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    const id = pendingDeleteId;
    setPendingDeleteId(null);

    try {
      await deleteIncome(id);

      setIncomes((prev) => prev.filter((income) => income._id !== id));
      toast.success("Income entry deleted successfully.");
    } catch (err) {
      toast.error(err?.message || "Failed to delete income");
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">
        <Sidebar />

        <main className="dashboard-main">

          <div className="expense-page-header">
            <div>
              <h2>Income Management</h2>
              <p>Manage, search and organize your income sources.</p>
            </div>

            <Link to="/add-income">
              <button>Add Income</button>
            </Link>
          </div>

          <div className="expense-filters">
            <input
              type="text"
              placeholder="🔍 Search income..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Business">Business</option>
              <option value="Investment">Investment</option>
              <option value="Gift">Gift</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {loading ? (
            <Loader />
          ) : incomes.length === 0 ? (
            <div className="empty-expense">
              <h3>No income entries found</h3>
              <p>Try changing your search or add a new income.</p>
            </div>
          ) : (
            <IncomeTable
              incomes={incomes}
              onDelete={handleDelete}
            />
          )}

        </main>
      </div>

      <Footer />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete this income entry?"
        message="This will permanently remove the income record. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}

export default IncomeList;