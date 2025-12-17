
import React, { useEffect, useState } from 'react';
import { 
  Database, 
  Users, 
  Cpu, 
  ArrowUpRight, 
  Zap,
  HardDrive
} from 'lucide-react';
import { api } from '../api';

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all duration-200">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{label}</h3>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const Dashboard: React.FC<{ currentProject: any }> = ({ currentProject }) => {
  const [stats, setStats] = useState({
    tables: 0,
    users: 0,
    queries: 'Healthy',
    storage: 'Active'
  });

  useEffect(() => {
    if (currentProject) fetchStats();
  }, [currentProject]);

  const fetchStats = async () => {
    try {
      const tables = await api.get('/meta/tables', currentProject.id);
      setStats(prev => ({ ...prev, tables: tables.length }));
    } catch (err) {
      console.error("Failed to fetch project stats", err);
    }
  };

  return (
    <div className="fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Project Overview</h1>
        <p className="text-slate-400">Environment status for <span className="text-emerald-500 font-semibold">{currentProject?.name}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Database} label="Schema Tables" value={stats.tables} color="bg-blue-500" />
        <StatCard icon={Users} label="Registered Users" value={stats.users} color="bg-emerald-500" />
        <StatCard icon={Zap} label="System Health" value={stats.queries} color="bg-amber-500" />
        <StatCard icon={HardDrive} label="Isolation Status" value={stats.storage} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="font-bold text-white text-xl mb-6">Database Connectivity</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Internal Host</p>
                <p className="text-sm font-mono text-emerald-500">thales_db:5432</p>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Target Database</p>
                <p className="text-sm font-mono text-emerald-500">{currentProject?.slug}</p>
              </div>
            </div>
            
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
              <h4 className="text-sm font-bold text-emerald-400 mb-2">RESTful Access Point</h4>
              <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <code className="text-xs text-slate-400 flex-1">/api/data/[table_name]</code>
                <div className="flex gap-2 text-[10px] font-bold">
                  <span className="text-emerald-500">GET</span>
                  <span className="text-blue-500">POST</span>
                  <span className="text-amber-500">PATCH</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
            <Cpu size={32} />
          </div>
          <h3 className="font-bold text-white text-lg">Serverless Edge Simulation</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your project is running in a logically isolated PostgreSQL instance. Row Level Security can be defined in the Auth Manager.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
