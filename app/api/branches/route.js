import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET all branches
export async function GET() {
  try {
    const branches = await db.branches.getAll();
    return NextResponse.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}

// POST create new branch
export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    const { name, district } = data;
    if (!name || !district) {
      return NextResponse.json(
        { error: 'Name and district are required' },
        { status: 400 }
      );
    }

    const newBranch = await db.branches.create(data);
    return NextResponse.json(newBranch, { status: 201 });
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json(
      { error: 'Failed to create branch' },
      { status: 500 }
    );
  }
}