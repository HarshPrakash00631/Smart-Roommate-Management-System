import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Roommate from "@/models/Roommate";

export async function DELETE(req, context) {
  try {
    await dbConnect();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const deleted = await Roommate.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}