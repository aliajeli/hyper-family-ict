import { db } from '@/lib/database';
import { NextResponse } from 'next/server';

// GET all systems
export async function GET() {
  try {
    const systems = await db.systems.getAll();
    return NextResponse.json(systems);
  } catch (error) {
    console.error('Error fetching systems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch systems' },
      { status: 500 }
    );
  }
}

// POST create new system
export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    const { branch, type, name, ip } = data;
    if (!branch || !type || !name || !ip) {
      return NextResponse.json(
        { error: 'Branch, type, name, and IP are required' },
        { status: 400 }
      );
    }

    const newSystem = await db.systems.create(data);
    return NextResponse.json(newSystem, { status: 201 });
  } catch (error) {
    console.error('Error creating system:', error);
    return NextResponse.json(
      { error: 'Failed to create system' },
      { status: 500 }
    );
  }
}