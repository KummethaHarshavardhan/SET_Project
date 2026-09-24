import { Link } from "react-router-dom";

function IncomeCard({ income, onDelete }) {
  return (
    <div className="expense-card">

      <div className="expense-card-header">
        <h3>{income.title}</h3>

        <span
          className={`expense-category ${income.category
            ?.toLowerCase()
            .replace(/\s/g, "-")}`}
        >
          {income.category}
        </span>
      </div>

      <div className="expense-card-body">

        <div className="expense-item">
          <span>💰 Amount</span>
          <strong>₹{Number(income.amount).toLocaleString("en-IN")}</strong>
        </div>

        <div className="expense-item">
          <span>📅 Date</span>
          <strong>{income.date}</strong>
        </div>

        <div className="expense-item">
          <span>📝 Description</span>
          <p>{income.description || "No description available."}</p>
        </div>

      </div>

      <div className="expense-card-footer">

        <Link to={`/edit-income/${income.id}`}>
          <button className="edit-btn">
            ✏ Edit
          </button>
        </Link>

        <button
          className="delete-btn"
          onClick={() => onDelete(income.id)}
        >
          🗑 Delete
        </button>

      </div>

    </div>
  );
}

export default IncomeCard;
