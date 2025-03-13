#!/bin/bash

# Create package.json if it doesn't exist
if [ ! -f package.json ]; then
  echo "Initializing package.json..."
  npm init -y
fi

# Install required dependencies
echo "Installing express and cors..."
npm install express cors

echo "Dependencies installed successfully!"
echo "You can now run the server with: node server.js"
