
import React, { useEffect, useState } from 'react';
import { 
  Database, 
  Users, 
  Cpu, 
  ArrowUpRight, 
  ShieldCheck,
  Zap,
  HardDrive
} from 'lucide-react';
import { api } from '../api';

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all duration-200">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      {trend && (
        <span className="flex items-center text-xs font-medium text-emerald-500">
          <ArrowUpRight size={12} className="mr-1" />
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{label}</h3>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    tables: 0,
    users: 0,
    queries: '1.2k',
    storage: '42MB'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const tables = await api.get('/meta/tables', 'SYSTEM_INTERNAL');
        setStats(prev => ({ ...prev, tables: tables.length }));
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Project Overview</h1>
        <p className="text-slate-400">Real-time health and statistics for Inércia Default Project.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Database} 
          label="Total Tables" 
          value={stats.tables} 
          trend="+2 this week"
          color="bg-blue-500" 
        />
        <StatCard 
          icon={Users} 
          label="Total Users" 
          value={stats.users} 
          trend="+12% vs last month"
          color="bg-emerald-500" 
        />
        <StatCard 
          icon={Zap} 
          label="API Requests" 
          value={stats.queries} 
          trend="Healthy"
          color="bg-amber-500" 
        />
        <StatCard 
          icon={HardDrive} 
          label="Database Size" 
          value={stats.storage} 
          color="bg-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="font-semibold text-white">Recent Activities</h2>
            <button className="text-xs text-emerald-500 hover:underline">View All</button>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {[
                { type: 'SQL', desc: 'Table "users" updated schema', time: '2 mins ago' },
                { type: 'AUTH', desc: 'New user registered via Google', time: '1 hour ago' },
                { type: 'SYS', desc: 'Backup successfully completed', time: '3 hours ago' },
                { type: 'RLS', desc: 'Policy "enable_read" created for table "posts"', time: 'Yesterday' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">{item.desc}</p>
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">{item.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="font-semibold text-white mb-6">Connection Details</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-500 uppercase font-bold">Project URL</label>
              <div className="flex items-center gap-2 bg-slate-800 p-2 rounded border border-slate-700">
                <code className="text-xs text-emerald-400 flex-1 overflow-hidden truncate">https://api.inercia.io/project/default</code>
                <button className="text-slate-400 hover:text-white"><ArrowUpRight size={14} /></button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500 uppercase font-bold">API Key (Project Secret)</label>
              <div className="flex items-center gap-2 bg-slate-800 p-2 rounded border border-slate-700">
                <code className="text-xs text-slate-400 flex-1">************************</code>
                <button className="text-slate-400 hover:text-white"><ArrowUpRight size={14} /></button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex gap-3">
              <Cpu className="text-blue-500 shrink-0" size={20} />
              <div>
                <h4 className="text-sm font-semibold text-blue-400">System Tip</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Ensure you configure your RLS policies correctly before exposing your API to the public web.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
