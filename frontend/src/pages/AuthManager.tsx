
import React from 'react';
import { 
  Users, 
  Mail, 
  ShieldCheck, 
  Lock, 
  Github, 
  Chrome,
  MoreVertical,
  Plus
} from 'lucide-react';

const AuthManager: React.FC = () => {
  return (
    <div className="fade-in space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Authentication</h1>
          <p className="text-slate-400">Manage user access, auth providers, and security settings.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-all text-sm font-bold">
          <Plus size={18} />
          Invite User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Users size={20} />
              </div>
              <h3 className="font-semibold text-white">Users</h3>
            </div>
            <span className="text-xs font-bold text-slate-500">Total: 42</span>
          </div>
          <div className="divide-y divide-slate-800 max-h-[400px] overflow-auto">
            {[
              { email: 'user@example.com', status: 'Active', date: '2 days ago' },
              { email: 'dev@inercia.io', status: 'Active', date: '1 week ago' },
              { email: 'test@demo.com', status: 'Inactive', date: '1 month ago' },
            ].map((u, i) => (
              <div key={i} className="p-4 hover:bg-slate-800/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-400 font-bold uppercase">
                    {u.email[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{u.email}</p>
                    <span className="text-[10px] text-slate-500">Joined {u.date}</span>
                  </div>
                </div>
                <MoreVertical size={16} className="text-slate-600 cursor-pointer" />
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              Authentication Providers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'Email / Password', icon: Mail, enabled: true },
                { name: 'Google OAuth', icon: Chrome, enabled: false },
                { name: 'GitHub OAuth', icon: Github, enabled: true },
                { name: 'Custom Magic Links', icon: Lock, enabled: false },
              ].map((p, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  p.enabled ? 'bg-slate-800/50 border-emerald-500/20 shadow-lg shadow-emerald-500/5' : 'bg-slate-900 border-slate-800 opacity-60'
                }`}>
                  <div className="flex items-center gap-3">
                    <p.icon size={24} className={p.enabled ? 'text-emerald-500' : 'text-slate-600'} />
                    <span className={`font-medium ${p.enabled ? 'text-slate-200' : 'text-slate-500'}`}>{p.name}</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer ${p.enabled ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${p.enabled ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Lock size={18} className="text-amber-500" />
                Row Level Security (RLS)
              </h3>
              <button className="text-xs bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">New Policy</button>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase">Table: users</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">Enabled</span>
                </div>
                <p className="text-sm text-slate-300">Policy: <code className="text-emerald-400">allow_self_read</code></p>
                <div className="bg-slate-900 p-2 rounded text-[10px] font-mono text-slate-400 overflow-x-auto">
                  CREATE POLICY allow_self_read ON users FOR SELECT USING (auth.uid() = id);
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthManager;
