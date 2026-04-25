import connectDB from "@/lib/mongodb";
import Roommate from "@/models/Roommate";

export async function GET() {
  try {
    await connectDB();

    const roommates = await Roommate.find();

    return Response.json({ roommates });
  } catch (error) {
    return Response.json({ error: error.message });
  }
}