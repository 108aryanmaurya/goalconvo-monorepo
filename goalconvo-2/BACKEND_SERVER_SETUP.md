# Backend Server Setup Guide

This guide explains how to set up and run the Python backend server that connects the Next.js frontend to the GoalConvo-2 backend.

## Prerequisites

1. Python 3.8+ installed
2. GoalConvo-2 dependencies installed
3. Environment variables configured (see below)

## Installation

### 1. Install Additional Dependencies

```bash
cd goalconvo-2
pip install flask flask-cors
```

Or add to `requirements.txt`:
```bash
echo "flask" >> requirements.txt
echo "flask-cors" >> requirements.txt
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in `goalconvo-2/` directory:

```bash
# API Configuration
OLLAMA_ENABLED=true
OLLAMA_API_BASE=http://localhost:11434
OLLAMA_MODEL=mistral
OLLAMA_TIMEOUT=600

# Or use Mistral/OpenAI
# MISTRAL_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here

# Data paths
DATA_DIR=./data
SYNTHETIC_DIR=./data/synthetic
MULTIWOZ_DIR=./data/multiwoz
FEW_SHOT_HUB_DIR=./data/few_shot_hub

# Server configuration
PORT=5000
HOST=0.0.0.0
```

## Running the Server

### Option 1: Direct Python Execution

```bash
cd goalconvo-2
python backend_server.py
```

### Option 2: Using Flask CLI

```bash
cd goalconvo-2
export FLASK_APP=backend_server.py
flask run --host=0.0.0.0 --port=5000
```

### Option 3: Production with Gunicorn

```bash
pip install gunicorn
cd goalconvo-2
gunicorn -w 4 -b 0.0.0.0:5000 backend_server:app
```

## Frontend Configuration

Update your Next.js frontend to point to the backend server.

### Option 1: Update API Routes (Recommended)

Modify the frontend API routes to proxy to the Python backend, or update the fetch URLs:

```typescript
// In your frontend components, change:
const response = await fetch('/api/pipeline/experience-generator', {
  // ...
});

// To:
const response = await fetch('http://localhost:5000/api/pipeline/experience-generator', {
  // ...
});
```

### Option 2: Use Next.js API Routes as Proxy

Create proxy routes in `goalconvo/app/api/pipeline/` that forward to the Python backend:

```typescript
// goalconvo/app/api/pipeline/experience-generator/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const response = await fetch('http://localhost:5000/api/pipeline/experience-generator', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  return NextResponse.json(await response.json());
}
```

### Option 3: Environment Variable Configuration

Create `.env.local` in the `goalconvo/` directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Then use in your frontend:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
const response = await fetch(`${apiUrl}/api/pipeline/experience-generator`, {
  // ...
});
```

## API Endpoints

The backend server provides the following endpoints:

### 1. Experience Generator
- **POST** `/api/pipeline/experience-generator`
- **Body**: `{ domain: string, task: string, num_experiences: number }`
- **Returns**: List of generated experiences

### 2. Multi-Agent Simulator
- **POST** `/api/pipeline/multi-agent-simulator`
- **Body**: `{ experiences: Experience[] }`
- **Returns**: List of generated conversations

### 3. Post-Processor
- **POST** `/api/pipeline/post-processor`
- **Body**: `{ conversations: Conversation[] }`
- **Returns**: Filtered conversations with quality scores

### 4. Dataset Constructor
- **POST** `/api/pipeline/dataset-constructor`
- **Body**: `{ filtered_conversations: FilteredConversation[] }`
- **Returns**: Structured dataset

### 5. Evaluator
- **POST** `/api/pipeline/evaluator`
- **Body**: `{ dataset: DatasetItem[] }`
- **Returns**: Evaluation metrics and analysis

### 6. Health Check
- **GET** `/health`
- **Returns**: Server status

## Testing the Connection

### 1. Test Backend Server

```bash
# Health check
curl http://localhost:5000/health

# Test experience generation
curl -X POST http://localhost:5000/api/pipeline/experience-generator \
  -H "Content-Type: application/json" \
  -d '{"domain": "hotel", "task": "booking", "num_experiences": 1}'
```

### 2. Test from Frontend

Start both servers:
```bash
# Terminal 1: Backend
cd goalconvo-2
python backend_server.py

# Terminal 2: Frontend
cd goalconvo
npm run dev
```

Then access the frontend at `http://localhost:3000` and test the pipeline.

## Troubleshooting

### CORS Errors

If you see CORS errors, ensure:
1. `flask-cors` is installed
2. `CORS(app)` is enabled in `backend_server.py`
3. Frontend is making requests to the correct backend URL

### Connection Refused

1. Check backend server is running: `curl http://localhost:5000/health`
2. Verify port is not in use: `lsof -i :5000`
3. Check firewall settings

### Import Errors

1. Ensure you're in the `goalconvo-2` directory
2. Verify `src/goalconvo/` modules are accessible
3. Check Python path: `python -c "import sys; print(sys.path)"`

### API Timeout

1. Increase `OLLAMA_TIMEOUT` in `.env`
2. Check Ollama is running: `curl http://localhost:11434/api/tags`
3. Monitor backend logs for errors

## Production Deployment

### Using Gunicorn

```bash
gunicorn -w 4 -b 0.0.0.0:5000 \
  --timeout 600 \
  --access-logfile - \
  --error-logfile - \
  backend_server:app
```

### Using Docker

Create `Dockerfile`:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "backend_server:app"]
```

### Environment Variables

Set production environment variables:
```bash
export PORT=5000
export HOST=0.0.0.0
export OLLAMA_ENABLED=true
# ... other config
```

## Monitoring

### Logs

Backend logs are output to console. For production, redirect to files:
```bash
python backend_server.py >> logs/backend.log 2>&1
```

### Health Monitoring

Set up health check monitoring:
```bash
# Cron job to check health
*/5 * * * * curl -f http://localhost:5000/health || echo "Backend down" | mail -s "Alert" admin@example.com
```

## Next Steps

1. **Test the connection**: Run both servers and test the full pipeline
2. **Configure frontend**: Update frontend to use backend API
3. **Monitor performance**: Watch logs and response times
4. **Scale if needed**: Use Gunicorn with multiple workers for production

For more details, see:
- `EVALUATION_GUIDE.md` - Evaluation setup
- `FEW_SHOT_HUB_USAGE.md` - Few-shot hub usage
- `USAGE.md` - General usage guide


