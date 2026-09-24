import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";


function BarChart({ data = [] }) {
  const formattedData = (data || []).map((item) => ({
    month: item.month || item._id || item.name || "Month",
    amount: Number(item.total || item.amount || item.value || 0),
  }));

  return (
    <div className="bar-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
          <Bar dataKey="amount" fill="#2563eb" radius={[8, 8, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}


export default BarChart;