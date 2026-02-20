# Docker Setup Guide for GoalConvo

## Quick Start

### Prerequisites
- Docker Desktop installed (or Docker Engine + Docker Compose)
- API keys for your chosen LLM provider (Mistral, OpenAI, Gemini, or Ollama)

### 1. Environment Setup

Create a `.env` file in the project root:

```bash
# Choose your LLM provider (set at least one)
MISTRAL_API_KEY=your_mistral_key_here
MISTRAL_API_BASE=https://api.together.xyz/v1
MISTRAL_MODEL=mistralai/Mistral-7B-Instruct-v0.1

# OR use OpenAI
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-3.5-turbo

# OR use Gemini
GEMINI_API_KEY=your_gemini_key_here

# OR use local Ollama
OLLAMA_ENABLED=true
OLLAMA_API_BASE=http://host.docker.internal:11434
OLLAMA_MODEL=mistral
```

### 2. Build and Run

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## Individual Service Management

### Backend Only
```bash
# Build backend
docker build -t goalconvo-backend ./goalconvo-backend

# Run backend
docker run -p 5000:5000 \
  -e MISTRAL_API_KEY=your_key \
  -v $(pwd)/goalconvo-backend/data:/app/data \
  goalconvo-backend
```

### Frontend Only
```bash
# Build frontend
docker build -t goalconvo-frontend ./goalconvo-frontend

# Run frontend
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:5000 \
  goalconvo-frontend
```

## Development Mode

For development with hot-reload:

### Backend (with volume mount)
```bash
docker-compose -f docker-compose.dev.yml up
```

Create `docker-compose.dev.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./goalconvo-backend
    volumes:
      - ./goalconvo-backend:/app
      - /app/venv  # Exclude venv from mount
    command: /app/venv/bin/python backend_server.py
    environment:
      - FLASK_ENV=development
```

## Troubleshooting

### Port Already in Use
```bash
# Change ports in docker-compose.yml
ports:
  - "5001:5000"  # Backend on 5001
  - "3001:3000"  # Frontend on 3001
```

### Permission Issues
```bash
# Fix data directory permissions
sudo chown -R $USER:$USER goalconvo-backend/data
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs
docker-compose logs -f backend
```

### Rebuild After Code Changes
```bash
# Rebuild specific service
docker-compose build backend
docker-compose up -d backend

# Rebuild all
docker-compose build --no-cache
```

### Clean Up
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## Production Deployment

### Using Docker Swarm
```bash
docker stack deploy -c docker-compose.yml goalconvo
```

### Using Kubernetes
See `k8s/` directory for Kubernetes manifests (to be added).

## Health Checks

The backend includes a health check endpoint:
```bash
curl http://localhost:5000/health
```

Docker will automatically restart unhealthy containers.

## Data Persistence

Data is persisted in:
- `./goalconvo-backend/data/` - Generated dialogues and datasets
- Docker volumes (optional) - For production deployments

## Environment Variables

See `goalconvo-backend/src/goalconvo/config.py` for all available environment variables.

Key variables:
- `TEMPERATURE` - Generation temperature (default: 0.75)
- `MAX_TURNS` - Maximum dialogue turns (default: 15)
- `MIN_TURNS` - Minimum dialogue turns (default: 7)
- `EVAL_SKIP_LLM_JUDGE` - Skip LLM judge for faster evaluation (default: 0)

## Support

For issues, check:
1. Docker logs: `docker-compose logs`
2. Backend logs: `goalconvo-backend/logs/goalconvo.log`
3. GitHub Issues
