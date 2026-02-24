import { db } from "@/lib/database";
import { NextResponse } from "next/server";

export async function DELETE(request, context) {
  // 👈 context را اضافه کنید
  try {
    // روش امن برای گرفتن params در تمام نسخه‌های Next.js
    const params = await context.params;
    const id = params.id;

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await db.destinations.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json(
      { error: "Failed to delete destination" },
      { status: 500 },
    );
  }
}
