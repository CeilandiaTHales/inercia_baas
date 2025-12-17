
import React, { useState, useEffect } from 'react';
import { Plus, Folder, ExternalLink, Trash2, Database, Shield } from 'lucide-react';
import { api } from '../api';
import { useToast } from '../contexts/ToastContext';

const ProjectManager: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', slug: '' });
  const { showToast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.get('/control/projects', 'SYSTEM_INTERNAL');
      setProjects(data);
    } catch (err) {
      showToast('Failed to load projects', 'error');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/control/projects', newProject, 'SYSTEM_INTERNAL');
      showToast('Project and Database provisioned!', 'success');
      setShowModal(false);
      onRefresh();
      fetchProjects();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-slate-400">Manage isolated BaaS environments for your clients.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl transition-all font-bold"
        >
          <Plus size={20} />
          Provision New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl group hover:border-emerald-500/50 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                <Database size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><Shield size={16} /></button>
                <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
            <p className="text-slate-500 text-sm font-mono mb-4">DB: {p.slug}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                ID: {p.id.split('-')[0]}...
              </span>
              <button className="flex items-center gap-1 text-xs text-emerald-500 hover:underline">
                View API Docs <ExternalLink size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl fade-in overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">New Multi-tenant Project</h2>
              <p className="text-sm text-slate-500">This will provision a dedicated PostgreSQL database.</p>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Project Name</label>
                <input 
                  autoFocus
                  required
                  placeholder="Client Business Name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none"
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Database Slug (Lowercase, no spaces)</label>
                <input 
                  required
                  placeholder="client_a_db"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none font-mono"
                  onChange={e => setNewProject({...newProject, slug: e.target.value.toLowerCase().replace(/ /g, '_')})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-800 text-slate-300 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg font-bold shadow-lg shadow-emerald-500/20"
                >
                  Provision Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
