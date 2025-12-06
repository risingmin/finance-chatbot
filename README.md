# Personal Finance Chatbot
# Personal Finance Coach Chatbot

AI-powered personal finance assistant with a React frontend and Node/Express backend that connects to a configurable LLM (LLaMA-style or other provider). The app helps with budgeting, saving, debt paydown, and basic investing questions.

## Tech Stack
- Frontend: React + Vite, Axios
- Backend: Node.js, Express, Axios
- AI: Google Gemini API

## Prerequisites
- Node.js 18+ (recommended)
- An LLM API key + URL (e.g., hosted LLaMA or compatible provider)

## Quick Start
1) Install dependencies (from repo root):
```bash
npm install
```

2) Create a .env for the backend (repo root):
```
cp .env.example .env
# edit .env and add your LLM_API_URL and LLM_API_KEY
```

3) Run backend (port 8000):
```bash
npm run dev-backend
```

4) In another terminal, run frontend (port 3000):
```bash
npm run dev-frontend
# open http://localhost:3000
```

## Environment Variables
Backend (.env)
```
PORT=8000
FRONTEND_ORIGIN=http://localhost:3000
LLM_API_URL=https://api.your-llm-provider.com/v1/chat
LLM_API_KEY=your_llm_api_key_here
```

Frontend
```
# For production builds; leave empty in dev to use proxy
VITE_API_URL=https://your-deployed-backend.com
# Dev proxy override (defaults to http://localhost:8000)
VITE_DEV_API_TARGET=http://localhost:8000
```

## Project Structure
- backend/ — Express API and Gemini integration
- frontend/ — React app with chat UI and formatting utilities
- frontend/src/utils/messageFormatter.js — renders markdown-style replies nicely
- frontend/src/services/api.js — shared Axios client with sensible defaults

## Useful Scripts
- `npm run dev-backend` — start backend on localhost:8000
- `npm run dev-frontend` — start frontend on localhost:3000 (proxy to backend)
- `npm run build` — build frontend for production

## Notes / Deploy
- Backend requires `LLM_API_URL` and `LLM_API_KEY`; requests will fail without them.
- In development, Vite proxies `/api` and `/health` to `http://localhost:8000` (override with `VITE_DEV_API_TARGET`).
- For production, set `VITE_API_URL` to your deployed backend origin (no trailing slash) and set `FRONTEND_ORIGIN` on the backend to the deployed frontend origin to allow CORS.
- Keep secrets in `.env`; never commit real keys.
- Deploy suggestion: backend to Render/Railway/Fly; frontend to Vercel/Netlify. Ensure the frontend env points to the backend URL and the backend CORS allows the frontend origin.
This project is a personal finance chatbot that utilizes the free Llama model from together.ai. The application is structured into a frontend built with React and a backend that handles API requests and interactions with the Llama model.

## Project Structure

```
finance-chatbot
├── frontend
│   ├── public
│   │   ├── index.html
│   │   └── favicon.svg
│   ├── src
│   │   ├── components
│   │   │   ├── App.jsx
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── FinanceTools.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── contexts
│   │   │   └── ChatContext.jsx
│   │   ├── hooks
│   │   │   └── useChatApi.js
│   │   ├── styles
│   │   │   ├── global.css
│   │   │   └── components.css
│   │   ├── utils
│   │   │   └── formatters.js
│   │   ├── index.js
│   │   └── config.js
│   ├── package.json
│   └── vite.config.js
├── backend
│   ├── src
│   │   ├── api
│   │   │   ├── routes.js
│   │   │   └── middleware.js
│   │   ├── services
│   │   │   ├── llamaService.js
│   │   │   └── financeService.js
│   │   ├── utils
│   │   │   ├── prompts.js
│   │   │   └── validators.js
│   │   ├── config.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)
- Docker (for running the backend)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd finance-chatbot
   ```

2. Navigate to the frontend directory and install dependencies:
   ```
   cd frontend
   npm install
   ```

3. Navigate to the backend directory and install dependencies:
   ```
   cd ../backend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   node src/server.js
   ```

2. In a new terminal, start the frontend application:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and go to `http://localhost:3000` to access the chatbot.

### Usage

- Interact with the chatbot to get personal finance advice and tools.
- Use the finance tools provided to manage your finances effectively.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

### License

This project is licensed under the MIT License. See the LICENSE file for details.