import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";

export async function GET() {
  try {
    await connectDB();

    const expenses = await Expense.find().sort({ createdAt: -1 });

    return Response.json({ expenses });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}