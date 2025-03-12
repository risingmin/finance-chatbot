import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import ChatInterface from './ChatInterface';
import FinanceTools from './FinanceTools';
import Sidebar from './Sidebar';
import HomePage from './HomePage';
import '../styles/components.css';

// Loading fallback component
const LoadingFallback = () => (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <p>Loading...</p>
    </div>
);

const App = () => {
    return (
        <ErrorBoundary>
            <Router>
                <div className="app-container">
                    <Sidebar />
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
                                {/* Catch all other routes and redirect to home */}
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