import { NextRequest, NextResponse } from 'next/server';
import { uploadToGoogleDrive } from '@/lib/google-drive';
import { createSubmission } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userName = formData.get('userName') as string;

    if (!file || !userName) {
      return NextResponse.json(
        { error: 'Missing file or user name' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${userName.replace(/\s+/g, '_')}_${timestamp}_${file.name}`;

    // Upload to Google Drive
    const { fileId, fileUrl } = await uploadToGoogleDrive(
      buffer,
      filename,
      file.type
    );

    // Save to database
    const submission = createSubmission(userName, fileId, fileUrl);

    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
