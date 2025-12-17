
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Table as TableIcon, MoreVertical, 
  Download, Trash2, RefreshCw, Filter, Columns
} from 'lucide-react';
import { api } from '../api';
import { useToast } from '../contexts/ToastContext';

const TableEditor: React.FC<{ currentProject: any }> = ({ currentProject }) => {
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (currentProject) fetchTables();
  }, [currentProject]);

  const fetchTables = async () => {
    try {
      const res = await api.get('/meta/tables', currentProject.id);
      setTables(res);
      if (res.length > 0 && !selectedTable) setSelectedTable(res[0].table_name);
    } catch (err) {
      showToast('Error fetching project tables', 'error');
    }
  };

  const fetchRows = async (tableName: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/data/${tableName}`, currentProject.id);
      setRows(res);
    } catch (err) {
      showToast('Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTable) fetchRows(selectedTable);
  }, [selectedTable]);

  return (
    <div className="fade-in flex flex-col h-full gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Table Architect</h1>
          <p className="text-slate-400 text-sm">Manage data for <span className="text-emerald-500 font-mono font-bold">{currentProject?.name}</span></p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchTables} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl transition-all text-sm font-medium border border-slate-700">
            <RefreshCw size={16} />
            Sync
          </button>
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl transition-all text-sm font-bold shadow-lg shadow-emerald-500/20">
            <Plus size={18} />
            New Table
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        <aside className="w-64 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Find tables..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-xs focus:border-emerald-500 outline-none text-white"
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-1">
            {tables.map((t) => (
              <button 
                key={t.table_name}
                onClick={() => setSelectedTable(t.table_name)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                  selectedTable === t.table_name ? 'bg-emerald-500/10 text-emerald-400 shadow-inner' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <TableIcon size={16} />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate">{t.table_name}</p>
                  <p className="text-[10px] opacity-50 uppercase tracking-tighter">Columns: {t.column_count}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/20 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <h3 className="font-black text-white text-lg flex items-center gap-2">
                {selectedTable}
              </h3>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg border border-slate-700">
                <Download size={14} /> Export
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-slate-950">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                <RefreshCw size={32} className="animate-spin text-emerald-500" />
                <span className="font-mono text-xs tracking-widest">QUERYING DATAPLANE...</span>
              </div>
            ) : rows.length > 0 ? (
              <table className="w-full text-left border-collapse min-w-full">
                <thead className="sticky top-0 bg-slate-900/90 backdrop-blur shadow-sm z-10">
                  <tr>
                    <th className="p-4 border-b border-slate-800 w-10">
                      <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-emerald-500 w-4 h-4" />
                    </th>
                    {Object.keys(rows[0]).map((key) => (
                      <th key={key} className="p-4 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-emerald-500 w-4 h-4" />
                      </td>
                      {Object.values(row).map((val: any, vIdx) => (
                        <td key={vIdx} className="p-4 text-sm text-slate-400 font-mono whitespace-nowrap">
                          {val === null ? <span className="text-slate-800 italic">null</span> : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4">
                <TableIcon size={64} className="opacity-10" />
                <p className="font-mono text-sm">NO RECORDS IN PROJECT DATA-PLANE</p>
                <button className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20">
                  Insert First Row
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableEditor;
