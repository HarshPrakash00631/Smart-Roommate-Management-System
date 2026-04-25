import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import Roommate from "@/models/Roommate";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, amount, paidBy } = body;

    const roommates = await Roommate.find();
    const totalPeople = roommates.length + 1;

    if (!roommates || roommates.length === 0) {
      return Response.json({ error: "No roommates found" });
    }

    const splitAmount = Number(amount) / totalPeople;

    const newExpense = await Expense.create({
      title,
      amount: Number(amount),
      paidBy,
      splitAmount,
    });

    return Response.json({
      message: "Expense added successfully ✅",
      expense: newExpense,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Failed to add expense ❌" });
  }
}