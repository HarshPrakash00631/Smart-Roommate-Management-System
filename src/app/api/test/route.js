import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return Response.json({ message: "Database connected successfully ✅" });
  } catch (error) {
    console.error(error); // 👈 important
    return Response.json({ error: error.message });
  }
}