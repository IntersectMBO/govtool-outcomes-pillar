#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting repository update process..."

# Ensure the repository is up-to-date
cd /app

if [ -d ".git" ]; then
    echo "Resetting repository to a clean state..."
    git reset --hard HEAD       
    git clean -fd               
    echo "Pulling latest changes from the current branch..."
    git fetch origin           
    git pull origin $(git rev-parse --abbrev-ref HEAD)  
else
    echo "Error: Repository is not properly cloned. Exiting."
    exit 1
fi

# Navigate to the frontend directory
cd /app/govtool/frontend

# Check if node_modules exists and reinstall dependencies without the lock file
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the application
echo "Starting the application..."
exec "$@"