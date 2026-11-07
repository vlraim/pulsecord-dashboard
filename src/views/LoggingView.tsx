import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import { LoggingConfig } from '../types';
import {
  FileText,
  Save,
  Hash,
  CheckCircle,
  XCircle,
  RefreshCw,
  Sliders,
  Shield,
} from 'lucide-react';

export const LoggingView: React.FC = () => {
  const { config, updateConfigSection, isSaving } = useBot();
  const [logging, setLogging] = useState<LoggingConfig>(
    config?.logging || {
      messageDelete: { enabled: true, channel: '#message-logs' },
      messageEdit: { enabled: true, channel: '#message-logs' },
      memberJoin: { enabled: true, channel: '#member-logs' },
      memberLeave: { enabled: true, channel: '#member-logs' },
      roleUpdates: { enabled: true, channel: '#role-logs' },
      voiceState: { enabled: false, channel: '#voice-logs' },
      channelModifications: { enabled: true, channel: '#admin-logs' },
    }
  );

  const handleSave = async () => {
    await updateConfigSection('logging', logging);
  };

  const enableAll = () => {
    const updated = { ...logging };
    (Object.keys(updated) as Array<keyof LoggingConfig>).forEach((k) => {
      updated[k] = { ...updated[k], enabled: true };
    });
    setLogging(updated);
  };

  const disableAll = () => {
    const updated = { ...logging };
    (Object.keys(updated) as Array<keyof LoggingConfig>).forEach((k) => {
      updated[k] = { ...updated[k], enabled: false };
    });
    setLogging(updated);
  };

  const logEvents: Array<{
    key: keyof LoggingConfig;
    label: string;
    desc: string;
    defaultChannel: string;
  }> = [
    { key: 'messageDelete', label: 'Message Deleted', desc: 'Log ghost-deleted messages and attachments', defaultChannel: '#message-logs' },
    { key: 'messageEdit', label: 'Message Edited', desc: 'Record message edits with before/after diff', defaultChannel: '#message-logs' },
    { key: 'memberJoin', label: 'Member Joined', desc: 'Track account age and invite link utilized', defaultChannel: '#member-logs' },
    { key: 'memberLeave', label: 'Member Left / Kicked', desc: 'Departure logs with stay duration', defaultChannel: '#member-logs' },
    { key: 'roleUpdates', label: 'Role Changes', desc: 'Audit role creations, deletions, and member grants', defaultChannel: '#role-logs' },
    { key: 'voiceState', label: 'Voice Channel Activity', desc: 'Connect, disconnect, and mute events', defaultChannel: '#voice-logs' },
    { key: 'channelModifications', label: 'Channel & Category Changes', desc: 'Permission overwrites and channel creation', defaultChannel: '#admin-logs' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Server Audit Logs & Monitoring</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Map granular Discord server events to specific staff channels with real-time audit logging.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={enableAll}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold"
          >
            Enable All
          </button>
          <button
            onClick={disableAll}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold"
          >
            Disable All
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/40 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Log Channels</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {logEvents.map((evt) => {
          const item = logging[evt.key];
          return (
            <div
              key={evt.key}
              className={`carbon-card rounded-2xl p-5 border transition-all ${
                item.enabled ? 'border-purple-500/30' : 'border-white/5 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <h3 className="font-bold text-sm text-white">{evt.label}</h3>
                  <p className="text-[11px] text-neutral-400">{evt.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={(e) =>
                    setLogging((prev) => ({
                      ...prev,
                      [evt.key]: { ...prev[evt.key], enabled: e.target.checked },
                    }))
                  }
                  className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
                />
              </div>

              <div className="mt-3">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                  Dispatch Channel
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                  <input
                    type="text"
                    value={item.channel}
                    onChange={(e) =>
                      setLogging((prev) => ({
                        ...prev,
                        [evt.key]: { ...prev[evt.key], channel: e.target.value },
                      }))
                    }
                    disabled={!item.enabled}
                    placeholder={evt.defaultChannel}
                    className="w-full bg-[#131520] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white focus:border-purple-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
