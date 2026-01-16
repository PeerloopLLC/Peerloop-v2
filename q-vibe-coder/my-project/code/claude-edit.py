#!/usr/bin/env python3
"""
Claude Code Edit Helper
Bypasses the 'file unexpectedly modified' error caused by Windows Defender/Search Indexer.

Usage:
  python claude-edit.py <filepath> <old_text_file> <new_text_file>
  
Or call from Claude Code:
  python claude-edit.py file.js --inline "old text" "new text"
"""
import sys
import os

def edit_file(filepath, old_text, new_text):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if old_text not in content:
        print(f"ERROR: old_text not found in {filepath}")
        return False
    
    # Check for uniqueness
    count = content.count(old_text)
    if count > 1:
        print(f"ERROR: old_text found {count} times (must be unique)")
        return False
    
    new_content = content.replace(old_text, new_text, 1)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"SUCCESS: Edited {filepath}")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)
    
    filepath = sys.argv[1]
    
    if sys.argv[2] == "--inline":
        old_text = sys.argv[3]
        new_text = sys.argv[4] if len(sys.argv) > 4 else ""
    else:
        # Read from files
        with open(sys.argv[2], 'r', encoding='utf-8') as f:
            old_text = f.read()
        with open(sys.argv[3], 'r', encoding='utf-8') as f:
            new_text = f.read()
    
    success = edit_file(filepath, old_text, new_text)
    sys.exit(0 if success else 1)
