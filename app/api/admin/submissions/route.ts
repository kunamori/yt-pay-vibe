import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getAllSubmissions } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const submissions = getAllSubmissions();

    return NextResponse.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
