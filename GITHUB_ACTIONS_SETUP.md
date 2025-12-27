# GitHub Actions Secrets Setup Guide

This guide explains how to configure GitHub Actions secrets for deploying the YouTube Premium Payment Verification App.

## Required Secrets

Configure these secrets in your GitHub repository before deployment:

### Navigation
1. Go to your repository on GitHub
2. Click **Settings**
3. In the left sidebar, click **Secrets and variables** > **Actions**
4. Click **New repository secret** for each secret below

### Secrets to Add

#### 1. GOOGLE_DRIVE_FOLDER_ID
- **Description**: The ID of the Google Drive folder where payment slips will be stored
- **How to get**: 
  1. Open the folder in Google Drive
  2. Copy the ID from the URL: `https://drive.google.com/drive/folders/YOUR_FOLDER_ID`
- **Example**: `1a2b3c4d5e6f7g8h9i0j`

#### 2. GOOGLE_SERVICE_ACCOUNT_EMAIL
- **Description**: Email address of your Google Service Account
- **How to get**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Navigate to IAM & Admin > Service Accounts
  3. Copy the email address
- **Example**: `my-service-account@project-id.iam.gserviceaccount.com`

#### 3. GOOGLE_PRIVATE_KEY
- **Description**: Private key from your Google Service Account JSON file
- **How to get**:
  1. Download the service account JSON key file
  2. Open the file and copy the entire `private_key` value (including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines)
- **Example**: 
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
...
-----END PRIVATE KEY-----
```
- **Important**: Make sure to include the newline characters (`\n`)

#### 4. ADMIN_USERNAME
- **Description**: Username for admin login
- **Example**: `admin`

#### 5. ADMIN_PASSWORD
- **Description**: Password for admin login
- **Security Note**: For production, use a strong password or bcrypt hash
- **Example**: `MySecureP@ssw0rd123`
- **To use bcrypt hash** (recommended):
  ```bash
  node -e "console.log(require('bcryptjs').hashSync('your_password', 10))"
  ```

#### 6. SESSION_SECRET
- **Description**: Random secret for session management
- **How to generate**:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Example**: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

## Setting Up Google Drive

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Note your project ID

### 2. Enable Google Drive API
1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Drive API"
3. Click **Enable**

### 3. Create Service Account
1. Go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Enter a name (e.g., "yt-pay-vibe-uploader")
4. Click **Create and Continue**
5. Skip role assignment (optional)
6. Click **Done**

### 4. Create Service Account Key
1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key** > **Create new key**
4. Choose **JSON** format
5. Click **Create** (the file will download automatically)
6. Keep this file secure - you'll extract the email and private key from it

### 5. Create and Share Google Drive Folder
1. Go to [Google Drive](https://drive.google.com/)
2. Create a new folder for payment slips
3. Right-click the folder > **Share**
4. Add the service account email (from step 4)
5. Give it **Editor** permissions
6. Click **Share**
7. Copy the folder ID from the URL

## Verifying Secrets

After adding all secrets, verify them:

1. Go to **Settings** > **Secrets and variables** > **Actions**
2. You should see all 6 secrets listed
3. Secrets cannot be viewed after creation, only updated

## Testing the Deployment

1. Push a commit to the `main` branch
2. Go to **Actions** tab in your repository
3. Watch the "Deploy to GitHub Pages" workflow
4. If it fails, check the logs for error messages
5. Common issues:
   - Invalid Google credentials
   - Missing secrets
   - Incorrect folder permissions

## Security Best Practices

- ✅ **Never commit** `.env` files or secrets to git
- ✅ **Use bcrypt hashed** passwords in production
- ✅ **Rotate secrets** periodically
- ✅ **Limit service account** permissions to Drive only
- ✅ **Use different secrets** for development and production
- ❌ **Don't share** secrets via insecure channels
- ❌ **Don't print** secrets in logs or console

## Troubleshooting

### "Missing Google Drive credentials"
- Verify all three Google-related secrets are set
- Check that the private key includes the header and footer
- Ensure newlines in the private key are preserved

### "Permission denied" on Google Drive
- Verify the folder is shared with the service account email
- Check that the service account has Editor permissions
- Ensure the folder ID is correct

### "Authentication failed" for admin
- Verify ADMIN_USERNAME and ADMIN_PASSWORD are set
- Check for typos in username/password
- If using bcrypt hash, verify it was generated correctly

### Workflow fails to deploy
- Check that GitHub Pages is enabled in repository settings
- Verify the workflow has necessary permissions
- Review the workflow logs for specific errors

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Google Drive API Documentation](https://developers.google.com/drive/api/v3/about-sdk)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
