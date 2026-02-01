# ClawShare Skill

*Share and download files between OpenClaw agents*

---

## Description

Upload files to ClawShare and generate secure, expiring share links. Download shared files from share IDs. Perfect for agent-to-agent file transfer.

## Usage

### Upload and Share

```bash
# Upload a file and create a share link
teddy: "Upload report.pdf to ClawShare, share for 3 days"

# With custom expiry and password
teddy: "Upload data.xlsx to ClawShare, 7-day link, password: secret123"

# View-only (no download button)
teddy: "Upload file.png, 1-hour view-only link"
```

### Download

```bash
# Download by share ID
teddy: "Download clawshare.io/s/abc123 and save to downloads/"

# With password
teddy: "Download clawshare.io/s/xyz789 with password mypass"
```

### Manage Shares

```bash
# List your shares
teddy: "List my ClawShare links"

# Revoke a share
teddy: "Revoke share abc123"
```

### CLI

```bash
# Upload and get link
python3 skills/clawshare/upload.py report.pdf --expires 7d

# Download file
python3 skills/clawshare/download.py abc123 --output ./downloads/

# List shares
python3 skills/clawshare/list.py
```

## Configuration

Set ClawShare URL in skill config:

```bash
export CLAWSHARE_URL="https://clawshare.io"
export CLAWSHARE_API_KEY="your-api-key"  # For authenticated actions
```

## Supported File Types

**Allowed (MVP):**
- Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- Images: JPG, PNG, GIF, WebP
- Text: TXT, CSV, JSON, MD

**Not Allowed:** EXE, DLL, BAT, SH, etc.

## Limits

- Max file size: 50MB
- Default expiry: 7 days
- Min expiry: 1 hour
- Max expiry: 30 days

## Examples

### Upload a Report

```
teddy: "Upload Q4_report.pdf to ClawShare, share with @FamilyClaw for 3 days view-only"
→ Uploads file, creates 3-day view-only link
→ Returns share URL: https://clawshare.io/s/abc123
```

### Share Between Claws

```
teddy: "Upload debug_logs.zip to ClawShare, 1-hour download link"
→ Creates 1-hour downloadable link
→ Other Claw can download via share ID
```

### Batch Upload

```
teddy: "Upload all PDF files in downloads/ to ClawShare"
→ Finds all PDFs in downloads/
→ Uploads each, returns share links
```

## Files

| File | Purpose |
|------|---------|
| `upload.py` | Upload file, get share link |
| `download.py` | Download from share ID |
| `list.py` | List your shares |
| `revoke.py` | Revoke a share |

## See Also

- Web UI: https://clawshare.io
- Source: https://github.com/danieloleary/Clawshare

## Author

Dan O'Leary (@danieloleary)
