# Virtual Environment Setup Guide

This guide helps you set up a Python virtual environment to avoid the "externally-managed-environment" error.

## Quick Setup

### Option 1: Use the Setup Script (Recommended)

```bash
cd goalconvo-2
chmod +x setup_venv.sh
./setup_venv.sh
```

This will:
- Create a virtual environment
- Install all dependencies
- Set up necessary directories

### Option 2: Manual Setup

```bash
cd goalconvo-2

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

## Using the Virtual Environment

### Activate Virtual Environment

```bash
cd goalconvo-2
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Deactivate Virtual Environment

```bash
deactivate
```

## Running the Backend Server

The `start_backend.sh` script automatically:
- Checks for virtual environment
- Creates one if it doesn't exist
- Activates it
- Installs missing dependencies
- Starts the server

Just run:
```bash
./start_backend.sh
```

## Troubleshooting

### "python3-venv package is not installed"

Install it:
```bash
# For Python 3.8-3.12
sudo apt install python3-venv

# For Python 3.13
sudo apt install python3.13-venv

# Or install python3-full (includes venv)
sudo apt install python3-full
```

### "No module named 'venv'"

Try:
```bash
sudo apt install python3-full
```

### Virtual Environment Not Activating

Make sure you're in the `goalconvo-2` directory:
```bash
cd goalconvo-2
source venv/bin/activate
```

### Packages Not Found After Installation

1. Make sure virtual environment is activated (you should see `(venv)`)
2. Verify installation:
   ```bash
   pip list
   ```
3. Reinstall if needed:
   ```bash
   pip install -r requirements.txt
   ```

## Verification

After setup, verify everything works:

```bash
# Activate venv
source venv/bin/activate

# Test imports
python -c "import flask; print('Flask OK')"
python -c "import goalconvo; print('GoalConvo OK')"

# Test backend server
python backend_server.py
```

## For Development

Always activate the virtual environment before running scripts:

```bash
source venv/bin/activate
python scripts/generate_dialogues.py --test-connection
```

## Notes

- The virtual environment is in `goalconvo-2/venv/`
- Add `venv/` to `.gitignore` (already done)
- Each project should have its own virtual environment
- Don't commit the `venv/` directory to git

