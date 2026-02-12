import { db } from '@/lib/database';
import { NextResponse } from 'next/server';

// GET settings
export async function GET() {
  try {
    const settings = await db.settings.get();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT update settings
export async function PUT(request) {
  try {
    const data = await request.json();
    const updatedSettings = await db.settings.update(data);
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}