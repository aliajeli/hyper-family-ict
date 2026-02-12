import { db } from '@/lib/database';
import { NextResponse } from 'next/server';

// PUT update branch
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const updatedBranch = await db.branches.update(id, data);
    return NextResponse.json(updatedBranch);
  } catch (error) {
    console.error('Error updating branch:', error);
    return NextResponse.json(
      { error: 'Failed to update branch' },
      { status: 500 }
    );
  }
}

// DELETE branch
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await db.branches.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json(
      { error: 'Failed to delete branch' },
      { status: 500 }
    );
  }
}