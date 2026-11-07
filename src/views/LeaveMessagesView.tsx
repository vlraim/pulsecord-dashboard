import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import { LeaveConfig } from '../types';
import {
  UserMinus,
  Save,
  Send,
  Eye,
  Hash,
  Palette,
  RefreshCw,
} from 'lucide-react';
import { DiscordEmbedPreview } from '../components/DiscordEmbedPreview';

export const LeaveMessagesView: React.FC = () => {
  const { config, activeBot, updateConfigSection, testWebhook, isSaving, showToast } = useBot();
  const [leave, setLeave] = useState<LeaveConfig>(
    config?.leaveMessages || {
      enabled: true,
      channel: '#goodbye-logs',
      sendAsEmbed: true,
      title: 'Farewell, {user}',
      description: '{username} just departed from the server. We now have {member_count} members remaining.',
      color: '#ef4444',
    }
  );

  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);

  const handleSave = async () => {
    await updateConfigSection('leaveMessages', leave);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      showToast('Please enter a valid Discord Webhook URL', 'error');
      return;
    }

    setIsSendingWebhook(true);
    await testWebhook({
      webhookUrl,
      username: activeBot?.name || 'Pulse Goodbye',
      avatarUrl: activeBot?.avatar || undefined,
      embed: {
        title: leave.title.replace('{user}', '@GhostMember'),
        description: leave.description
          .replace('{user}', '@GhostMember')
          .replace('{username}', 'GhostMember')
          .replace('{member_count}', '14,820'),
        color: leave.color,
      },
    });
    setIsSendingWebhook(false);
  };

  const previewTitle = leave.title.replace('{user}', '@Alex_V');
  const previewDesc = leave.description
    .replace('{user}', '@Alex_V')
    .replace('{username}', 'Alex_V')
    .replace('{member_count}', '14,820');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Leave & Farewell Notifications</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Track departing server members with automated goodbye logs and updated headcount counters.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/40 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Farewell Config</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-5">
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-sm text-white">Enable Leave Messages</h3>
                <p className="text-[11px] text-neutral-400">Post card when someone leaves or gets kicked</p>
              </div>
              <input
                type="checkbox"
                checked={leave.enabled}
                onChange={(e) => setLeave((prev) => ({ ...prev, enabled: e.target.checked }))}
                className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Target Channel</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                  <input
                    type="text"
                    value={leave.channel}
                    onChange={(e) => setLeave((prev) => ({ ...prev, channel: e.target.value }))}
                    placeholder="#goodbye-logs"
                    className="w-full bg-[#131520] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={leave.color}
                    onChange={(e) => setLeave((prev) => ({ ...prev, color: e.target.value }))}
                    className="w-9 h-9 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={leave.color}
                    onChange={(e) => setLeave((prev) => ({ ...prev, color: e.target.value }))}
                    className="flex-1 bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white uppercase"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Farewell Title</label>
              <input
                type="text"
                value={leave.title}
                onChange={(e) => setLeave((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full bg-[#131520] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Description</label>
              <textarea
                value={leave.description}
                onChange={(e) => setLeave((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full bg-[#131520] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
              <div className="flex gap-1 mt-1 text-[10px] text-neutral-400">
                <span className="bg-white/5 px-1.5 py-0.5 rounded font-mono">{'{user}'}</span>
                <span className="bg-white/5 px-1.5 py-0.5 rounded font-mono">{'{username}'}</span>
                <span className="bg-white/5 px-1.5 py-0.5 rounded font-mono">{'{member_count}'}</span>
              </div>
            </div>
          </div>

          {/* Webhook Tester */}
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-purple-400" /> Test Farewell Webhook
            </h4>
            <div className="flex gap-2">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="flex-1 bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={isSendingWebhook}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
              >
                {isSendingWebhook ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" /> Discord Message Preview
            </h3>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded">
              {leave.channel}
            </span>
          </div>

          <div className="flex justify-center">
            <DiscordEmbedPreview
              botName={activeBot?.name || 'PulseCord Sentinel'}
              botAvatar={activeBot?.avatar}
              title={previewTitle}
              description={previewDesc}
              color={leave.color}
              footer={{ text: 'Member Departure Logger' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
