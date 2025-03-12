import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Finance Chatbot</h2>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/chat">Chat</Link>
                </li>
                <li>
                    <Link to="/finance-tools">Finance Tools</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;