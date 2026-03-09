#!/bin/bash
# Push VerbaFlow to https://github.com/mjkong4-sudo/VerbaFlow
# Run this from the project folder after accepting the Xcode license if needed:
#   sudo xcodebuild -license

set -e
cd "$(dirname "$0")"

if [ ! -d .git ]; then
  git init
  git add .
  git commit -m "Initial commit: VerbaFlow app"
fi

if ! git remote get-url origin 2>/dev/null; then
  git remote add origin https://github.com/mjkong4-sudo/VerbaFlow.git
fi

git branch -M main
git push -u origin main

echo "Done. Next: import https://github.com/mjkong4-sudo/VerbaFlow in Vercel and add OPENAI_API_KEY."
