#!/usr/bin/env python3
"""
ClawShare Upload Script

Upload a file to ClawShare and get a share link.

Usage:
    python3 upload.py <filename> [options]

Options:
    --expires DAYS    Expiry in days (default: 7)
    --hours HOURS     Expiry in hours (optional, overrides days)
    --password PASS   Password protect (optional)
    --view-only       View-only link (no download)
    --url URL         ClawShare URL (default: https://clawshare.io)
"""

import os
import sys
import argparse
from pathlib import Path

# ClawShare API client (inline for MVP)
import urllib.request
import urllib.parse
import json


def upload_file(
    file_path: str,
    expires_days: int = 7,
    expires_hours: int = None,
    password: str = None,
    view_only: bool = False,
    clawshare_url: str = None,
) -> dict:
    """Upload file to ClawShare."""
    
    if clawshare_url is None:
        clawshare_url = os.environ.get("CLAWSHARE_URL", "https://clawshare.io")
    
    api_url = f"{clawshare_url}/api/share"
    
    # Calculate expiry in seconds
    if expires_hours:
        expires_seconds = expires_hours * 3600
    else:
        expires_seconds = expires_days * 24 * 3600
    
    # Build form data
    with open(file_path, "rb") as f:
        file_data = f.read()
    
    import multipart
    
    body, content_type = multipart.encode_multipart(
        {"file": (Path(file_path).name, file_data)},
        {
            "expiresIn": str(expires_seconds),
            "password": password or "",
            "download": "false" if view_only else "true",
        },
    )
    
    req = urllib.request.Request(api_url, data=body, method="POST")
    req.add_header("Content-Type", content_type)
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            return data
    except urllib.error.HTTPError as e:
        error = json.loads(e.read().decode()).get("error", "Upload failed")
        raise Exception(error)


def main():
    parser = argparse.ArgumentParser(description="Upload file to ClawShare")
    parser.add_argument("file", help="File to upload")
    parser.add_argument("--expires", type=int, default=7, help="Days until expiry")
    parser.add_argument("--hours", type=int, help="Hours until expiry (overrides days)")
    parser.add_argument("--password", help="Password protect share")
    parser.add_argument("--view-only", action="store_true", help="View-only link")
    parser.add_argument("--url", help="ClawShare URL")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.file):
        print(f"❌ File not found: {args.file}")
        sys.exit(1)
    
    try:
        result = upload_file(
            args.file,
            expires_days=args.expires,
            expires_hours=args.hours,
            password=args.password,
            view_only=args.view_only,
            clawshare_url=args.url,
        )
        
        print("\n✅ File uploaded!")
        print(f"\n📎 Share URL: {result['publicUrl']}")
        print(f"⏰ Expires: {result['expiresIn'] // 3600} hours")
        print(f"\n🔗 Direct link: {result['publicUrl']}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
