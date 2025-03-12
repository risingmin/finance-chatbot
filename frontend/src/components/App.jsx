import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import FinanceTools from './FinanceTools';
import Sidebar from './Sidebar';
import '../styles/components.css';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Sidebar />
                <div className="main-content">
                    <Routes>
                        <Route path="/chat" element={<ChatInterface />} />
                        <Route path="/finance-tools" element={<FinanceTools />} />
                        <Route path="/" element={
                            <h1>Welcome to the Personal Finance Chatbot</h1>
                        } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;