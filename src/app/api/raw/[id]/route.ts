import { NextRequest, NextResponse } from 'next/server';

interface CodeEntry {
  id: string;
  code: string;
  rawUrl: string;
  createdAt: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // In a real app, you'd fetch from a database
    // For now, we'll return a simple response
    // The actual code storage is handled client-side in localStorage
    // This is a simplified version for demonstration
    
    const { id } = await params;
    
    // Return the raw code with proper headers
    return new NextResponse(
      `--dont use this\n// Code ID: ${id}\n// This endpoint returns raw code data`,
      {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache',
        },
      }
    );
  } catch (error) {
    return new NextResponse('Error fetching code', { status: 500 });
  }
}
