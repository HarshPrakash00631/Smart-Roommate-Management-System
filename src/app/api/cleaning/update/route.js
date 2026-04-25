import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Cleaning from "@/models/Cleaning";

export async function POST(req) {
  await dbConnect();

  const { name } = await req.json();

  const today = new Date().toISOString().split("T")[0]; // ✅ YYYY-MM-DD

  await Cleaning.findOneAndUpdate(
    {},
    {
      lastCleanedBy: name,
      lastCleanedDate: today, // ✅ NEW
    },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}