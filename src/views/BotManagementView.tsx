import React, { useState, useEffect } from 'react';
import { useBot } from '../context/BotContext';
import { ActivityType, BotStatus } from '../types';
import {
  Sliders,
  Activity,
  CheckCircle,
  Radio,
  Shield,
  Save,
  RefreshCw,
  Sparkles,
  Info,
  Bot,
} from 'lucide-react';
import { InitialsAvatar } from '../components/InitialsAvatar';

export const BotManagementView: React.FC = () => {
  const { activeBot, config, updateBotStatus, updateConfigSection, isSaving } = useBot();

  const [activityType, setActivityType] = useState<ActivityType>(activeBot?.activityType || 'WATCHING');
  const [activityText, setActivityText] = useState(activeBot?.activityText || '');
  const [status, setStatus] = useState<BotStatus>(activeBot?.status || 'online');
  const [prefix, setPrefix] = useState(activeBot?.prefix || '!');
  const [slashCommandsEnabled, setSlashCommandsEnabled] = useState(activeBot?.slashCommandsEnabled ?? true);
  const [intents, setIntents] = useState<Record<string, boolean>>(
    config?.botManagement?.intents || {
      guilds: true,
      guildMembers: true,
      guildBans: true,
      guildMessages: true,
      guildMessageReactions: true,
      directMessages: true,
      messageContent: true,
    }
  );

  useEffect(() => {
    if (activeBot) {
      setActivityType(activeBot.activityType);
      setActivityText(activeBot.activityText);
      setStatus(activeBot.status);
      setPrefix(activeBot.prefix);
      setSlashCommandsEnabled(activeBot.slashCommandsEnabled);
    }
  }, [activeBot]);

  const toggleIntent = (key: string) => {
    setIntents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    await updateBotStatus({
      status,
      activityType,
      activityText,
      prefix,
      slashCommandsEnabled,
    });

    await updateConfigSection('botManagement', {
      activityType,
      activityText,
      status,
      prefix,
      slashCommandsEnabled,
      intents,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Bot Presence & Gateway Management</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Configure rich presence activities, connection status, gateway intents, and command dispatch rules.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/40 disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Activity State Card */}
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" /> Discord Presence Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Activity Type
                </label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as ActivityType)}
                  className="w-full bg-[#131520] border border-white/10 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition"
                >
                  <option value="PLAYING">Playing</option>
                  <option value="STREAMING">Streaming</option>
                  <option value="LISTENING">Listening to</option>
                  <option value="WATCHING">Watching</option>
                  <option value="COMPETING">Competing in</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Online Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BotStatus)}
                  className="w-full bg-[#131520] border border-white/10 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition"
                >
                  <option value="online">Online (Green)</option>
                  <option value="idle">Idle (Amber)</option>
                  <option value="dnd">Do Not Disturb (Red)</option>
                  <option value="offline">Invisible / Offline</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Activity Text
              </label>
              <input
                type="text"
                value={activityText}
                onChange={(e) => setActivityText(e.target.value)}
                placeholder="e.g. over 14,820 members | /help"
                className="w-full bg-[#131520] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Command Dispatch Settings */}
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" /> Command Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Custom Command Prefix
                </label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full bg-[#131520] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none transition"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/20 border border-white/5">
                <div>
                  <span className="font-semibold text-xs text-white block">Slash Commands</span>
                  <span className="text-[11px] text-neutral-400">Respond to native / commands</span>
                </div>
                <input
                  type="checkbox"
                  checked={slashCommandsEnabled}
                  onChange={(e) => setSlashCommandsEnabled(e.target.checked)}
                  className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
                />
              </div>
            </div>
          </div>

          {/* Privileged Gateway Intents */}
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" /> Gateway Intents Architecture
              </h3>
              <span className="text-[10px] text-purple-300 font-mono">v10 WebSocket</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { key: 'guilds', label: 'Guilds Intent', desc: 'Server join and leave events' },
                { key: 'guildMembers', label: 'Guild Members (Privileged)', desc: 'Auto roles & welcome triggers' },
                { key: 'guildBans', label: 'Guild Bans', desc: 'Moderation audit logs' },
                { key: 'guildMessages', label: 'Guild Messages', desc: 'Chat command triggers' },
                { key: 'messageContent', label: 'Message Content (Privileged)', desc: 'Anti-spam & bad word filters' },
                { key: 'guildMessageReactions', label: 'Message Reactions', desc: 'Reaction roles & giveaways' },
                { key: 'directMessages', label: 'Direct Messages', desc: 'DM welcome messages' },
              ].map((item) => (
                <label
                  key={item.key}
                  className={`p-3 rounded-xl border cursor-pointer select-none transition flex items-start gap-3 ${
                    intents[item.key]
                      ? 'bg-purple-950/20 border-purple-500/40 text-white'
                      : 'bg-black/20 border-white/5 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(intents[item.key])}
                    onChange={() => toggleIntent(item.key)}
                    className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
                  />
                  <div>
                    <span className="text-xs font-semibold block">{item.label}</span>
                    <span className="text-[10px] text-neutral-400">{item.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Discord Presence Mockup */}
        <div className="space-y-4">
          <div className="carbon-card rounded-2xl p-5 border border-purple-500/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Discord User Profile Preview
            </h4>

            {/* Profile Popout Card Simulation */}
            <div className="rounded-2xl overflow-hidden bg-[#232428] border border-[#3f4147] shadow-2xl">
              {/* Banner */}
              <div className="h-16 bg-gradient-to-r from-purple-700 to-indigo-800 relative" />

              {/* Avatar + Status */}
              <div className="px-4 pb-4 relative">
                <div className="relative -mt-9 mb-3">
                  <InitialsAvatar
                    name={activeBot?.name || 'Pulse Bot'}
                    size="2xl"
                    shape="circle"
                    status={status}
                    className="border-4 border-[#232428] text-xl font-black shadow-lg"
                  />
                </div>

                <div className="bg-[#111214] p-3 rounded-xl text-xs space-y-2">
                  <div className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>{activeBot?.name}</span>
                    <span className="bg-[#5865F2] text-white text-[9px] font-bold px-1 rounded uppercase">
                      BOT
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    {activeBot?.name.toLowerCase().replace(/\s+/g, '')}
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                      Activity
                    </span>
                    <div className="flex items-center gap-2 text-white font-medium text-xs">
                      <Activity className="w-3.5 h-3.5 text-purple-400" />
                      <span className="truncate">
                        {activityType.charAt(0) + activityType.slice(1).toLowerCase()} {activityText || 'over server'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
