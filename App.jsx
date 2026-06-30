import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DepartmentsPage from './components/DepartmentsPage';
import './styles/app.css';

export default function App() {
  const [activePage, setActivePage] = useState('departments');

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="app-main">
        <Header activePage={activePage} />
        <main className="app-content">
          {activePage === 'departments' && <DepartmentsPage />}
        </main>
      </div>
    </div>
  );
}
