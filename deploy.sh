#!/bin/bash

# Build & Deploy Script for TerraLegion React Editor
# Run this from the terralegion-website-builder directory

set -e  # Exit on any error

echo "🏗️  Building TerraLegion React Editor..."
echo "========================================"

# Check Node version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js 16+ required. You have v$NODE_VERSION. Please install Node 16 or higher."
    exit 1
fi

echo "✅ Node $(node --version) detected"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Build
echo "🔨 Building production bundle..."
npm run build
echo "✅ Build complete"
echo ""

# Check if output exists
if [ ! -f "../crm.terralegion.com/assets/website-builder/app.js" ]; then
    echo "❌ Build output not found. Check vite.config.js output path."
    exit 1
fi

echo "📦 Build artifacts:"
ls -lh ../crm.terralegion.com/assets/website-builder/
echo ""

# Prompt for deployment
read -p "Deploy to CRM server? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then

    # Read deployment settings
    read -p "Enter CRM server host (e.g., user@crm.terralegion.com): " CRM_HOST
    read -p "Enter remote path (e.g., /home/user/crm.terralegion.com/assets/website-builder): " REMOTE_PATH

    echo ""
    echo "🚀 Deploying to $CRM_HOST:$REMOTE_PATH..."

    # SCP the files
    scp ../crm.terralegion.com/assets/website-builder/app.js "$CRM_HOST:$REMOTE_PATH/"
    scp ../crm.terralegion.com/assets/website-builder/styles.css "$CRM_HOST:$REMOTE_PATH/" 2>/dev/null || echo "⚠️  styles.css may not exist (optional)"

    echo "✅ Deployment complete!"
    echo ""
    echo "Next steps:"
    echo "1. Verify the editor loads: https://crm.terralegion.com/index.php/websitebuilder/edit/3"
    echo "2. Drag components, edit content, test Save/Publish buttons"

else
    echo "⏭️  Skipping deployment. Run ./deploy.sh again when ready."
    echo ""
    echo "Manual deployment:"
    echo "  scp ../crm.terralegion.com/assets/website-builder/app.js user@crm.terralegion.com:/path/to/assets/website-builder/"
    echo "  scp ../crm.terralegion.com/assets/website-builder/styles.css user@crm.terralegion.com:/path/to/assets/website-builder/"
fi
