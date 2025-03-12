import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import FinanceTools from './FinanceTools';
import Sidebar from './Sidebar';
import './styles/components.css';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Sidebar />
                <div className="main-content">
                    <Switch>
                        <Route path="/chat" component={ChatInterface} />
                        <Route path="/finance-tools" component={FinanceTools} />
                        <Route path="/" exact>
                            <h1>Welcome to the Personal Finance Chatbot</h1>
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
};

export default App;