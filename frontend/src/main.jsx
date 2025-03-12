import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './styles/global.css';

// Clear the initialization timeout when app starts
if (window.appInitTimeout) {
  clearTimeout(window.appInitTimeout);
  console.log('App initialization started, clearing timeout');
}

console.log('main.jsx: Starting app initialization');

// Ensure the DOM is ready
const renderApp = () => {
  try {
    console.log('main.jsx: Trying to render app');
    const container = document.getElementById('root');
    
    if (!container) {
      console.error('Root container not found! Check your HTML for an element with id "root"');
      return;
    }
    
    // Simplified rendering approach
    const root = createRoot(container);
    
    console.log('main.jsx: Root created, rendering app');
    
    root.render(<App />);
    
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
    
    // Display fallback error UI
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
      <div style="text-align: center; padding: 20px; font-family: sans-serif;">
        <h2>Something went wrong</h2>
        <p>The app couldn't be started. Please try refreshing the page.</p>
        <p>Error: ${error.message || 'Unknown error'}</p>
        <button onclick="window.location.reload()">Refresh</button>
      </div>
    `;
    
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = '';
      rootElement.appendChild(errorDiv);
    } else {
      document.body.appendChild(errorDiv);
    }
  }
};

// Make sure we render when the DOM is ready
if (document.readyState === 'loading') {
  console.log('main.jsx: Document still loading, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  console.log('main.jsx: Document already loaded, rendering immediately');
  renderApp();
}

// Add window error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Show error message if it's during initialization
  if (document.getElementById('root')?.innerHTML.includes('Loading Finance Chatbot')) {
    document.getElementById('root').innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Application Error</h2>
        <p>Sorry, something went wrong while loading the application.</p>
        <p>Error: ${event.error?.message || 'Unknown error'}</p>
        <button onclick="window.location.reload()">Try Again</button>
      </div>
    `;
  }
});
