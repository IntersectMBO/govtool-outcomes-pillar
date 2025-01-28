#!/bin/bash

set -e

echo "Starting govtool setup..."

REPO_URL="https://github.com/IntersectMBO/govtool.git"
HOST_FRONTEND_DIR="./govtool/frontend"
UPDATE=$1 

if [ "$UPDATE" == "true" ]; then
    echo "Update mode enabled."
else
    echo "Setup mode enabled."
fi

clone_and_copy() {
    echo "Cloning repository and copying files..."

    mkdir -p "$(dirname "$HOST_FRONTEND_DIR")"

    docker run --name clone-govtool --interactive --tty \
        --workdir /app \
        node:20-alpine sh -c "
        apk add --no-cache git && \
        if [ ! -d 'govtool' ]; then \
            echo 'Cloning repository into container...' ; \
            git clone ${REPO_URL} ; \
        else \
            echo 'Repository already cloned.' ; \
        fi"

    if docker cp clone-govtool:/app/govtool/govtool/frontend ./govtool/; then
        echo "Frontend files copied to host."
        cp govtool/frontend/.env.example govtool/frontend/.env
    else
        echo "Error: Frontend directory not found in container. Verify the repository structure."
        docker stop clone-govtool && docker rm -v clone-govtool
        exit 1
    fi

    docker stop clone-govtool && docker rm -v clone-govtool || echo "Container already removed."
}

if [ ! -d "$HOST_FRONTEND_DIR" ] || [ "$UPDATE" = true ]; then
    echo "Initial setup or update required..."
    clone_and_copy
else
    echo "Frontend directory already exists. Skipping clone."
fi

#  install node  dependencies in the frontend directory
if [ ! -d "$HOST_FRONTEND_DIR/node_modules" ]|| [ "$UPDATE" = true ]; then
    echo "Installing dependencies..."
    docker run --rm --interactive --tty \
        --volume "${PWD}/govtool/frontend:/app" \
        --workdir /app \
        --user root \
        node:20-alpine yarn install --ignore-engine
else
    echo "Dependencies already installed."
fi

# Ensure permissions are set correctly
echo "Adjusting permissions..."
chmod -R 777 "$HOST_FRONTEND_DIR"

echo "Govtool setup completed!"