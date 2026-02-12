import { NextResponse } from 'next/server';

// Simple ping check using fetch with timeout
async function checkConnection(ip, timeout = 2000) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Try to connect to the IP
    // Note: In production with Electron, use the 'ping' package
    const startTime = Date.now();
    
    // For now, we'll simulate ping (in Electron, use actual ping)
    // This is a placeholder that should be replaced with actual ping logic
    
    clearTimeout(timeoutId);
    
    // Simulate response
    return {
      alive: Math.random() > 0.2, // 80% chance of being online (for testing)
      time: Date.now() - startTime,
    };
  } catch (error) {
    return {
      alive: false,
      time: null,
      error: error.message,
    };
  }
}

export async function POST(request) {
  try {
    const { ip } = await request.json();

    if (!ip) {
      return NextResponse.json(
        { error: 'IP address is required' },
        { status: 400 }
      );
    }

    const result = await checkConnection(ip);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Ping error:', error);
    return NextResponse.json(
      { alive: false, error: error.message },
      { status: 500 }
    );
  }
}