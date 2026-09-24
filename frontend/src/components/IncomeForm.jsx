import { useState } from "react";
import { useToast } from "../context/ToastContext";

function IncomeForm({
  initialData = {
    title: "",
    amount: "",
    category: "",
    date: "",
    description: "",
  },
  onSubmit,
  buttonText = "Save Income",
}) {
  const toast = useToast();
  const [income, setIncome] = useState(initialData);

  const handleChange = (e) => {
    setIncome({
      ...income,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !income.title ||
      !income.amount ||
      !income.category ||
      !income.date
    ) {
      toast.warning("Please fill all required fields.");
      return;
    }

    onSubmit(income);
  };

  return (
    <div className="expense-form-container">
      <form className="expense-form" onSubmit={handleSubmit}>

        <h2>{buttonText}</h2>
        <p className="form-subtitle">
          Fill in the income details below.
        </p>

        <div className="form-group">
          <label>Income Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Monthly Salary"
            value={income.title}
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
              value={income.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={income.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Business">Business</option>
              <option value="Investment">Investment</option>
              <option value="Gift">Gift</option>
              <option value="Others">Others</option>
            </select>
          </div>

        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={income.date}
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
            value={income.description}
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

export default IncomeForm;
