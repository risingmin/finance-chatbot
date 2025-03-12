import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Welcome to Your Personal Finance Chatbot</h1>
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>Get Started</h2>
        <p>This AI-powered assistant can help you with personal finance questions and provide guidance on:</p>
        
        <ul style={{ lineHeight: 1.6, marginTop: '1rem' }}>
          <li>Creating and managing budgets</li>
          <li>Investment strategies</li>
          <li>Debt reduction plans</li>
          <li>Saving for specific goals</li>
          <li>Understanding financial terms and concepts</li>
        </ul>
        
        <Link to="/chat" className="button" style={{ 
          display: 'inline-block',
          marginTop: '1.5rem',
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          Start Chatting
        </Link>
      </div>
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>Finance Tools</h2>
        <p>Access additional tools to help manage your finances:</p>
        
        <Link to="/finance-tools" className="button" style={{ 
          display: 'inline-block',
          marginTop: '1rem',
          padding: '12px 24px',
          backgroundColor: '#28a745',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          View Finance Tools
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
