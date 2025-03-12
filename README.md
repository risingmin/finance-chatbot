# Personal Finance Chatbot

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