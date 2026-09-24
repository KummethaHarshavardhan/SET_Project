import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";


import ExpenseList from "./pages/ExpenseList";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";

import Income from "./pages/Income";
import IncomeList from "./pages/IncomeList";
import EditIncome from "./pages/EditIncome";

import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Recordings from "./pages/Recordings";

function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Expense Management */}
      <Route path="/expenses" element={<ExpenseList />} />
      <Route path="/add-expense" element={<AddExpense />} />
      <Route path="/edit-expense/:id" element={<EditExpense />} />

      {/* Income Management */}
      <Route path="/income" element={<IncomeList />} />
      <Route path="/add-income" element={<Income />} />
      <Route path="/edit-income/:id" element={<EditIncome />} />

      {/* Reports */}
      <Route path="/reports" element={<Reports />} />

      {/* Analytics */}
      <Route path="/analytics" element={<Analytics />} />

      {/* Recordings */}
      <Route path="/recordings" element={<Recordings />} />

      {/* Profile */}
      <Route path="/profile" element={<Profile />} />

      {/* Redirect Unknown Routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;