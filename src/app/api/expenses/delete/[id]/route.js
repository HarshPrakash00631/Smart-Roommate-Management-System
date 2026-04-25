import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";

export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ FIX

    await Expense.findByIdAndDelete(id);

    return Response.json({
      message: "Deleted successfully ✅",
    });
  } catch (error) {
    console.log(error);
    return Response.json({
      error: "Delete failed ❌",
    });
  }
}