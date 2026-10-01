import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import HeatmapChart from '../components/HeatmapChart';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { Activity, Calendar, BarChart2, TrendingUp } from 'lucide-react';

// Custom tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs border border-white/10">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="font-bold text-brand-400">{payload[0].value} completions</p>
    </div>
  );
};

const Analytics = () => {
  const { api } = useContext(AuthContext);
  const [heatmap, setHeatmap] = useState([]);
  const [trend, setTrend] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [hRes, tRes] = await Promise.all([
          api.get('/stats/heatmap'),
          api.get('/stats/trend'),
        ]);
        setHeatmap(hRes.data);
        setTrend(tRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const totalCompletions = trend.reduce((s, d) => s + d.count, 0);
  const avgPerDay = trend.length > 0 ? (totalCompletions / trend.length).toFixed(1) : 0;
  const bestDay = trend.reduce((m, d) => (d.count > m.count ? d : m), { count: 0 });

  // Format date labels for chart (show only every 5th)
  const trendWithLabels = trend.map((d, i) => ({
    ...d,
    label: i % 5 === 0 ? d.date.slice(5) : '',
  }));

  const statCards = [
    { icon: <Activity className="w-5 h-5" />, label: '30-Day Total', value: totalCompletions, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Daily Average', value: avgPerDay, color: 'text-accent-400', bg: 'bg-accent-500/10' },
    { icon: <BarChart2 className="w-5 h-5" />, label: 'Best Day', value: `${bestDay.count} habits`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Active Days', value: trend.filter((d) => d.count > 0).length, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="animate-fade-in-up">
        <p className="text-slate-500 text-sm uppercase tracking-widest mb-1">Analytics</p>
        <h1 className="text-3xl font-bold text-slate-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Your Progress
        </h1>
        <p className="text-slate-500 mt-1">Track your habit completion over time</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up-delay-1">
        {statCards.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5 border border-white/5">
            <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up-delay-2">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-4 h-4 text-brand-400" />
          <h2 className="font-semibold text-slate-200">Completion Heatmap</h2>
          <span className="text-xs text-slate-500 ml-auto">Past 12 months</span>
        </div>
        {isLoading ? (
          <div className="h-32 bg-white/3 rounded-xl animate-pulse" />
        ) : (
          <HeatmapChart data={heatmap} />
        )}
      </div>

      {/* 30-day trend (Area chart) */}
      <div className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up-delay-3">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-4 h-4 text-accent-400" />
          <h2 className="font-semibold text-slate-200">30-Day Completion Trend</h2>
        </div>
        {isLoading ? (
          <div className="h-48 bg-white/3 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendWithLabels} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#areaGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar chart - same data different view */}
      <div className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 className="w-4 h-4 text-emerald-400" />
          <h2 className="font-semibold text-slate-200">Daily Completions (Bar View)</h2>
        </div>
        {isLoading ? (
          <div className="h-48 bg-white/3 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendWithLabels} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Analytics;
