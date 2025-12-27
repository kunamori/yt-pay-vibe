import { google } from 'googleapis';
import { Readable } from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// OAuth2 client for personal Gmail accounts
function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Google OAuth credentials in environment variables');
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'http://localhost:3000/api/auth/google/callback'
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return oauth2Client;
}

export async function uploadToGoogleDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ fileId: string; fileUrl: string }> {
  try {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId) {
      throw new Error('Missing GOOGLE_DRIVE_FOLDER_ID in environment variables');
    }

    // Use OAuth2 client
    const auth = getOAuth2Client();
    const drive = google.drive({ version: 'v3', auth });

    // Upload file
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    // Convert Buffer to Readable stream - googleapis requires a stream with .pipe() method
    const stream = Readable.from(fileBuffer);

    const media = {
      mimeType,
      body: stream,
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    const fileId = file.data.id!;
    
    // Make file accessible to anyone with the link
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Get the webViewLink
    const fileInfo = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink',
    });

    return {
      fileId,
      fileUrl: fileInfo.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`,
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw new Error('Failed to upload file to Google Drive');
  }
}
