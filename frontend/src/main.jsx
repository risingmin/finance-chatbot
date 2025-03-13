import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Add error logging
const ErrorFallback = ({ error }) => {
  console.error('Rendering error:', error);
  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      border: '2px solid red',
      borderRadius: '5px'
    }}>
      <h2>Something went wrong</h2>
      <p>Please check the console for details.</p>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ErrorBoundary>
);
