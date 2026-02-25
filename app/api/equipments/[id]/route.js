import { db } from "@/lib/database";
import { NextResponse } from "next/server";

// DELETE
export async function DELETE(request, context) {
  // 👈 context
  try {
    const params = await context.params; // 👈 await params
    const { id } = params;

    await db.equipments.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// PUT
export async function PUT(request, context) {
  // 👈 context
  try {
    const params = await context.params; // 👈 await params
    const { id } = params;

    const updates = await request.json();
    const updated = await db.equipments.update(id, updates);

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error); // Log error for debug
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
