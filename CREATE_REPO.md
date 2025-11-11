# Create GitHub Repository and Push

## Step 1: Create the Repository on GitHub

1. Go to: https://github.com/new
2. Repository name: `innovateher`
3. Description: (optional) "Hackathon dashboard for managing judges and projects"
4. Visibility: Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push Your Code

After creating the repository, run:

```bash
git push -u origin main
```

## If You Get Authentication Errors

### Option A: Use SSH (Recommended - Already Set Up)

1. Make sure your SSH key is added to GitHub:
   - Go to: https://github.com/settings/keys
   - If you don't see your key, add it using the instructions in `SSH_KEY_SETUP.md`

2. Test SSH connection:
   ```bash
   ssh -T git@github.com
   ```
   You should see: "Hi lalitboyapati! You've successfully authenticated..."

3. Push:
   ```bash
   git push -u origin main
   ```

### Option B: Use Personal Access Token

1. Create a token at: https://github.com/settings/tokens
2. Select scope: `repo` (full control)
3. Change remote to HTTPS:
   ```bash
   git remote set-url origin https://github.com/lalitboyapati/innovateher.git
   ```
4. Push:
   ```bash
   git push -u origin main
   ```
   - Username: your GitHub username
   - Password: paste your personal access token

## Quick Summary

1. Create repo at: https://github.com/new (name: `innovateher`)
2. Run: `git push -u origin main`
3. Done! 🎉

