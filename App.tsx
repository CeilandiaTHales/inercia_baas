
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
  Box,
  Plus,
  Layers
} from 'lucide-react';

import Dashboard from './frontend/src/pages/Dashboard';
import TableEditor from './frontend/src/pages/TableEditor';
import AuthManager from './frontend/src/pages/AuthManager';
import ProjectManager from './frontend/src/pages/ProjectManager';
import SQLLab from './frontend/src/pages/SQLLab';

import { LanguageProvider, useLanguage } from './frontend/src/contexts/LanguageContext';
import { ToastProvider, useToast } from './frontend/src/contexts/ToastContext';
import { api } from './frontend/src/api';

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
  const [projects, setProjects] = useState<any[]>([]);
  const [currentProject, setCurrentProject] = useState<any>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.get('/control/projects', 'SYSTEM_INTERNAL');
      setProjects(data);
      if (data.length > 0 && !currentProject) {
        const stored = localStorage.getItem('active_project');
        const active = data.find((p: any) => p.id === stored) || data[0];
        setCurrentProject(active);
        localStorage.setItem('active_project', active.id);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  const handleProjectSwitch = (p: any) => {
    setCurrentProject(p);
    localStorage.setItem('active_project', p.id);
    window.location.reload(); // Refresh context
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Box className="text-white" size={24} />
          </div>
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tight text-white">Inércia</h1>}
        </div>

        {/* Project Selector */}
        {isSidebarOpen && (
          <div className="px-4 mb-4">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-2">
              <label className="text-[10px] text-slate-500 font-bold uppercase px-2">Active Project</label>
              <select 
                value={currentProject?.id}
                onChange={(e) => handleProjectSwitch(projects.find(p => p.id === e.target.value))}
                className="w-full bg-transparent text-sm text-slate-200 outline-none p-1 cursor-pointer"
              >
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 space-y-1">
          <SidebarItem icon={LayoutDashboard} label={isSidebarOpen ? t('nav.dashboard') : ''} path="/" active={location.pathname === '/'} />
          <SidebarItem icon={Layers} label={isSidebarOpen ? 'Projects' : ''} path="/projects" active={location.pathname === '/projects'} />
          <SidebarItem icon={Database} label={isSidebarOpen ? t('nav.tables') : ''} path="/tables" active={location.pathname.startsWith('/tables')} />
          <SidebarItem icon={Terminal} label={isSidebarOpen ? t('nav.sql') : ''} path="/sql" active={location.pathname === '/sql'} />
          <SidebarItem icon={Users} label={isSidebarOpen ? t('nav.auth') : ''} path="/auth" active={location.pathname.startsWith('/auth')} />
          <SidebarItem icon={ShieldCheck} label={isSidebarOpen ? t('nav.rls') : ''} path="/rls" active={location.pathname === '/rls'} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <SidebarItem icon={Settings} label={isSidebarOpen ? t('nav.settings') : ''} path="/settings" active={location.pathname === '/settings'} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white rounded-md"><Menu size={20} /></button>
            <div className="flex items-center text-sm text-slate-500">
              <span className="text-emerald-500 font-semibold">{currentProject?.name}</span>
              <ChevronRight size={14} className="mx-2" />
              <span className="text-slate-200 capitalize">{location.pathname.split('/')[1] || 'Dashboard'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-500">ENGINE ONLINE</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 custom-scrollbar">
          <Routes>
            <Route path="/" element={<Dashboard currentProject={currentProject} />} />
            <Route path="/projects" element={<ProjectManager onRefresh={fetchProjects} />} />
            <Route path="/tables" element={<TableEditor currentProject={currentProject} />} />
            <Route path="/sql" element={<SQLLab currentProject={currentProject} />} />
            <Route path="/auth" element={<AuthManager />} />
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
