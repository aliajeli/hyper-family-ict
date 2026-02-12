import { db } from '@/lib/database';
import { NextResponse } from 'next/server';

// GET single system
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const system = await db.systems.getById(id);

    if (!system) {
      return NextResponse.json(
        { error: 'System not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(system);
  } catch (error) {
    console.error('Error fetching system:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system' },
      { status: 500 }
    );
  }
}

// PUT update system
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const updatedSystem = await db.systems.update(id, data);
    return NextResponse.json(updatedSystem);
  } catch (error) {
    console.error('Error updating system:', error);
    
    if (error.message === 'System not found') {
      return NextResponse.json(
        { error: 'System not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update system' },
      { status: 500 }
    );
  }
}

// DELETE system
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await db.systems.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting system:', error);
    return NextResponse.json(
      { error: 'Failed to delete system' },
      { status: 500 }
    );
  }
}