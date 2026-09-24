import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import PieChart from "../components/PieChart";
import Loader from "../components/Loader";
import { getCategoryBreakdown, getMonthlyReport } from "../services/reportService";
import { connectSocket } from "../services/socket";
import "../styles/report.css";

function Reports() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();

    const socket = connectSocket();
    const handler = (msg) => {
      if (msg && (msg.resource === 'expense' || msg.resource === 'income')) {
        loadReports();
      }
    };
    socket.on('dataUpdated', handler);

    return () => {
      socket.off('dataUpdated', handler);
    };
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);

      const categories = await getCategoryBreakdown();
      const monthly = await getMonthlyReport();

      setCategoryData(categories || []);
      setMonthlyData(monthly || []);
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalExpense = monthlyData.reduce(
    (sum, item) => sum + (item.amount || item.total || 0),
    0
  );

  const highestExpense =
    monthlyData.length > 0
      ? Math.max(...monthlyData.map((item) => item.amount || item.total || 0))
      : 0;

  const topCategory = categoryData.length > 0
    ? [...categoryData].sort((a, b) => (b.value || b.total || 0) - (a.value || a.total || 0))[0]
    : null;

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">
        <Sidebar />

        <main className="dashboard-main">
          <div className="report-header">
            <div>
              <h2>Expense Reports</h2>
              <p>Track spending patterns with summaries and charts.</p>
            </div>

            <button onClick={loadReports}>Refresh Data</button>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="report-summary">
                <div className="report-card">
                  <h4>Total Expense</h4>
                  <h2>₹{totalExpense.toLocaleString()}</h2>
                </div>

                <div className="report-card">
                  <h4>Total Categories</h4>
                  <h2>{categoryData.length}</h2>
                </div>

                <div className="report-card">
                  <h4>Top Category</h4>
                  <h2>{topCategory ? topCategory.name || topCategory.label : "—"}</h2>
                </div>

                <div className="report-card">
                  <h4>Highest Monthly Expense</h4>
                  <h2>₹{highestExpense.toLocaleString()}</h2>
                </div>
              </div>

              <div className="analytics-grid">
                <div className="chart-card">
                  <h3>Category-wise Spending</h3>
                  <PieChart data={categoryData} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Reports;