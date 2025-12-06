import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import FinanceTools from './components/FinanceTools';
import HomePage from './components/HomePage';
import './index.css';
import './styles/components.css';

const navItems = [
  { path: '/', label: 'Home', exact: true },
  { path: '/chat', label: 'Chat' },
  { path: '/finance-tools', label: 'Tools' },
  { path: '/goals', label: 'Goals', disabled: true },
  { path: '/history', label: 'History', disabled: true }
];

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-header">
      <div className="sidebar-title">Personal Finance AI</div>
      <div className="sidebar-subtitle">Plan · Budget · Grow</div>
    </div>
    <nav className="sidebar-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`
          }
          onClick={(e) => item.disabled && e.preventDefault()}
        >
          <span className="nav-dot" aria-hidden />
          <span>{item.label}</span>
          {item.disabled && <span className="pill">Soon</span>}
        </NavLink>
      ))}
    </nav>
  </aside>
);

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-frame">
        <Sidebar />
        <div className="main-area">
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