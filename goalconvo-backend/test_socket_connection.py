#!/usr/bin/env python3
"""
Test script to verify Socket.IO connection is working.
Run this while the backend server is running.
"""

import socketio
import time

# Connect to the backend
sio = socketio.Client()

@sio.event
def connect():
    print("✅ Connected to server!")
    print(f"   Socket ID: {sio.sid}")
    
    # Test joining a session
    sio.emit('join_session', {'session_id': 'test_session_123'})

@sio.event
def connected(data):
    print(f"✅ Server confirmed: {data}")

@sio.event
def joined(data):
    print(f"✅ Joined session: {data}")

@sio.event
def disconnect():
    print("❌ Disconnected from server")

@sio.event
def connect_error(data):
    print(f"❌ Connection error: {data}")

if __name__ == '__main__':
    try:
        print("🔌 Connecting to http://localhost:5000...")
        sio.connect('http://localhost:5000')
        
        # Wait for events
        print("⏳ Waiting for events (press Ctrl+C to stop)...")
        time.sleep(5)
        
        sio.disconnect()
        print("✅ Test completed successfully!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

