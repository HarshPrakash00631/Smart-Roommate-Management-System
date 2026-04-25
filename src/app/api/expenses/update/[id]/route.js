import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import Roommate from "@/models/Roommate";

export async function PUT(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    const { title, amount, paidBy } = await req.json();

    const roommates = await Roommate.find();
    const splitAmount = Number(amount) / roommates.length;

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        title,
        amount: Number(amount),
        paidBy,
        splitAmount,
      },
      { new: true }
    );

    return Response.json({
      message: "Updated successfully ✅",
      expense: updatedExpense,
    });
  } catch (error) {
    return Response.json({ error: "Update failed ❌" });
  }
}