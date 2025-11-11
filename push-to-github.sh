#!/bin/bash

# Script to push InnovateHer to GitHub
# Make sure you've created the repository at: https://github.com/new

echo "🚀 Pushing InnovateHer to GitHub..."
echo ""

# Check if remote is set correctly
REMOTE_URL=$(git remote get-url origin 2>/dev/null)
echo "Remote URL: $REMOTE_URL"
echo ""

# Check SSH connection
echo "Testing SSH connection to GitHub..."
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ SSH authentication successful!"
else
    echo "❌ SSH authentication failed. Please check your SSH key setup."
    exit 1
fi

echo ""
echo "Attempting to push to origin/main..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "View your repo at: https://github.com/lalitboyapati/innovateher"
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "   1. Repository doesn't exist yet - Create it at: https://github.com/new"
    echo "   2. Repository name must be: innovateher"
    echo "   3. Don't initialize with README, .gitignore, or license"
fi

