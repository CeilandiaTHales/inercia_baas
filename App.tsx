
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Users, 
  Settings, 
  Terminal, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  Menu,
  Activity,
  Box
} from 'lucide-react';

import Dashboard from './frontend/src/pages/Dashboard';
import TableEditor from './frontend/src/pages/TableEditor';
import AuthManager from './frontend/src/pages/AuthManager';
import { LanguageProvider, useLanguage } from './frontend/src/contexts/LanguageContext';
import { ToastProvider, useToast } from './frontend/src/contexts/ToastContext';

// Helper for Sidebar navigation
const SidebarItem = ({ icon: Icon, label, path, active }: any) => (
  <Link 
    to={path} 
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active ? 'bg-emerald-600/20 text-emerald-400 border-l-4 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Box className="text-white" size={24} />
          </div>
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tight text-white">Inércia</h1>}
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          <SidebarItem icon={LayoutDashboard} label={isSidebarOpen ? t('nav.dashboard') : ''} path="/" active={location.pathname === '/'} />
          <SidebarItem icon={Database} label={isSidebarOpen ? t('nav.tables') : ''} path="/tables" active={location.pathname.startsWith('/tables')} />
          <SidebarItem icon={Users} label={isSidebarOpen ? t('nav.auth') : ''} path="/auth" active={location.pathname.startsWith('/auth')} />
          <SidebarItem icon={Terminal} label={isSidebarOpen ? t('nav.sql') : ''} path="/sql" active={location.pathname === '/sql'} />
          <SidebarItem icon={ShieldCheck} label={isSidebarOpen ? t('nav.rls') : ''} path="/rls" active={location.pathname === '/rls'} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <SidebarItem icon={Settings} label={isSidebarOpen ? t('nav.settings') : ''} path="/settings" active={location.pathname === '/settings'} />
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">{t('nav.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white rounded-md">
              <Menu size={20} />
            </button>
            <div className="flex items-center text-sm text-slate-500">
              <span>System</span>
              <ChevronRight size={14} className="mx-2" />
              <span className="text-slate-200 capitalize">{location.pathname.split('/')[1] || 'Dashboard'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-500">API ACTIVE</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <span className="text-xs font-bold">AD</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 custom-scrollbar">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tables" element={<TableEditor />} />
            <Route path="/auth" element={<AuthManager />} />
            <Route path="*" element={<div className="flex items-center justify-center h-full text-slate-500">Module under development...</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </ToastProvider>
  );
};

export default App;
