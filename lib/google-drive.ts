import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

export async function uploadToGoogleDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ fileId: string; fileUrl: string }> {
  try {
    // Get credentials from environment variables
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!email || !privateKey || !folderId) {
      throw new Error('Missing Google Drive credentials in environment variables');
    }

    // Create JWT auth client
    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: SCOPES,
    });

    const drive = google.drive({ version: 'v3', auth });

    // Upload file
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType,
      body: Buffer.from(fileBuffer),
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
