#!/usr/bin/env python3
"""
ClawShare Revoke Script

Revoke a share link.

Usage:
    python3 revoke.py <share-id>
"""

import os
import sys
import argparse
import urllib.request
import urllib.parse
import json


def revoke_share(share_id: str, clawshare_url: str = None) -> bool:
    """Revoke a share."""
    
    if clawshare_url is None:
        clawshare_url = os.environ.get("CLAWSHARE_URL", "https://clawshare.io")
    
    api_url = f"{clawshare_url}/api/download?id={urllib.parse.quote(share_id)}"
    req = urllib.request.Request(api_url, method="DELETE")
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            return data.get("success", False)
    except urllib.error.HTTPError as e:
        error = json.loads(e.read().decode()).get("error", "Failed to revoke")
        raise Exception(error)


def main():
    parser = argparse.ArgumentParser(description="Revoke ClawShare link")
    parser.add_argument("share_id", help="Share ID to revoke")
    
    args = parser.parse_args()
    
    try:
        success = revoke_share(args.share_id)
        
        if success:
            print(f"\n✅ Revoked share: {args.share_id}")
        else:
            print(f"\n❌ Failed to revoke: {args.share_id}")
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
