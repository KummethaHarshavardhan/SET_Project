import { useState } from "react";
import { useToast } from "../context/ToastContext";

function ExpenseForm({
  initialData = {
    title: "",
    amount: "",
    category: "",
    date: "",
    description: "",
  },
  onSubmit,
  buttonText = "Save Expense",
}) {
  const toast = useToast();
  const [expense, setExpense] = useState(initialData);

  const handleChange = (e) => {
    setExpense({
      ...expense,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !expense.title ||
      !expense.amount ||
      !expense.category ||
      !expense.date
    ) {
      toast.warning("Please fill all required fields.");
      return;
    }

    onSubmit(expense);
  };

  return (
    <div className="expense-form-container">
      <form className="expense-form" onSubmit={handleSubmit}>

        <h2>{buttonText}</h2>
        <p className="form-subtitle">
          Fill in the expense details below.
        </p>

        <div className="form-group">
          <label>Expense Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Grocery Shopping"
            value={expense.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="₹ Enter amount"
              value={expense.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={expense.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Others">Others</option>
            </select>
          </div>

        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={expense.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            rows="5"
            placeholder="Write a short description..."
            value={expense.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="expense-submit-btn">
          {buttonText}
        </button>

      </form>
    </div>
  );
}

export default ExpenseForm;