#!/bin/bash
# Quick test to verify socket setup

echo "🔍 Checking Socket.IO Setup..."
echo ""

# Check backend dependencies
echo "1. Checking backend dependencies..."
cd goalconvo-2
if python3 -c "import flask_socketio; print('✅ flask-socketio installed')" 2>/dev/null; then
    echo "   ✅ Backend dependencies OK"
else
    echo "   ❌ Backend dependencies missing - run: pip install flask-socketio python-socketio"
fi

# Check frontend dependencies
echo ""
echo "2. Checking frontend dependencies..."
cd ../goalconvo
if npm list socket.io-client 2>/dev/null | grep -q socket.io-client; then
    echo "   ✅ Frontend dependencies OK"
else
    echo "   ❌ Frontend dependencies missing - run: npm install socket.io-client @types/uuid"
fi

echo ""
echo "3. Testing socket connection (requires backend to be running)..."
cd ../goalconvo-2
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "   ✅ Backend is running on port 5000"
    echo "   💡 Run: python test_socket_connection.py"
else
    echo "   ⚠️  Backend not running - start it with: python backend_server.py"
fi

echo ""
echo "✅ Setup check complete!"
