import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './styles/global.css';

// Ensure the DOM is ready
const renderApp = () => {
  try {
    const container = document.getElementById('root');
    
    if (!container) {
      console.error('Root container not found! Check your HTML for an element with id "root"');
      return;
    }
    
    const root = createRoot(container);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
    
    // Display fallback error UI
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
      <div style="text-align: center; padding: 20px; font-family: sans-serif;">
        <h2>Something went wrong</h2>
        <p>The app couldn't be started. Please try refreshing the page.</p>
        <button onclick="window.location.reload()">Refresh</button>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }
};

// Make sure we render when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
