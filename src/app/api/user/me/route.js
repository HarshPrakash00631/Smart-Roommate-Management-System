import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const userId = cookieStore.get("userId")?.value;

        if (!userId) {
            return Response.json({ error: "Not logged in" });
        }

        const user = await User.findById(userId);

        return Response.json({
            name: user.name,
        });
    } catch (error) {
        return Response.json({ error: "Error fetching user" });
    }
}