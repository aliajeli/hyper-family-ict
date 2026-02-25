import { db } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.equipments.getAll();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const newItem = await db.equipments.create(data);
    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
