# Finance Chatbot

AI-powered personal finance assistant with a modern React frontend and Node/Express backend. Get personalized advice on budgeting, saving, debt payoff, and financial goal planning.

## ✨ Features

- **Clean Modern UI:** Notion-like design with sidebar navigation and responsive layout
- **Real-time Chat:** Message streaming with typing indicators
- **Local-first:** Uses Ollama for local LLM inference (no API keys needed)
- **Flexible LLM:** Easily swap to OpenAI, Anthropic, or other providers
- **Production Ready:** Deployable to Vercel (frontend) and Render (backend)
- **Full Error Handling:** Clear error messages and comprehensive logging

## 🛠 Tech Stack

**Frontend:**
- React 18 + Vite
- Modern CSS with animations
- Fetch API + Vite proxy for HTTP requests
- Auto-responsive design (desktop, tablet, mobile)

**Backend:**
- Node.js + Express
- Axios for LLM API calls
- Comprehensive error middleware
- Environment-based configuration

**LLM:**
- **Default:** Ollama (local, no quotas)
- **Alternatives:** OpenAI, Anthropic, or any OpenAI-compatible API

## 📋 Prerequisites

### For Local Development

1. **Node.js 18+**
   ```bash
   node --version  # should be v18.x or higher
   ```

2. **Ollama** (for local LLM)
   - Download from [ollama.ai](https://ollama.ai)
   - Install and start: `ollama serve`
   - Pull a model: `ollama pull gemma2:2b` (2GB) or `ollama pull llama3.1:8b` (4GB)
   - Verify: `curl http://localhost:11434/api/tags`

3. **Git** (to clone the repo)

## 🚀 Quick Start

### Step 1: Clone and Install

```bash
git clone <repo-url>
cd finance-chatbot

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
cd ..  # Back to project root
```

### Step 2: Start Ollama (Terminal 1)

```bash
ollama serve
```

You should see:
```
Listening on 127.0.0.1:11434 (listen tcp 127.0.0.1:11434: bind: address already in use)
```

### Step 3: Start Backend (Terminal 2)

```bash
cd backend
npm start
```

You should see:
```
==================================================
🚀 Finance Chatbot Backend Started
==================================================
📍 Port: 8000
📁 Environment: development
🤖 LLM Provider: ollama
🌐 CORS Origins: http://localhost:5173

📋 Available Endpoints:
   GET  /              - API info & health
   GET  /health        - Health check
   POST /api/chat      - Chat with LLM
   GET  /api/test-llm  - Test LLM connection
   GET  /api/finance   - Finance data
==================================================
```

### Step 4: Start Frontend (Terminal 3)

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v4.4.9 ready in 123 ms

➜  Local:   http://localhost:5173/
```

### Step 5: Open in Browser

Visit **http://localhost:5173** and start asking questions!

The first message may take 10-30 seconds (Ollama initializes). Subsequent messages are much faster.

## 📡 API Endpoints

### POST /api/chat
Send a message and get a response.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "How should I budget my income?" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "reply": "A good starting point is the 50/30/20 rule..."
}
```

**Error Response:**
```json
{
  "error": "INVALID_REQUEST",
  "message": "messages array is required and must not be empty",
  "timestamp": "2025-12-07T12:34:56.789Z"
}
```

### GET /health
Check backend health.

**Response:**
```json
{
  "status": "ok",
  "uptime": "0h 2m",
  "environment": "development",
  "llmProvider": "ollama"
}
```

### GET /api/test-llm
Test LLM connectivity.

**Response:**
```json
{
  "success": true,
  "message": "LLM is working!",
  "response": "Hello! I am working correctly."
}
```

## ⚙️ Configuration

### Backend Environment Variables

Create or edit `backend/.env`:

```bash
# Server
PORT=8000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173

# LLM Provider (REQUIRED - choose one)
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=gemma2:2b
```

**Available LLM Providers:**

#### Option 1: Ollama (Local, Default)
```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=gemma2:2b        # or llama3.1:8b, mistral, etc
```

#### Option 2: OpenAI
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
```

#### Option 3: Anthropic
```env
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

### Frontend Environment Variables

Create `frontend/.env.development` (optional):
```bash
# Development: Leave empty to use Vite proxy
VITE_API_URL=

# Production (in .env.production):
VITE_API_URL=https://your-api-domain.com
```

The frontend will:
- In **development:** Use Vite proxy (`/api` → `http://localhost:8000`)
- In **production:** Use the configured `VITE_API_URL`

## 🔧 How It Works

### Request Flow

```
Frontend (localhost:5173)
    ↓
POST /api/chat (Vite proxy)
    ↓
Backend (localhost:8000)
    ↓
Ollama (localhost:11434)
    ↓
LLM Model (gemma2:2b, llama3.1:8b, etc)
    ↓
Response → Backend → Frontend → UI
```

### Key Features

**Frontend (`useChatApi` hook):**
- ✅ Uses relative URLs (`/api/chat`) in development
- ✅ Vite proxy forwards to backend (no CORS issues)
- ✅ Uses `VITE_API_URL` for production API
- ✅ NO direct calls to Ollama
- ✅ Comprehensive error messages
- ✅ 120s timeout for slow LLM responses

**Backend:**
- ✅ Express middleware for CORS, logging, error handling
- ✅ Validates incoming messages
- ✅ Calls Ollama via OpenAI-compatible API
- ✅ Returns JSON responses (never HTML)
- ✅ Detailed console logging for debugging
- ✅ Development mode includes error details
- ✅ Production mode sanitizes errors

## 🐛 Troubleshooting

### Issue: "Unable to reach the assistant" / 404 Error

**Check:**
1. Is backend running on port 8000?
   ```bash
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"ok",...}`

2. Is Vite proxy configured?
   - Check `frontend/vite.config.js` - should have `/api` proxy
   - Make sure `VITE_API_URL` is empty in `.env.development`

3. Check browser console (F12 → Console tab)

**Fix:**
```bash
# Restart backend
cd backend
npm start

# Restart frontend dev server
cd frontend
npm run dev
```

### Issue: "Ollama service is not available" / 503 Error

**Check:**
1. Is Ollama running?
   ```bash
   curl http://localhost:11434/api/tags
   ```

2. Is the model pulled?
   ```bash
   ollama list
   ```
   Should show `gemma2:2b` or your configured model

**Fix:**
```bash
# Start Ollama
ollama serve

# Pull the model (if needed)
ollama pull gemma2:2b
```

### Issue: "Request took too long" / Timeout

This happens when:
- Ollama is initializing the model (first request)
- Your computer is low on memory
- The model is too large for your system

**Solutions:**
1. Try a smaller model: `ollama pull gemma2:2b` (faster)
2. Wait 30 seconds and try again
3. Increase timeout in `frontend/src/hooks/useChatApi.js` (currently 120s)

### Issue: Backend crashes on startup with "Unknown LLM_PROVIDER"

**Check:**
1. Does `backend/.env` exist?
2. Is `LLM_PROVIDER=ollama` (or valid provider) set?
3. Are required env vars set for your provider?

**Fix:**
```bash
cd backend
cat .env  # Check contents

# If missing, create it:
echo "LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=gemma2:2b" > .env

npm start
```

## 📦 Deployment

### Frontend → Vercel

1. Push code to GitHub
2. Create new project on [Vercel](https://vercel.com)
3. Select `finance-chatbot` repo
4. Configure build:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-api.com
   ```
6. Deploy!

### Backend → Render

1. Create new Web Service on [Render](https://render.com)
2. Connect GitHub repo
3. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free (or paid)
4. Add environment variables:
   ```
   PORT=8000
   NODE_ENV=production
   FRONTEND_ORIGIN=https://your-vercel-domain.com
   LLM_PROVIDER=openai
   OPENAI_API_KEY=sk-...
   OPENAI_MODEL=gpt-3.5-turbo
   ```
5. Deploy!

**Note:** For production, use OpenAI/Anthropic instead of Ollama. Ollama is local-only.

## 📁 Project Structure

```
finance-chatbot/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx    # Chat UI component
│   │   │   ├── HomePage.jsx         # Home page
│   │   │   └── FinanceTools.jsx     # Tools page
│   │   ├── hooks/
│   │   │   └── useChatApi.js        # API integration
│   │   ├── styles/
│   │   │   ├── chat-interface.css   # Chat UI styles
│   │   │   ├── app-layout.css       # Layout styles
│   │   │   └── pages.css            # Page styles
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   ├── vite.config.js               # Vite config with proxy
│   ├── .env.production              # Production config
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── server.js                # Express setup + middleware
│   │   ├── api/
│   │   │   └── routes.js            # API routes
│   │   ├── services/
│   │   │   └── llamaService.js      # LLM API integration
│   │   ├── config/
│   │   │   └── llmConfig.js         # Provider config
│   │   └── utils/
│   │       └── validators.js        # Input validation
│   ├── .env                         # Environment config
│   ├── .env.example                 # Config template
│   └── package.json
│
└── README.md
```

## 🔐 Security

- ✅ CORS configured (only accept from frontend domain)
- ✅ Input validation on all routes
- ✅ No sensitive data in error messages (production)
- ✅ Environment variables for API keys
- ✅ Request timeout to prevent DoS
- ✅ Request body size limits (Express defaults)

## 📊 Example Prompts

Try these questions:

- "How should I budget as a college student?"
- "I have $3,000 credit card debt. What's my best payoff strategy?"
- "How much should I invest each month for retirement?"
- "What's the difference between a 401k and an IRA?"
- "How can I build an emergency fund?"

## 🤝 Contributing

Found a bug? Have a feature idea? Open an issue or PR!

## 📝 License

MIT - Feel free to use this project however you like.

## 👀 Status

✅ **In Development**
- [x] Chat interface
- [x] Ollama integration
- [x] Error handling
- [x] Responsive design
- [ ] Message history
- [ ] User authentication
- [ ] Finance data integration
- [ ] Debt calculator

---

**Questions?** Check the [Troubleshooting](#-troubleshooting) section or open an issue!
