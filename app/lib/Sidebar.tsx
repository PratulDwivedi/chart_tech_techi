import React, { useEffect, useState } from 'react';
import { supabase } from './supabase/client';
import { useChart } from './ChartContext';

interface SidebarProps {
  user: { id: string; email: string };
}

type SavedChart = {
  id: string;
  title: string;
  chart_type: string;
  config: any;
  width: number | null;
  height: number | null;
  created_at: string;
};

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const { config, setConfig, width, setWidth, height, setHeight } = useChart();
  const [title, setTitle] = useState('');
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch saved charts
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('saved_charts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setCharts(data || []);
        setLoading(false);
      });
  }, [user]);

  // Save chart
  const handleSave = async () => {
    if (!title.trim()) return;
    const chartType = (() => {
      try {
        const parsed = JSON.parse(config);
        return parsed.type || 'bar';
      } catch {
        return 'bar';
      }
    })();
    await supabase.from('saved_charts').insert({
      user_id: user.id,
      title,
      chart_type: chartType,
      config: JSON.parse(config),
      width: parseInt(width),
      height: parseInt(height),
    });
    setTitle('');
    // Refresh list
    const { data } = await supabase
      .from('saved_charts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setCharts(data || []);
  };

  // Load chart
  const handleLoad = (chart: SavedChart) => {
    setConfig(JSON.stringify(chart.config, null, 2));
    setWidth((chart.width ?? 800).toString());
    setHeight((chart.height ?? 600).toString());
  };

  // Delete chart
  const handleDelete = async (id: string) => {
    await supabase.from('saved_charts').delete().eq('id', id);
    setCharts(charts.filter(c => c.id !== id));
  };

  return (
    <aside className="w-72 bg-white border-r flex flex-col p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold">
          {user.email[0].toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-base">{user.email}</div>
          <div className="text-xs text-gray-500">Charts Dashboard</div>
        </div>
      </div>
      <div className="mb-6">
        <input
          className="w-full px-2 py-1 border rounded mb-2"
          placeholder="Enter chart title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button
          className="w-full py-2 bg-gray-900 text-white rounded font-semibold"
          onClick={handleSave}
          disabled={loading || !title.trim()}
        >
          Save Chart
        </button>
      </div>
      <div className="mb-4 flex-1 overflow-auto">
        <div className="font-semibold text-sm mb-2">Your Saved Charts</div>
        {loading ? (
          <div className="text-xs text-gray-500">Loading...</div>
        ) : charts.length === 0 ? (
          <div className="text-xs text-gray-500">No saved charts</div>
        ) : (
          <div className="space-y-2">
            {charts.map(chart => (
              <div key={chart.id} className="bg-gray-100 rounded p-2 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium truncate">{chart.title}</div>
                  <div className="text-xs text-gray-500">{chart.chart_type} - {chart.width}x{chart.height}<br />{new Date(chart.created_at).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-1">
                  <button className="px-2 py-1 bg-gray-800 text-white rounded text-xs" onClick={() => handleLoad(chart)}>Load</button>
                  <button className="px-2 py-1 bg-gray-200 rounded text-xs" onClick={() => handleDelete(chart.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-auto">
        <button className="w-full py-2 bg-gray-200 rounded" onClick={async () => { await supabase.auth.signOut(); }}>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 