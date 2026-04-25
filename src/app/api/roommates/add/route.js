import connectDB from "@/lib/mongodb";
import Roommate from "@/models/Roommate";

export async function POST(req) {
  try {
    await connectDB();

    const { name } = await req.json();

    if (!name) {
      return Response.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const newRoommate = await Roommate.create({ name });

    return Response.json({
      message: "Roommate added successfully ✅",
      roommate: newRoommate,
    });

  } catch (error) {
    console.error("Roommate Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}