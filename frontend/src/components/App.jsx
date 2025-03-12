import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
// Use dynamic imports to reduce initial load size
const ChatInterface = React.lazy(() => import('./ChatInterface'));
const FinanceTools = React.lazy(() => import('./FinanceTools'));
const Sidebar = React.lazy(() => import('./Sidebar'));
const HomePage = React.lazy(() => import('./HomePage'));
import '../styles/components.css';

// Loading fallback component
const LoadingFallback = () => (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <p>Loading component...</p>
    </div>
);

// Simpler App component with better error handling
const App = () => {
    console.log('App component rendering');
    return (
        <ErrorBoundary>
            <Router>
                <div className="app-container">
                    <Suspense fallback={<LoadingFallback />}>
                        <Sidebar />
                    </Suspense>
                    <div className="main-content">
                        <Suspense fallback={<LoadingFallback />}>
                            <Routes>
                                <Route path="/chat" element={
                                    <ErrorBoundary>
                                        <ChatInterface />
                                    </ErrorBoundary>
                                } />
                                <Route path="/finance-tools" element={
                                    <ErrorBoundary>
                                        <FinanceTools />
                                    </ErrorBoundary>
                                } />
                                <Route path="/" element={
                                    <ErrorBoundary>
                                        <HomePage />
                                    </ErrorBoundary>
                                } />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </Suspense>
                    </div>
                </div>
            </Router>
        </ErrorBoundary>
    );
};

export default App;