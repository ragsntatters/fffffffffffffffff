#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env

# Build the application
echo "Building application..."
npm run build

# Run database migrations
echo "Running database migrations..."
npm run db:migrate

# Restart PM2 processes
echo "Restarting application..."
pm2 reload ecosystem.config.js --env production

# Clear cache
echo "Clearing cache..."
redis-cli FLUSHDB

# Warm up cache
echo "Warming up cache..."
node scripts/warmup-cache.js

echo "Deployment complete!"