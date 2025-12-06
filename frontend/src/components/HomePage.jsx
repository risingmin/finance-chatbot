import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="page">
      <div className="hero">
        <div className="hero-title">Personal Finance Coach</div>
        <div className="hero-subtitle">
          A clean, AI-powered workspace to plan budgets, accelerate savings, and get crisp guidance on money decisions.
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <Link to="/chat" className="btn btn-primary">Open Chat</Link>
          <Link to="/finance-tools" className="btn btn-ghost">Explore Tools</Link>
        </div>
      </div>

      <div className="card">
        <h2>What you can do</h2>
        <p>Ask anything and get structured, actionable answers—formatted like a modern doc.</p>
        <ul className="clean-list" style={{ marginTop: '10px' }}>
          <li>Build monthly budgets and cashflow snapshots</li>
          <li>Plan debt payoff paths and prioritize balances</li>
          <li>Set savings goals with timelines and targets</li>
          <li>Translate finance jargon into plain language</li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: '16px' }}>
        <h2>Why this matters</h2>
        <p>Clear guidance, gentle nudges, and formatted answers that are presentation-ready for class or personal planning.</p>
      </div>
    </div>
  );
};

export default HomePage;
