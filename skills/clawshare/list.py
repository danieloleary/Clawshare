#!/usr/bin/env python3
"""
ClawShare List Script

List your shared files.

Usage:
    python3 list.py [options]
"""

import os
import sys
import urllib.request
import urllib.parse
import json


def list_shares(clawshare_url: str = None) -> list:
    """List all shares."""
    
    if clawshare_url is None:
        clawshare_url = os.environ.get("CLAWSHARE_URL", "https://clawshare.io")
    
    api_url = f"{clawshare_url}/api/share?list=true"
    req = urllib.request.Request(api_url)
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            return data.get("shares", [])
    except urllib.error.HTTPError as e:
        error = json.loads(e.read().decode()).get("error", "Failed to list")
        raise Exception(error)


def main():
    clawshare_url = os.environ.get("CLAWSHARE_URL", "https://clawshare.io")
    
    try:
        shares = list_shares(clawshare_url)
        
        if not shares:
            print("\n📭 No shares found")
            return
        
        print(f"\n📁 Your ClawShare links ({len(shares)}):\n")
        
        for share in shares:
            expires = share.get("expiresAt", "unknown")
            print(f"  • {share['id']}")
            print(f"    File: {share['name']}")
            print(f"    Expires: {expires}")
            print()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
