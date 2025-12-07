# Quick Reference Guide

## Start the App (3 Commands, 3 Terminals)

```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start Backend
cd backend
npm start

# Terminal 3: Start Frontend
cd frontend
npm run dev

# Then open http://localhost:3000
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `backend/src/config/llmConfig.js` | LLM provider configuration |
| `backend/src/server.js` | Express app + error handling |
| `backend/src/api/routes.js` | `/api/chat` endpoint |
| `backend/src/services/llamaService.js` | Ollama API caller |
| `backend/.env` | Local config (Ollama) |
| `frontend/src/hooks/useChatApi.js` | API integration |
| `frontend/src/components/ChatInterface.jsx` | Chat UI |
| `frontend/src/styles/components.css` | Modern styling |

## Common Issues & Fixes

### Backend won't start
```bash
# Check syntax
node -c backend/src/server.js

# Check .env exists
ls backend/.env

# Check port 8000 is free
lsof -ti:8000
```

### "Unable to reach assistant" in UI
```bash
# Check backend is running
curl http://localhost:8000/health

# Check Ollama is running
curl http://localhost:11434/api/tags

# Check browser console (F12)
```

### LLM API error
```bash
# Check Ollama model is pulled
ollama list

# Test Ollama endpoint
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3.1:8b","messages":[{"role":"user","content":"hi"}]}'
```

## Switch LLM Providers

Edit `backend/.env`:

```env
# Use OpenAI (add API key)
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo

# Use Anthropic
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-sonnet-20240229

# Back to Ollama
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=llama3.1:8b
```

Then restart backend (`npm start`).

## API Endpoints

```bash
# Chat
POST /api/chat
Body: {"message":"your message"}
Response: {"reply":"assistant response"}

# Health Check
GET /api/health
Response: {"status":"ok","llmProvider":"ollama",...}

# Test LLM
GET /api/test-llm
Response: {"success":true,"message":"...","response":"..."}

# Finance Data
GET /api/finance
Response: {...}
```

## Development Tips

- **Backend logs:** Check the terminal where `npm start` runs
- **Frontend logs:** Open browser console (F12 → Console)
- **API debugging:** Use curl or Postman to test endpoints
- **Hot reload:** Both frontend and backend auto-reload on file changes
- **Error details:** Development mode shows full error messages; production sanitizes them

## Deployment Checklist

- [ ] Backend deployed to Render (or similar)
- [ ] Frontend deployed to Vercel
- [ ] Backend `.env` has `FRONTEND_ORIGIN=<vercel-domain>`
- [ ] Frontend `.env` has `VITE_API_URL=<render-domain>`
- [ ] Cloud LLM configured (if not using Ollama on server)
- [ ] CORS enabled for frontend domain
- [ ] Health check passes: `curl <backend>/health`
- [ ] Chat works in production

## File Locations

```
finance-chatbot/
├── backend/
│   ├── .env                  ← Edit this for local config
│   ├── .env.example          ← Reference for all options
│   ├── src/
│   │   ├── server.js         ← Express app
│   │   ├── config/
│   │   │   └── llmConfig.js  ← LLM provider logic
│   │   ├── api/
│   │   │   └── routes.js     ← /api/chat route
│   │   └── services/
│   │       └── llamaService.js ← Ollama caller
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatInterface.jsx ← Main UI
│   │   ├── hooks/
│   │   │   └── useChatApi.js ← API integration
│   │   └── styles/
│   │       └── components.css ← Modern styling
│   ├── vite.config.js        ← Dev proxy to :8000
│   └── package.json
│
├── README.md                 ← Full setup guide
├── ARCHITECTURE_CHANGES.md   ← Detailed changelog
└── CHANGES.md                ← This quick reference
```

## Useful Commands

```bash
# Backend
cd backend
npm install              # Install deps
npm start               # Start server (port 8000)
node -c src/server.js   # Check syntax

# Frontend
cd frontend
npm install             # Install deps
npm run dev             # Start dev server (port 3000)
npm run build           # Build for production

# Ollama
ollama serve            # Start Ollama (port 11434)
ollama list             # List installed models
ollama pull llama3.1:8b # Download model

# Testing
curl http://localhost:8000/health        # Backend health
curl http://localhost:11434/api/tags     # Ollama models
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'                # Chat test
```

## Documentation

- **README.md** - Full setup and deployment guide
- **ARCHITECTURE_CHANGES.md** - What changed and why
- **backend/.env.example** - All configuration options
- This file - Quick reference for common tasks

---

**Need help?** Check README.md Troubleshooting section or review backend logs for detailed error messages.
