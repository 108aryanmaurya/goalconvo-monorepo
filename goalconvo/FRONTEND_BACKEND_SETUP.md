# Frontend-Backend Integration Setup

This guide explains how the Next.js frontend connects to the Flask backend server.

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Next.js       │         │   Next.js API     │         │   Flask          │
│   Frontend      │────────▶│   Routes (Proxy)  │────────▶│   Backend        │
│   Components    │         │                   │         │   Server         │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

The frontend components make API calls to Next.js API routes, which then proxy the requests to the Flask backend server.

## Setup Steps

### 1. Configure Environment Variables

Create a `.env.local` file in the `goalconvo/` directory:

```bash
cd goalconvo
cp .env.local.example .env.local
```

Edit `.env.local`:
```bash
# Flask Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### 2. Start the Flask Backend

In one terminal:
```bash
cd goalconvo-2
./start_backend.sh
# Or: python backend_server.py
```

The backend should start on `http://localhost:5000`

### 3. Start the Next.js Frontend

In another terminal:
```bash
cd goalconvo
npm run dev
```

The frontend should start on `http://localhost:3000`

### 4. Verify Connection

Check that the backend is accessible:
```bash
curl http://localhost:5000/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "backend": "GoalConvo-2"
}
```

## How It Works

### API Route Proxying

All API routes in `app/api/pipeline/` now proxy requests to the Flask backend:

1. **Frontend Component** makes request to `/api/pipeline/experience-generator`
2. **Next.js API Route** receives the request
3. **API Route** forwards request to `http://localhost:5000/api/pipeline/experience-generator`
4. **Flask Backend** processes the request and returns response
5. **API Route** returns the response to the frontend component

### Example Flow

```typescript
// Frontend component
const response = await fetch('/api/pipeline/experience-generator', {
  method: 'POST',
  body: JSON.stringify({ domain: 'hotel', task: 'booking' })
});

// Next.js API route (app/api/pipeline/experience-generator/route.ts)
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Proxy to Flask backend
  const response = await fetch(`${BACKEND_URL}/api/pipeline/experience-generator`, {
    method: 'POST',
    body: JSON.stringify(body)
  });
  
  return NextResponse.json(await response.json());
}
```

## API Endpoints

All endpoints are proxied through Next.js to Flask:

| Frontend Endpoint | Flask Backend Endpoint | Description |
|------------------|------------------------|-------------|
| `/api/pipeline/experience-generator` | `http://localhost:5000/api/pipeline/experience-generator` | Generate experiences |
| `/api/pipeline/multi-agent-simulator` | `http://localhost:5000/api/pipeline/multi-agent-simulator` | Simulate conversations |
| `/api/pipeline/post-processor` | `http://localhost:5000/api/pipeline/post-processor` | Filter conversations |
| `/api/pipeline/dataset-constructor` | `http://localhost:5000/api/pipeline/dataset-constructor` | Build dataset |
| `/api/pipeline/evaluator` | `http://localhost:5000/api/pipeline/evaluator` | Evaluate dataset |

## Troubleshooting

### Backend Connection Failed

**Error**: `Failed to connect to backend`

**Solutions**:
1. Check Flask backend is running: `curl http://localhost:5000/health`
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check CORS is enabled in Flask backend (should be automatic)
4. Check firewall/port blocking

### CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solutions**:
1. Ensure `flask-cors` is installed in backend
2. Verify `CORS(app)` is enabled in `backend_server.py`
3. Check backend logs for CORS errors

### Port Already in Use

**Error**: `Address already in use`

**Solutions**:
1. Change Flask port: `export PORT=5001` then update `.env.local`
2. Or kill existing process: `lsof -ti:5000 | xargs kill`

### Environment Variable Not Loading

**Issue**: `NEXT_PUBLIC_API_URL` not working

**Solutions**:
1. Restart Next.js dev server after changing `.env.local`
2. Ensure variable starts with `NEXT_PUBLIC_` for client-side access
3. Check `.env.local` is in `goalconvo/` directory (not `goalconvo-2/`)

## Development Workflow

### 1. Development Mode

```bash
# Terminal 1: Flask Backend
cd goalconvo-2
python backend_server.py

# Terminal 2: Next.js Frontend
cd goalconvo
npm run dev
```

### 2. Testing Individual Endpoints

Test Flask backend directly:
```bash
curl -X POST http://localhost:5000/api/pipeline/experience-generator \
  -H "Content-Type: application/json" \
  -d '{"domain": "hotel", "task": "booking", "num_experiences": 1}'
```

### 3. Debugging

Enable verbose logging:
- **Backend**: Already logs to console
- **Frontend**: Check browser console and Network tab
- **Next.js**: Check terminal output for API route logs

## Production Deployment

### Option 1: Same Domain

Deploy both on same domain:
- Next.js: `https://yourdomain.com`
- Flask: `https://yourdomain.com/api` (via reverse proxy)

Update `.env.local`:
```bash
NEXT_PUBLIC_API_URL=/api
```

### Option 2: Separate Domains

Deploy separately:
- Next.js: `https://frontend.yourdomain.com`
- Flask: `https://backend.yourdomain.com`

Update `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://backend.yourdomain.com
```

### Option 3: Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  frontend:
    build: ./goalconvo
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000
  
  backend:
    build: ./goalconvo-2
    ports:
      - "5000:5000"
```

## Next Steps

1. **Test the connection**: Start both servers and test the pipeline
2. **Monitor logs**: Watch both backend and frontend logs
3. **Handle errors**: Add error boundaries and user-friendly error messages
4. **Add loading states**: Improve UX with proper loading indicators
5. **Optimize**: Add request caching and retry logic if needed

For more details, see:
- `BACKEND_SERVER_SETUP.md` - Backend server setup
- `goalconvo-2/README.md` - Backend documentation


