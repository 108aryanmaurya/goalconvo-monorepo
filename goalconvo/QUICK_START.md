# Quick Start Guide

Get the GoalConvo frontend and backend running in 5 minutes!

## Step 1: Start Flask Backend

Open Terminal 1:
```bash
cd goalconvo-2
pip install -r requirements.txt
./start_backend.sh
```

Wait for: `Starting GoalConvo backend server on 0.0.0.0:5000`

## Step 2: Configure Frontend

Create `.env.local` file:
```bash
cd goalconvo
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

## Step 3: Start Frontend

Open Terminal 2:
```bash
cd goalconvo
npm install
npm run dev
```

## Step 4: Verify

1. Check backend: http://localhost:5000/health
2. Check frontend: http://localhost:3000

## Step 5: Test Pipeline

1. Go to http://localhost:3000
2. Click "Run Pipeline"
3. Watch the magic happen! ✨

## Troubleshooting

**Backend not connecting?**
- Check backend is running: `curl http://localhost:5000/health`
- Verify `.env.local` has correct URL
- Check CORS is enabled in backend

**Port already in use?**
- Change backend port: `export PORT=5001` then update `.env.local`
- Or change frontend port: `npm run dev -- -p 3001`

**Need help?**
- See `FRONTEND_BACKEND_SETUP.md` for detailed setup
- See `goalconvo-2/BACKEND_SERVER_SETUP.md` for backend details


