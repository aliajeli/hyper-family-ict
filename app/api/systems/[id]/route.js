import { db } from "@/lib/database";
import { NextResponse } from "next/server";

export async function PUT(request, context) {
  try {
    // 👇 این خط حیاتی است
    const params = await context.params;
    const { id } = params;

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const updates = await request.json();
    console.log(`🔄 Updating System ID: ${id}`);

    const updated = await db.systems.update(id, updates);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
