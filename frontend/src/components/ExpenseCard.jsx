import { Link } from "react-router-dom";

function ExpenseCard({ expense, onDelete }) {
  return (
    <div className="expense-card">

      <div className="expense-card-header">
        <h3>{expense.title}</h3>

        <span
          className={`expense-category ${expense.category
            ?.toLowerCase()
            .replace(/\s/g, "-")}`}
        >
          {expense.category}
        </span>
      </div>

      <div className="expense-card-body">

        <div className="expense-item">
          <span>💰 Amount</span>
          <strong>₹{Number(expense.amount).toLocaleString("en-IN")}</strong>
        </div>

        <div className="expense-item">
          <span>📅 Date</span>
          <strong>{expense.date}</strong>
        </div>

        <div className="expense-item">
          <span>📝 Description</span>
          <p>{expense.description || "No description available."}</p>
        </div>

      </div>

      <div className="expense-card-footer">

        <Link to={`/edit-expense/${expense.id}`}>
          <button className="edit-btn">
            ✏ Edit
          </button>
        </Link>

        <button
          className="delete-btn"
          onClick={() => onDelete(expense.id)}
        >
          🗑 Delete
        </button>

      </div>

    </div>
  );
}

export default ExpenseCard;