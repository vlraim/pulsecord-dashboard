import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import {
  Activity,
  Server,
  Users,
  Clock,
  Zap,
  Shield,
  Terminal,
  ExternalLink,
  RefreshCw,
  Plus,
  AlertCircle,
  CheckCircle,
  Copy,
  ChevronRight,
  Send,
  Bot,
} from 'lucide-react';
import { DiscordEmbedPreview } from '../components/DiscordEmbedPreview';
import { InitialsAvatar } from '../components/InitialsAvatar';

export const OverviewView: React.FC = () => {
  const {
    activeBot,
    config,
    setActiveSection,
    setIsAddBotOpen,
    syncSlashCommands,
    updateBotStatus,
    showToast,
  } = useBot();

  const [isSyncing, setIsSyncing] = useState(false);
  const [quickStatus, setQuickStatus] = useState(activeBot?.status || 'online');
  const [quickActivity, setQuickActivity] = useState(activeBot?.activityText || '');

  if (!activeBot || !config) {
    return (
      <div className="p-8 text-center text-neutral-400">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Loading bot diagnostics...</p>
      </div>
    );
  }

  const handleQuickStatusSave = async () => {
    await updateBotStatus({
      status: quickStatus,
      activityText: quickActivity,
    });
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await syncSlashCommands();
    setIsSyncing(false);
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${activeBot.id}&permissions=8&scope=bot%20applications.commands`;

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteUrl);
    showToast('Bot invite link copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Bot Header Card */}
      <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <InitialsAvatar
              name={activeBot.name}
              size="2xl"
              shape="rounded-2xl"
              status={activeBot.status}
              className="border-2 border-purple-500/40 shadow-lg shadow-purple-900/30 text-2xl font-black"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-white">{activeBot.name}</h2>
                <span className="text-xs text-neutral-400 font-mono">#{activeBot.discriminator}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  {activeBot.activityType} {activeBot.activityText}
                </span>
                <span>•</span>
                <span className="font-mono text-neutral-300">Prefix: {activeBot.prefix}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={copyInvite}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-200 transition flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-purple-400" />
              <span>Copy Invite URL</span>
            </button>
            <a
              href={inviteUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-xs font-semibold text-purple-200 transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Invite to Guild</span>
            </a>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-md shadow-purple-900/30"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync Slash</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="carbon-card rounded-2xl p-5 border border-purple-500/20">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Gateway Latency</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{activeBot.latencyMs} ms</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <CheckCircle className="w-3 h-3" /> Optimal REST API response
          </div>
        </div>

        <div className="carbon-card rounded-2xl p-5 border border-purple-500/20">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Connected Servers</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{activeBot.serversCount}</div>
          <div className="text-[11px] text-purple-300 mt-1 font-medium">
            Guild shard #0 active
          </div>
        </div>

        <div className="carbon-card rounded-2xl p-5 border border-purple-500/20">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Total Members Served</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {activeBot.membersCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-blue-300 mt-1 font-medium">
            Across registered guilds
          </div>
        </div>

        <div className="carbon-card rounded-2xl p-5 border border-purple-500/20">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Gateway Uptime</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{formatUptime(activeBot.uptime)}</div>
          <div className="text-[11px] text-amber-300 mt-1 font-medium">
            99.98% reliability rating
          </div>
        </div>
      </div>

      {/* Two Column Grid: Quick Presence Tuning & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Quick Presence Config */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" /> Quick Presence Adjuster
              </h3>
              <p className="text-xs text-neutral-400">Update bot activity and online state without restarts</p>
            </div>
            <button
              onClick={() => setActiveSection('bot-management')}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
            >
              Full Config <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Online Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['online', 'idle', 'dnd'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setQuickStatus(st)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
                      quickStatus === st
                        ? 'bg-purple-600/30 border border-purple-500 text-white'
                        : 'bg-black/30 border border-white/5 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        st === 'online'
                          ? 'bg-emerald-500'
                          : st === 'idle'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span className="capitalize">{st === 'dnd' ? 'Do Not Disturb' : st}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Activity Text
              </label>
              <input
                type="text"
                value={quickActivity}
                onChange={(e) => setQuickActivity(e.target.value)}
                placeholder="e.g. over 14,820 members | /help"
                className="w-full bg-[#131520] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition"
              />
            </div>

            <button
              onClick={handleQuickStatusSave}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-900/40"
            >
              <span>Apply Presence to Discord</span>
            </button>
          </div>
        </div>

        {/* Right: Feature Shortcuts */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <div className="pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" /> Active Feature Systems
            </h3>
            <p className="text-xs text-neutral-400">Instant shortcuts to configured community tools</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { name: 'Auto-Moderation', desc: 'Anti-spam & Bad words active', section: 'moderation' as const, badge: 'Protected' },
              { name: 'Support Tickets', desc: 'Panel active in #support', section: 'ticket-system' as const, badge: 'Active' },
              { name: 'Welcome & Rules', desc: 'Card in #welcome-lounge', section: 'welcome-system' as const, badge: 'Enabled' },
              { name: 'Giveaways Engine', desc: '1 Active giveaway running', section: 'giveaway-system' as const, badge: 'Live' },
              { name: 'Reaction Roles', desc: 'Self-assign roles setup', section: 'reaction-roles' as const, badge: 'Active' },
              { name: 'Leveling XP', desc: 'Voice & text multiplier 1.0x', section: 'leveling-system' as const, badge: 'Online' },
            ].map((mod) => (
              <button
                key={mod.name}
                onClick={() => setActiveSection(mod.section)}
                className="p-3 rounded-xl bg-[#121422] hover:bg-purple-950/20 border border-white/5 hover:border-purple-500/30 text-left transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white group-hover:text-purple-300 transition">
                    {mod.name}
                  </span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    {mod.badge}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-tight">{mod.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live System Preview */}
      <div className="carbon-card rounded-2xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Live Discord Message Simulation</h3>
            <p className="text-xs text-neutral-400">Realistic view of how your bot formats messages in Discord dark mode</p>
          </div>
          <button
            onClick={() => setActiveSection('custom-embeds')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            Custom Embed Builder <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex justify-center">
          <DiscordEmbedPreview
            botName={activeBot.name}
            botAvatar={activeBot.avatar}
            title={`⚡ ${activeBot.name} Operational Diagnostics`}
            description={`Bot running smoothly on PulseCord Engine.\nPrefix: **\`${activeBot.prefix}\`** | Slash Commands: **Enabled**\nLatency: **${activeBot.latencyMs}ms**`}
            color="#8b5cf6"
            fields={[
              { name: 'Active Modules', value: '18 Systems Enabled', inline: true },
              { name: 'Uptime', value: formatUptime(activeBot.uptime), inline: true },
            ]}
            buttons={[
              { label: 'View Command List', emoji: '📜' },
              { label: 'Server Rules', emoji: '🛡️' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
