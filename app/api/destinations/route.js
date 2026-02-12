import { db } from '@/lib/database';
import { NextResponse } from 'next/server';

// GET all destinations
export async function GET() {
  try {
    const destinations = await db.destinations.getAll();
    return NextResponse.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}

// POST create new destination
export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    const { district, branch, name, ip } = data;
    if (!district || !branch || !name || !ip) {
      return NextResponse.json(
        { error: 'District, branch, name, and IP are required' },
        { status: 400 }
      );
    }

    const newDestination = await db.destinations.create(data);
    return NextResponse.json(newDestination, { status: 201 });
  } catch (error) {
    console.error('Error creating destination:', error);
    return NextResponse.json(
      { error: 'Failed to create destination' },
      { status: 500 }
    );
  }
}