import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Clear the initialization timeout
if (window.appInitTimeout) {
  clearTimeout(window.appInitTimeout);
  console.log('App initialization started, cleared timeout');
}

console.log('main.jsx: Starting initialization - simplified version');

// Simplified initial render to debug the issue
const renderBasicApp = () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error('Root container not found!');
    return;
  }

  try {
    // Create a very simple app first to verify React is working
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    
    console.log('Basic app rendered successfully');
    
    // After a brief delay, try to load the full app
    setTimeout(() => {
      import('./components/App').then(({ default: App }) => {
        try {
          console.log('Attempting to render full App component');
          root.render(<App />);
          console.log('Full App rendered successfully');
        } catch (error) {
          console.error('Error rendering full App:', error);
          root.render(
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2>Error Loading Application</h2>
              <p>There was an error loading the application components.</p>
              <p style={{ color: 'red' }}>{error.message}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          );
        }
      }).catch(error => {
        console.error('Error importing App component:', error);
        root.render(
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Error Loading Application</h2>
            <p>Could not load the main application component.</p>
            <p style={{ color: 'red' }}>{error.message}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        );
      });
    }, 500);
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
  document.addEventListener('DOMContentLoaded', renderBasicApp);
} else {
  renderBasicApp();
}

// Add window error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});
