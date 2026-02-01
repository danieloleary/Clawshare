# ClawShare 🦞📤

Agent-to-agent file sharing for OpenClaw. Share files with secure, expiring links.

## Features

- 🔗 Generate secure share links (1h to 30d expiry)
- 🔒 Password protection (optional)
- 👁️ View-only mode (no download)
- 📄 Support for PDFs, office docs, images, text files
- ⚡ Direct uploads via presigned R2 URLs
- 🤖 OpenClaw skill for natural language commands

## Quick Start

### 1. Setup Cloudflare R2

```bash
# Create R2 bucket and get credentials
# Add to .env.local:
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=clawshare
R2_PUBLIC_URL=https://pub-your-id.r2.dev
```

### 2. Deploy to Vercel

```bash
# Push to GitHub, connect to Vercel
# Add environment variables in Vercel dashboard
# Deploy!
```

### 3. Install OpenClaw Skill

```bash
# Copy skills/clawshare to your MoltBot skills folder
cp -r skills/clawshare ~/.moltbot/skills/
```

## Usage

### Web UI

1. Go to https://clawshare.io
2. Upload a file
3. Share the link!

### OpenClaw Commands

```bash
# Upload and share
teddy: "Upload report.pdf to ClawShare, share for 3 days"

# Download
teddy: "Download clawshare.io/s/abc123 and save to downloads/"

# List shares
teddy: "List my ClawShare links"

# Revoke
teddy: "Revoke share abc123"
```

## CLI Tools

```bash
# Upload
python3 skills/clawshare/upload.py report.pdf --expires 7d

# Download
python3 skills/clawshare/download.py abc123 --output ./

# List
python3 skills/clawshare/list.py

# Revoke
python3 skills/clawshare/revoke.py abc123
```

## Tech Stack

- **Frontend/Backend:** Next.js 14+ (App Router)
- **Storage:** Cloudflare R2 (S3-compatible)
- **Database:** JSON file (MVP), Vercel KV ready
- **Deploy:** Vercel (free tier)
- **Auth:** API keys per Claw

## Project Structure

```
clawshare/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── share/       # Upload & create shares
│   │   │   └── download/    # Download & revoke
│   │   ├── s/[id]/          # Share page
│   │   └── page.tsx         # Upload UI
│   └── lib/
│       ├── r2.ts           # R2 presigned URLs
│       └── meta.ts         # File metadata
├── skills/
│   └── clawshare/          # OpenClaw skill
│       ├── SKILL.md
│       ├── upload.py
│       ├── download.py
│       ├── list.py
│       └── revoke.py
└── .env.example
```

## Limits (MVP)

- Max file size: 50MB
- Allowed types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF, TXT, CSV, JSON, MD
- Default expiry: 7 days
- Min expiry: 1 hour
- Max expiry: 30 days

## License

MIT

---

Built for OpenClaw agents 🦞
