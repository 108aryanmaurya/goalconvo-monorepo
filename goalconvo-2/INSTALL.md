# Installation Guide

## Quick Start (Recommended)

```bash
cd goalconvo-2
./QUICK_SETUP.sh
```

This will automatically:
- Create a virtual environment
- Install all dependencies
- Set up directories

## Manual Installation

### Step 1: Install Python venv package

```bash
# For Python 3.8-3.12
sudo apt install python3-venv

# For Python 3.13
sudo apt install python3.13-venv

# Or install full Python package
sudo apt install python3-full
```

### Step 2: Create virtual environment

```bash
cd goalconvo-2
python3 -m venv venv
```

### Step 3: Activate virtual environment

```bash
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Step 4: Install dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 5: Verify installation

```bash
python -c "import flask; print('✅ Flask installed')"
python -c "import goalconvo; print('✅ GoalConvo installed')"
```

## Starting the Backend Server

The `start_backend.sh` script automatically handles virtual environment:

```bash
./start_backend.sh
```

It will:
- Create venv if it doesn't exist
- Activate venv
- Install missing dependencies
- Start the server

## Common Issues

### "externally-managed-environment" Error

**Solution**: Use a virtual environment (see above)

### "ensurepip is not available"

**Solution**: Install python3-venv package:
```bash
sudo apt install python3-venv
```

### "No module named 'venv'"

**Solution**: 
```bash
sudo apt install python3-full
```

### Packages not found after installation

**Solution**: Make sure virtual environment is activated:
```bash
source venv/bin/activate
# You should see (venv) in prompt
```

## Next Steps

After installation:

1. **Configure environment**:
   ```bash
   # Edit .env file with your API keys
   nano .env
   ```

2. **Start backend server**:
   ```bash
   ./start_backend.sh
   ```

3. **Test connection**:
   ```bash
   source venv/bin/activate
   python scripts/generate_dialogues.py --test-connection
   ```

For more details, see:
- `SETUP_VENV.md` - Virtual environment guide
- `BACKEND_SERVER_SETUP.md` - Backend server setup
- `README.md` - General documentation


