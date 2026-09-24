import api from "./api";

const CATEGORY_COLORS = ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0", "#00bcd4", "#795548", "#607d8b"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const getCategoryBreakdown = async () => {
  const response = await api.get("/expenses/summary");
  return response.data.byCategory.map((c, i) => ({
    label: c._id,
    value: c.total,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));
};

export const getMonthlyReport = async (year = new Date().getFullYear()) => {
  const response = await api.get("/expenses/monthly-report", { params: { year } });
  return response.data.months.map((m) => ({
    month: MONTH_NAMES[m.month - 1],
    amount: m.total,
  }));
};
