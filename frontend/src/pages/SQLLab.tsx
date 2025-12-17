
import React, { useState } from 'react';
import { Play, Terminal, RotateCcw, Save, Info } from 'lucide-react';
import { api } from '../api';
import { useToast } from '../contexts/ToastContext';

const SQLLab: React.FC<{ currentProject: any }> = ({ currentProject }) => {
  const [sql, setSql] = useState('-- Write your SQL here\nSELECT * FROM information_schema.tables;');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const runQuery = async () => {
    if (!currentProject) return;
    setLoading(true);
    try {
      const data = await api.post('/query', { sql }, currentProject.id);
      setResults(data);
      showToast('Query executed successfully', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in flex flex-col h-full gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">SQL Lab</h1>
          <p className="text-slate-400 text-sm">Execute commands directly on <span className="text-emerald-500 font-mono">"{currentProject?.slug}"</span></p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setSql('')}
            className="p-2 text-slate-400 hover:text-white"
          >
            <RotateCcw size={20} />
          </button>
          <button 
            disabled={loading}
            onClick={runQuery}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl transition-all font-bold disabled:opacity-50"
          >
            {loading ? <RotateCcw size={18} className="animate-spin" /> : <Play size={18} />}
            Execute Code
          </button>
        </div>
      </div>

      <div className="grid grid-rows-2 flex-1 gap-6 overflow-hidden">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
          <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <Terminal size={14} /> QUERY EDITOR
            </span>
            <button className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded">Prettify SQL</button>
          </div>
          <textarea 
            value={sql}
            onChange={e => setSql(e.target.value)}
            spellCheck={false}
            className="flex-1 bg-slate-950 text-emerald-400 font-mono p-6 outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
          <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/50">
            <span className="text-xs font-bold text-slate-500">RESULTS OUTPUT</span>
          </div>
          <div className="flex-1 overflow-auto bg-slate-950 p-6">
            {!results && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3">
                <Info size={32} />
                <p>Run a query to see results here.</p>
              </div>
            )}
            
            {results && (
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Rows Returned</p>
                    <p className="text-lg font-bold text-white">{results.rowCount || 0}</p>
                  </div>
                  <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Command</p>
                    <p className="text-lg font-bold text-white">{results.command}</p>
                  </div>
                </div>

                {results.rows?.length > 0 && (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        {Object.keys(results.rows[0]).map(k => (
                          <th key={k} className="p-3 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.rows.map((r: any, i: number) => (
                        <tr key={i} className="border-b border-slate-900/50 hover:bg-slate-900/50">
                          {Object.values(r).map((v: any, j) => (
                            <td key={j} className="p-3 text-sm text-slate-300 font-mono">{String(v)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SQLLab;
