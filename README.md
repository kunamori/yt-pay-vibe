# YouTube Premium Payment Verification App

A web application for YouTube Premium payment verification where users can upload payment slips and admins can view/manage submissions.

## Features

- 📤 **User Upload**: Simple interface for uploading payment slip images
- 👥 **User Selection**: Dropdown to select user name
- ☁️ **Google Drive Integration**: Automatic upload to Google Drive
- 🔐 **Admin Authentication**: Secure login for administrators
- 📊 **Admin Dashboard**: View and manage all submissions
- 📱 **Responsive Design**: Mobile-friendly interface
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Runtime**: Node.js (Bun compatible)
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **Cloud Storage**: Google Drive API
- **Authentication**: Session-based auth with bcrypt

## Prerequisites

- Node.js 20+ or Bun 1.0+
- Google Cloud Project with Drive API enabled
- Google Service Account with access to a Drive folder

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/kunamori/yt-pay-vibe.git
cd yt-pay-vibe
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Configure Google Drive API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Give it a name and grant it appropriate permissions
   - Create a key (JSON format)
5. Create a folder in Google Drive
6. Share the folder with the service account email (with Editor permissions)
7. Copy the folder ID from the URL (the part after `/folders/`)

### 4. Set Up Environment Variables

#### For Local Development:

Create a `.env.local` file in the root directory:

```env
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
SESSION_SECRET=your_random_secret_here
```

#### For GitHub Actions Deployment:

1. Go to your repository on GitHub
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:
   - `GOOGLE_DRIVE_FOLDER_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`

### 5. Run Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to GitHub Pages

This project includes a GitHub Actions workflow for automatic deployment to GitHub Pages.

#### Setup GitHub Pages:

1. Go to your repository Settings > Pages
2. Under "Build and deployment":
   - Source: GitHub Actions
3. Configure the secrets as mentioned in step 4 above
4. Push to the `main` branch to trigger deployment

**Note**: GitHub Pages only supports static sites. For full functionality with server-side features (file uploads, authentication, database), consider deploying to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Fly.io**

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kunamori/yt-pay-vibe)

1. Click the button above or go to [Vercel](https://vercel.com)
2. Import your repository
3. Add environment variables in Vercel project settings
4. Deploy

### Deploy to Other Platforms

The application can be deployed to any platform that supports Node.js:

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Project Structure

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deployment
├── app/
│   ├── page.tsx             # User upload page
│   ├── layout.tsx           # Root layout
│   ├── admin/
│   │   ├── page.tsx         # Admin dashboard
│   │   └── login/
│   │       └── page.tsx     # Admin login
│   └── api/
│       ├── upload/
│       │   └── route.ts     # File upload API
│       └── admin/
│           ├── login/
│           │   └── route.ts # Login API
│           ├── logout/
│           │   └── route.ts # Logout API
│           └── submissions/
│               └── route.ts # Submissions API
├── components/
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── auth.ts              # Authentication logic
│   ├── database.ts          # SQLite database
│   ├── google-drive.ts      # Google Drive integration
│   └── utils.ts             # Utility functions
├── data/
│   └── submissions.db       # SQLite database (generated)
├── public/                  # Static assets
├── .env.example             # Environment variables template
└── package.json
```

## Usage

### For Users

1. Visit the home page
2. Click or drag to upload a payment slip image
3. Select your name from the dropdown
4. Click "Upload Slip"
5. Wait for confirmation

### For Admins

1. Navigate to `/admin/login`
2. Enter admin credentials
3. View all submissions in the dashboard
4. Click on Google Drive links to view payment slips
5. Logout when done

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_DRIVE_FOLDER_ID` | Google Drive folder ID for storing slips | Yes |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email | Yes |
| `GOOGLE_PRIVATE_KEY` | Service account private key | Yes |
| `ADMIN_USERNAME` | Admin login username | Yes |
| `ADMIN_PASSWORD` | Admin login password | Yes |
| `SESSION_SECRET` | Secret for session management | Yes |
| `NEXT_PUBLIC_BASE_PATH` | Base path for deployment (e.g., `/yt-pay-vibe`) | No |

## Security Notes

- Admin passwords can be plain text for development or bcrypt hashed for production
- Sessions are stored in memory (use Redis in production for scaling)
- File uploads are validated for image types
- All API routes check authentication where needed
- Service account credentials should be kept secure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please open an issue on GitHub.
