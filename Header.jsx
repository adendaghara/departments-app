import React from 'react';

const pageTitles = {
  departments: 'الأقسام',
  employees: 'الموظفون',
  reports: 'التقارير',
  dashboard: 'لوحة التحكم',
};

export default function Header({ activePage }) {
  return (
    <header className="header">
      <span className="header-breadcrumb">
        <span>الرئيسية</span>
        <span>›</span>
        <span className="current">{pageTitles[activePage] || activePage}</span>
      </span>
      <div className="header-spacer" />
      <div className="header-avatar">م</div>
    </header>
  );
}
