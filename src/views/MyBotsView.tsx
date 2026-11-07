import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import { ConnectedBot } from '../types';
import {
  Bot,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Server,
  Users,
  Activity,
  Clock,
  Shield,
  Key,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import { InitialsAvatar } from '../components/InitialsAvatar';

export const MyBotsView: React.FC = () => {
  const { bots, activeBot, setActiveBotId, setIsAddBotOpen, setActiveSection, showToast } = useBot();
  const [copiedBotId, setCopiedBotId] = useState<string | null>(null);

  const handleCopyInvite = (bot: ConnectedBot) => {
    const url = `https://discord.com/oauth2/authorize?client_id=${bot.id}&permissions=8&scope=bot%20applications.commands`;
    navigator.clipboard.writeText(url);
    setCopiedBotId(bot.id);
    showToast(`Invite link for ${bot.name} copied!`, 'success');
    setTimeout(() => setCopiedBotId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Connected Bot Applications</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage multiple Discord bots from a single unified cockpit. Switch active instances anytime.
          </p>
        </div>
        <button
          onClick={() => setIsAddBotOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/40"
        >
          <Plus className="w-4 h-4" />
          <span>Connect Another Bot</span>
        </button>
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {bots.map((bot) => {
          const isActive = activeBot?.id === bot.id;
          const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${bot.id}&permissions=8&scope=bot%20applications.commands`;

          return (
            <div
              key={bot.id}
              className={`carbon-card rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-purple-500 shadow-xl shadow-purple-950/50 bg-[#121422]'
                  : 'border-white/10 hover:border-purple-500/30'
              }`}
            >
              <div>
                {/* Header & Avatar */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <InitialsAvatar
                      name={bot.name}
                      size="lg"
                      shape="rounded-2xl"
                      status={bot.status}
                      className="border border-purple-500/30 text-base"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-white">{bot.name}</h3>
                        <span className="text-[10px] text-neutral-400 font-mono">#{bot.discriminator}</span>
                      </div>
                      <div className="text-[11px] text-purple-300 font-mono mt-0.5">
                        ID: {bot.id.slice(0, 10)}...
                      </div>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveBotId(bot.id)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/20 hover:text-purple-300 text-neutral-400 border border-white/5 transition"
                    >
                      Select
                    </button>
                  )}
                </div>

                {/* Details Pills */}
                <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-black/30 border border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Servers</span>
                    <span className="font-bold text-white font-mono">{bot.serversCount} guilds</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Members</span>
                    <span className="font-bold text-white font-mono">{bot.membersCount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Latency</span>
                    <span className="font-bold text-emerald-400 font-mono">{bot.latencyMs}ms</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Prefix</span>
                    <span className="font-bold text-purple-300 font-mono">{bot.prefix}</span>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-400 truncate mb-4">
                  <span className="text-neutral-500">Activity:</span> {bot.activityType} {bot.activityText}
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                <button
                  onClick={() => handleCopyInvite(bot)}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  {copiedBotId === bot.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedBotId === bot.id ? 'Copied' : 'Invite Link'}</span>
                </button>

                <a
                  href={inviteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
                  title="Direct Invite to Discord"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                {isActive && (
                  <button
                    onClick={() => setActiveSection('bot-management')}
                    className="p-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 transition"
                    title="Configure Bot Presence"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Bot Card */}
        <button
          onClick={() => setIsAddBotOpen(true)}
          className="carbon-card rounded-2xl p-6 border-2 border-dashed border-white/15 hover:border-purple-500/50 flex flex-col items-center justify-center text-center group transition min-h-[260px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-900/30 group-hover:bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition">
            Add Another Discord Bot
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-[200px]">
            Connect custom bot tokens or test applications with server-side security.
          </p>
        </button>
      </div>
    </div>
  );
};
