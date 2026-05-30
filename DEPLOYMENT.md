# Step 4 Deployment Guide

The React editor bundle (`app.js` + `styles.css`) needs to be deployed to your CRM server's `assets/website-builder/` directory.

## Prerequisites

- **Node.js 16+** (on your local development machine or CI/CD platform)
- **SSH access** to your CRM server (or FTP/SFTP)
- **npm 7+**

## Option 1: Local Build & Deploy (Recommended for Testing)

### On Your Development Machine

If you're on macOS, Linux, or Windows (with Node 16+ installed):

```bash
cd /path/to/terralegion-website-builder
chmod +x deploy.sh
./deploy.sh
```

The script will:
1. ✅ Check Node.js version (must be 16+)
2. ✅ Install dependencies (`npm install`)
3. ✅ Build the bundle (`npm run build`)
4. ✅ Prompt for SCP deployment details
5. ✅ Upload files to your CRM server

**If you don't have Node 16 installed:**

```bash
# Using Homebrew (macOS)
brew install node@18

# Using nvm (all platforms)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

---

## Option 2: GitHub Actions (Automated CI/CD)

If your code is on GitHub, the `.github/workflows/build-deploy.yml` file will automatically build on every push.

### To Enable Automated Deployment to Your Server:

1. **Add SSH credentials to GitHub Secrets**:
   - Go to repo Settings → Secrets and variables → Actions
   - Add these secrets:
     - `CRM_HOST` = `user@crm.terralegion.com`
     - `CRM_USERNAME` = your SSH username
     - `CRM_SSH_KEY` = your SSH private key (as text)

2. **Uncomment the deployment step** in `.github/workflows/build-deploy.yml`

3. **Push to GitHub** → workflow runs automatically → files deployed

---

## Option 3: Manual Build & Deploy

If you prefer to handle it step-by-step:

### Build Locally

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Output will be at: ../crm.terralegion.com/assets/website-builder/
```

### Deploy via SCP

```bash
# Deploy app.js
scp ../crm.terralegion.com/assets/website-builder/app.js \
    user@crm.terralegion.com:/home/user/crm.terralegion.com/assets/website-builder/

# Deploy styles.css (if it exists)
scp ../crm.terralegion.com/assets/website-builder/styles.css \
    user@crm.terralegion.com:/home/user/crm.terralegion.com/assets/website-builder/
```

### Deploy via SFTP (Alternative)

```bash
sftp user@crm.terralegion.com
cd /path/to/assets/website-builder
put ../crm.terralegion.com/assets/website-builder/app.js
put ../crm.terralegion.com/assets/website-builder/styles.css
exit
```

---

## Option 4: FTP/Hosting Control Panel

If your hosting provider has a file manager:

1. Build locally: `npm run build`
2. Navigate to `../crm.terralegion.com/assets/website-builder/` on your machine
3. Upload `app.js` and `styles.css` via the file manager
4. Ensure file permissions are readable (`644` or similar)

---

## Verify Deployment

After uploading, test the editor:

```bash
# In your browser, visit:
https://crm.terralegion.com/index.php/websitebuilder/edit/3

# Or any client ID:
https://crm.terralegion.com/index.php/websitebuilder/edit/{CLIENT_ID}
```

**Expected result**:
- Spinner disappears
- Editor canvas appears (black background, "Drag components here...")
- No JS console errors (press F12 to check)
- You can drag HeroSection/FeatureGrid/TextBlock tools onto canvas

---

## Troubleshooting

### "Cannot find module" error during build
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Build succeeds but app.js is empty
Check `vite.config.js` — ensure the `outDir` path is correct. Default:
```
../crm.terralegion.com/assets/website-builder
```

### Editor loads but shows "not built" message
- The `app.js` file path in the CRM view is wrong, OR
- The file wasn't uploaded to the correct location

Check:
```bash
ls -la /path/to/crm/assets/website-builder/app.js
```

### "No such file or directory" SCP error
Double-check the remote path. Ask your hosting provider:
- What is the full path to the `assets` directory?
- What username/host should I use for SSH?

---

## What Gets Deployed

| File | Size | Purpose |
|------|------|---------|
| `app.js` | ~50KB | React + Craft.js bundle (minified) |
| `styles.css` | ~30KB | Tailwind CSS (optional, included in app.js if omitted) |

Both are served by the CRM's web server from `/assets/website-builder/`.

---

## Next Steps

Once deployed:
1. ✅ Load the editor in the CRM
2. ✅ Drag a HeroSection tool onto the canvas
3. ✅ Edit the title → changes visible in real-time
4. ✅ Click "Save" → POST to `/websitebuilderapi/save_website/{client_id}` succeeds
5. ✅ Click "Publish" → status updates to "published"
6. ✅ Test the public API endpoint with the site's token

Then proceed to Step 5 (Next.js renderer deployment).

---

## Support

If deployment fails:
- Check `DEPLOYMENT.md` (this file) for your specific platform
- Review the CRM server logs: `tail -f /path/to/crm/writable/logs/*.log`
- Verify file permissions: `chmod 644 app.js styles.css`
- Confirm the CRM can read the files: `ls -la assets/website-builder/`
