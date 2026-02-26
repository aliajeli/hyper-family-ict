import { db } from "@/lib/database";
import { NextResponse } from "next/server";

export async function PUT(request, context) {
  // 👈 context
  try {
    const params = await context.params; // 👈 await params first
    const { id } = params;

    const updates = await request.json();

    // حالا از id استفاده کنید
    const updated = await db.branches.update(id, updates);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  // 👈 DELETE هم همینطور
  try {
    const params = await context.params;
    const { id } = params;

    await db.branches.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
