function SummaryCard({ title, amount, className }) {
  return (
    <div className={`summary-card ${className}`}>
      <h4>{title}</h4>
      <h2>{amount}</h2>
    </div>
  );
}

export default SummaryCard;