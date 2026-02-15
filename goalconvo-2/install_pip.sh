#!/bin/bash

# Install pip using get-pip.py (no sudo required)

echo "📦 Installing pip using get-pip.py..."

# Download get-pip.py
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py

# Install pip for current user
python3 get-pip.py --user

# Add user bin to PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
export PATH="$HOME/.local/bin:$PATH"

# Clean up
rm get-pip.py

echo "✅ pip installed successfully!"
echo "   You may need to restart your terminal or run: source ~/.bashrc"
echo "   Then you can run: ./setup.sh"
