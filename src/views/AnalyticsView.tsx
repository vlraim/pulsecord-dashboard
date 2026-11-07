import React from 'react';
import { useBot } from '../context/BotContext';
import {
  BarChart3,
  TrendingUp,
  Shield,
  Activity,
  Users,
  Download,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { config, activeBot, showToast } = useBot();
  const analytics = config?.analytics || {
    totalCommandsUsed: 14280,
    moderationActions30d: 412,
    activeUsers24h: 3480,
    uptimePercentage: 99.98,
    commandBreakdown: [
      { name: '/help', count: 3820 },
      { name: '/rank', count: 2940 },
      { name: '/ticket', count: 1840 },
      { name: '/warn', count: 1210 },
      { name: '/ban', count: 830 },
      { name: '/serverinfo', count: 780 },
    ],
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analytics, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeBot?.name || 'bot'}-analytics.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Analytics report exported as JSON', 'success');
  };

  const maxCount = Math.max(...analytics.commandBreakdown.map((c) => c.count));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Bot & Server Analytics</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Real-time traffic metrics, command volume distribution, and moderation shield effectiveness.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="carbon-card rounded-2xl p-5 border border-purple-500/20">
          <div className="text-xs text-neutral-400 font-semibold mb-1 flex items-center justify-between">
            <span>Total Commands</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {analytics.totalCommandsUsed.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">
            +18.4% this month
          </div>
        </div>

        <div className="carbon-card rounded-2xl p-5 border border-purple-500/20">
          <div className="text-xs text-neutral-400 font-semibold mb-1 flex items-center justify-between">
            <span>Moderation Actions</span>
            <Shield className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {analytics.moderationActions30d}
          </div>
          <div className="text-[11px] text-purple-300 mt-1 font-medium">
            Past 30 days protected
          </div>
        </div>

        <div className="carbon-card rounded-2xl p-5 border border-purple-500/20">
          <div className="text-xs text-neutral-400 font-semibold mb-1 flex items-center justify-between">
            <span>Daily Active Members</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {analytics.activeUsers24h.toLocaleString()}
          </div>
          <div className="text-[11px] text-blue-300 mt-1 font-medium">
            Across registered servers
          </div>
        </div>

        <div className="carbon-card rounded-2xl p-5 border border-purple-500/20">
          <div className="text-xs text-neutral-400 font-semibold mb-1 flex items-center justify-between">
            <span>Gateway Uptime</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {analytics.uptimePercentage}%
          </div>
          <div className="text-[11px] text-amber-300 mt-1 font-medium">
            Zero SLA degradation
          </div>
        </div>
      </div>

      {/* Command Usage Distribution Breakdown */}
      <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" /> Most Used Commands (Past 30 Days)
            </h3>
            <p className="text-xs text-neutral-400">Total executions by members across connected guilds</p>
          </div>
          <span className="text-xs font-mono text-purple-300 bg-purple-950/40 px-2.5 py-1 rounded border border-purple-500/30">
            Live Gateway Metrics
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {analytics.commandBreakdown.map((cmd) => {
            const pct = Math.round((cmd.count / maxCount) * 100);
            return (
              <div key={cmd.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-white">{cmd.name}</span>
                  <span className="font-mono text-neutral-400">{cmd.count.toLocaleString()} calls</span>
                </div>
                <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-violet-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
