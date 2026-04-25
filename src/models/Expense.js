import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: String, // later we’ll link user properly
  },
  paidBy: {
    type: String,
  },
  splitAmount: {
    type: Number,
  },
}, { timestamps: true });

export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);