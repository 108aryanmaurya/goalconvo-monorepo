# Socket.IO Setup Guide

## ✅ Installation Complete

### Backend Dependencies (Python)
- `flask-socketio>=5.3.0` ✅ Installed
- `python-socketio>=5.10.0` ✅ Installed
- `websocket-client` ✅ Installed

### Frontend Dependencies (Node.js)
- `socket.io-client>=4.7.2` ✅ Installed
- `@types/uuid` ✅ Installed

## 🚀 Starting the Backend with Socket Support

```bash
cd /home/aryan/Desktop/monorepo-goalconvo/goalconvo-2
source venv/bin/activate
python backend_server.py
```

**Expected output:**
```
Starting GoalConvo backend server on 0.0.0.0:5000
API endpoints available at:
  POST /api/run-pipeline
  ...
Using existing modules from src/goalconvo/:
  - ExperienceGenerator
  - DialogueSimulator
  - QualityJudge
  - DatasetStore
  - Evaluator
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
```

## 🧪 Testing Socket Connection

### Option 1: Test Script
```bash
cd /home/aryan/Desktop/monorepo-goalconvo/goalconvo-2
python test_socket_connection.py
```

**Expected output:**
```
🔌 Connecting to http://localhost:5000...
✅ Connected to server!
   Socket ID: <socket-id>
✅ Server confirmed: {'session_id': '<socket-id>', 'message': 'Connected to pipeline server'}
✅ Joined session: {'session_id': 'test_session_123', ...}
✅ Test completed successfully!
```

### Option 2: Frontend Test
1. Start the frontend:
   ```bash
   cd /home/aryan/Desktop/monorepo-goalconvo/goalconvo
   npm run dev
   ```

2. Open browser to `http://localhost:3000`

3. Check browser console - you should see:
   ```
   🔌 Connecting to WebSocket: http://localhost:5000
   ✅ WebSocket connected: <socket-id>
   ✅ Server confirmed connection: {...}
   ✅ Joined session: {...}
   ```

4. Check backend logs - you should see:
   ```
   ✅ Client connected: <socket-id>
      Origin: http://localhost:3000
      Remote address: 127.0.0.1
   ✅ Client <socket-id> joined session: <session-id>
   ```

## 📡 Socket Events

### Frontend → Backend
- `join_session` - Join a specific session room

### Backend → Frontend
- `connected` - Connection confirmed
- `joined` - Session join confirmed
- `pipeline_start` - Pipeline started
- `step_start` - A pipeline step started
- `step_data` - Step data update
- `log` - Log message
- `pipeline_complete` - Pipeline finished
- `pipeline_error` - Pipeline error

## 🔍 Troubleshooting

### Connection Fails
1. **Check backend is running**: `curl http://localhost:5000/health`
2. **Check CORS**: Backend has `CORS(app)` and `cors_allowed_origins="*"`
3. **Check port**: Frontend should connect to same port as backend (default: 5000)
4. **Check firewall**: Ensure port 5000 is not blocked

### Events Not Received
1. **Check session ID**: Frontend and backend must use same session_id
2. **Check room join**: Client must join session room before receiving events
3. **Check browser console**: Look for connection errors
4. **Check backend logs**: Look for emit errors

## 📝 Next Steps

1. **Start Backend**: Run `python backend_server.py` in `goalconvo-2/`
2. **Start Frontend**: Run `npm run dev` in `goalconvo/`
3. **Test Connection**: Open browser and check console logs
4. **Run Pipeline**: Click "Run Pipeline" button and watch real-time updates

