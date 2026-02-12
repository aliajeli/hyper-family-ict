import { db } from '@/lib/database';
import { NextResponse } from 'next/server';

// GET single destination
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const destination = await db.destinations.getById(id);

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destination' },
      { status: 500 }
    );
  }
}

// PUT update destination
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const updatedDestination = await db.destinations.update(id, data);
    return NextResponse.json(updatedDestination);
  } catch (error) {
    console.error('Error updating destination:', error);
    
    if (error.message === 'Destination not found') {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update destination' },
      { status: 500 }
    );
  }
}

// DELETE destination
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await db.destinations.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting destination:', error);
    return NextResponse.json(
      { error: 'Failed to delete destination' },
      { status: 500 }
    );
  }
}