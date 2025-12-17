
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Table as TableIcon, 
  MoreVertical, 
  Download, 
  Trash2,
  RefreshCw,
  Filter,
  Columns
} from 'lucide-react';
import { api } from '../api';
import { useToast } from '../contexts/ToastContext';

const TableEditor: React.FC = () => {
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await api.get('/meta/tables', 'SYSTEM_INTERNAL');
      setTables(res);
      if (res.length > 0 && !selectedTable) setSelectedTable(res[0].table_name);
    } catch (err) {
      showToast('Error fetching tables', 'error');
    }
  };

  const fetchRows = async (tableName: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/data/${tableName}`, 'SYSTEM_INTERNAL');
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
          <h1 className="text-3xl font-bold text-white mb-1">Tables</h1>
          <p className="text-slate-400 text-sm">Visual editor for your database schema and data.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium border border-slate-700">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-all text-sm font-bold shadow-lg shadow-emerald-500/20">
            <Plus size={18} />
            Create Table
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Table List Sidebar */}
        <aside className="w-64 bg-slate-900 border border-slate-800 rounded-xl flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search tables..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-md py-1.5 pl-9 pr-3 text-xs focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-1">
            {tables.map((t) => (
              <button 
                key={t.table_name}
                onClick={() => setSelectedTable(t.table_name)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all ${
                  selectedTable === t.table_name ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <TableIcon size={16} />
                <span className="text-sm font-medium truncate">{t.table_name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Data Grid Area */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <TableIcon size={18} className="text-emerald-500" />
                {selectedTable || 'No table selected'}
              </h3>
              <div className="h-4 w-px bg-slate-800" />
              <div className="flex gap-2">
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded"><Filter size={16} /></button>
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded"><Columns size={16} /></button>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md border border-slate-700">
                <Download size={14} />
                Export
              </button>
              <button className="flex items-center gap-2 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-md border border-red-500/20">
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-slate-950">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-500 gap-3">
                <RefreshCw size={24} className="animate-spin text-emerald-500" />
                <span>Loading records...</span>
              </div>
            ) : rows.length > 0 ? (
              <table className="w-full text-left border-collapse min-w-full">
                <thead className="sticky top-0 bg-slate-900 shadow-sm z-10">
                  <tr>
                    <th className="p-3 border-b border-slate-800 w-10">
                      <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-emerald-500" />
                    </th>
                    {Object.keys(rows[0]).map((key) => (
                      <th key={key} className="p-3 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider min-w-[150px]">
                        <div className="flex justify-between items-center">
                          {key}
                          <MoreVertical size={12} className="opacity-40" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="p-3 border-b border-slate-900">
                        <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-emerald-500" />
                      </td>
                      {Object.values(row).map((val: any, vIdx) => (
                        <td key={vIdx} className="p-3 border-b border-slate-900 text-sm text-slate-300 font-mono whitespace-nowrap overflow-hidden text-ellipsis">
                          {val === null ? <span className="text-slate-600 italic">null</span> : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                <div className="p-6 bg-slate-900 rounded-full">
                  <TableIcon size={48} className="text-slate-800" />
                </div>
                <div className="text-center">
                  <p className="text-slate-400 font-medium">No records found</p>
                  <p className="text-xs text-slate-600 mt-1">This table is currently empty.</p>
                </div>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                  <Plus size={16} />
                  Insert Row
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
