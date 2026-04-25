import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Cleaning from "@/models/Cleaning";

export async function GET() {
  await dbConnect();

  const data = await Cleaning.findOne({});

  return NextResponse.json({
    lastCleanedBy: data?.lastCleanedBy || "",
    lastCleanedDate: data?.lastCleanedDate || "",
  });
}