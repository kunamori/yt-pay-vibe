# Quick Start Guide

This guide will help you quickly get started with the YouTube Premium Payment Verification App.

## Prerequisites

- Node.js 20+ or Bun 1.0+
- Google Cloud account
- GitHub account (for deployment)

## Local Development Setup (5 minutes)

### 1. Clone and Install

```bash
git clone https://github.com/kunamori/yt-pay-vibe.git
cd yt-pay-vibe
npm install
```

### 2. Create `.env.local`

```env
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
SESSION_SECRET=your_random_secret_here
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Google Drive Setup (10 minutes)

### Quick Steps:

1. **Create Google Cloud Project**: https://console.cloud.google.com/
2. **Enable Drive API**: APIs & Services > Library > Search "Google Drive API" > Enable
3. **Create Service Account**: IAM & Admin > Service Accounts > Create
4. **Download Key**: Service Account > Keys > Add Key > JSON
5. **Create Drive Folder**: Create a folder in Google Drive
6. **Share Folder**: Share with service account email (Editor permission)
7. **Get Folder ID**: Copy from folder URL after `/folders/`

## Production Deployment

### Vercel (Recommended - 2 minutes)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in project settings
5. Deploy!

### GitHub Actions Secrets

Required secrets (6 total):
- `GOOGLE_DRIVE_FOLDER_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`

See `GITHUB_ACTIONS_SETUP.md` for detailed instructions.

## Usage

### For Users

1. Visit the home page
2. Select your name
3. Upload payment slip image
4. Click "Upload Slip"

### For Admins

1. Go to `/admin/login`
2. Login with credentials
3. View submissions
4. Click links to view slips on Google Drive

## Troubleshooting

### "Failed to upload to Google Drive"
- Check service account credentials
- Verify folder is shared with service account
- Ensure Drive API is enabled

### "Invalid credentials" on admin login
- Check ADMIN_USERNAME and ADMIN_PASSWORD in .env.local
- Verify no typos

### Build fails
- Run `npm install` again
- Check Node.js version (20+)
- Clear `.next` folder: `rm -rf .next`

## Need Help?

- Check README.md for full documentation
- See GITHUB_ACTIONS_SETUP.md for deployment
- Open an issue on GitHub

## Default User Names

The app comes with these default user names (configurable in `app/page.tsx`):
- User A
- User B
- User C
- User D
- User E

To customize, edit the `USER_NAMES` array in `app/page.tsx`.

## Security Tips

✅ Use bcrypt hashed passwords in production
✅ Keep service account key secure
✅ Use HTTPS in production
✅ Rotate secrets periodically
❌ Never commit .env files to git
❌ Don't share credentials via insecure channels

## Project Links

- Repository: https://github.com/kunamori/yt-pay-vibe
- Documentation: See README.md
- Issues: https://github.com/kunamori/yt-pay-vibe/issues
