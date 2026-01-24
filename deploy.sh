#!/bin/bash
# Deployment script for quiz-platform to Cloudflare Workers

echo "🚀 Deploying Quiz Platform to Cloudflare Workers"
echo ""

# Check if environment variables are set locally
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please create a .env file with your environment variables"
    exit 1
fi

# Source the .env file to get variables
source .env

echo "📝 Setting Cloudflare secrets..."
echo ""

# Set secrets (these won't be echoed)
echo "Setting GITHUB_CLIENT_ID..."
echo "$GITHUB_CLIENT_ID" | pnpm wrangler secret put GITHUB_CLIENT_ID

echo "Setting GITHUB_CLIENT_SECRET..."
echo "$GITHUB_CLIENT_SECRET" | pnpm wrangler secret put GITHUB_CLIENT_SECRET

echo "Setting AUTH_SECRET..."
echo "$AUTH_SECRET" | pnpm wrangler secret put AUTH_SECRET


echo "Setting RESEND_API_KEY..."
echo "$RESEND_API_KEY" | pnpm wrangler secret put RESEND_API_KEY

echo "Setting RESEND_FROM_EMAIL..."
echo "$RESEND_FROM_EMAIL" | pnpm wrangler secret put RESEND_FROM_EMAIL

echo "Setting SUGGESTION_EMAIL..."
echo "$SUGGESTION_EMAIL" | pnpm wrangler secret put SUGGESTION_EMAIL

echo ""
echo "✅ Secrets configured"
echo ""

# Apply D1 migrations to remote database
echo "📊 Applying D1 database migrations..."
pnpm wrangler d1 migrations apply quiz-db --remote

echo ""
echo "🚀 Deploying to Cloudflare Workers..."
pnpm wrangler deploy