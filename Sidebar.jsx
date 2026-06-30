import React from 'react';

const navItems = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: '⊞' },
  { id: 'departments', label: 'الأقسام', icon: '🏢' },
  { id: 'employees', label: 'الموظفون', icon: '👥' },
  { id: 'reports', label: 'التقارير', icon: '📊' },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🏛</div>
        <div>
          <div className="logo-text">نظام HR</div>
          <div className="logo-sub">إدارة الموارد البشرية</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">القائمة الرئيسية</div>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        v1.0.0 © 2025
      </div>
    </aside>
  );
}
