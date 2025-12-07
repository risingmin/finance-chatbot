import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import FinanceTools from './components/FinanceTools';
import HomePage from './components/HomePage';
import './index.css';
import './styles/app-layout.css';
import './styles/pages.css';

const navItems = [
  { path: '/', label: 'Home', exact: true },
  { path: '/chat', label: 'Chat' },
  { path: '/finance-tools', label: 'Tools' },
  { path: '/goals', label: 'Goals', disabled: true },
  { path: '/history', label: 'History', disabled: true }
];

const Sidebar = () => (
  <aside className="app-sidebar">
    <div className="sidebar-header">
      <div className="sidebar-logo">💸</div>
      <div className="sidebar-title">Finance Coach</div>
    </div>
    <nav className="sidebar-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item-active' : ''} ${item.disabled ? 'nav-item-disabled' : ''}`
          }
          onClick={(e) => item.disabled && e.preventDefault()}
        >
          <span className="nav-label">{item.label}</span>
          {item.disabled && <span className="nav-badge">Soon</span>}
        </NavLink>
      ))}
    </nav>
  </aside>
);

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/finance-tools" element={<FinanceTools />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;