#!/usr/bin/env python3
"""
ClawShare Download Script

Download a shared file from ClawShare.

Usage:
    python3 download.py <share-id> [options]

Options:
    --output DIR      Output directory (default: current dir)
    --filename NAME   Save as specific filename
    --password PASS   Password if required
    --url URL         ClawShare URL (default: https://clawshare.io)
"""

import os
import sys
import argparse
from pathlib import Path
import urllib.request
import urllib.parse
import json


def download_file(
    share_id: str,
    output_dir: str = ".",
    filename: str = None,
    password: str = None,
    clawshare_url: str = None,
) -> str:
    """Download file from ClawShare."""
    
    if clawshare_url is None:
        clawshare_url = os.environ.get("CLAWSHARE_URL", "https://clawshare.io")
    
    # Get download URL
    params = {"id": share_id}
    if password:
        params["password"] = password
    
    query = urllib.parse.urlencode(params)
    api_url = f"{clawshare_url}/api/download?{query}"
    
    req = urllib.request.Request(api_url)
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            
            if not data.get("success"):
                raise Exception(data.get("error", "Download failed"))
            
            meta = data["meta"]
            download_url = data["downloadUrl"]
            
            # Determine filename
            if filename is None:
                filename = meta["name"]
            
            output_path = Path(output_dir) / filename
            
            # Download file
            with urllib.request.urlopen(download_url, timeout=60) as file_resp:
                with open(output_path, "wb") as f:
                    f.write(file_resp.read())
            
            return str(output_path)
            
    except urllib.error.HTTPError as e:
        error = json.loads(e.read().decode()).get("error", "Download failed")
        raise Exception(error)


def main():
    parser = argparse.ArgumentParser(description="Download file from ClawShare")
    parser.add_argument("share_id", help="Share ID or full URL")
    parser.add_argument("--output", "-o", default=".", help="Output directory")
    parser.add_argument("--filename", "-f", help="Save as filename")
    parser.add_argument("--password", "-p", help="Password if required")
    parser.add_argument("--url", help="ClawShare URL")
    
    args = parser.parse_args()
    
    # Extract share ID from full URL if needed
    share_id = args.share_id
    if "/" in share_id:
        share_id = share_id.split("/")[-1]
    
    try:
        output_path = download_file(
            share_id,
            output_dir=args.output,
            filename=args.filename,
            password=args.password,
            clawshare_url=args.url,
        )
        
        print(f"\n✅ Downloaded: {output_path}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
