import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure this import is correct
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // This import should now work properly

// Clear the initialization timeout
if (window.appInitTimeout) {
  clearTimeout(window.appInitTimeout);
  console.log('App initialization started, cleared timeout');
}

// Simplified render function
const renderApp = () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error('Root container not found!');
    return;
  }

  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Failed to initialize React:', error);
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Critical Error</h2>
        <p>React failed to initialize: ${error.message}</p>
        <button onclick="window.location.reload()">Refresh</button>
      </div>
    `;
  }
};

// Start rendering process
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

// Add window error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});
