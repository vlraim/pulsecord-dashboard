import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import { WelcomeConfig } from '../types';
import {
  UserPlus,
  Save,
  Send,
  Eye,
  Hash,
  Palette,
  Sparkles,
  Info,
  RefreshCw,
  Copy,
} from 'lucide-react';
import { DiscordEmbedPreview } from '../components/DiscordEmbedPreview';

export const WelcomeSystemView: React.FC = () => {
  const { config, activeBot, updateConfigSection, testWebhook, isSaving, showToast } = useBot();
  const [welcome, setWelcome] = useState<WelcomeConfig>(
    config?.welcomeSystem || {
      enabled: true,
      channel: '#welcome-lounge',
      sendAsEmbed: true,
      title: 'Welcome to {server}!',
      description: 'Hey {user}, we are thrilled to have you here! You are member #{member_count}. Head over to #rules to get started.',
      color: '#8b5cf6',
      thumbnailUrl: '',
      showFooter: true,
      footerText: 'PulseCord Automated Welcome System',
      sendDirectMessage: true,
      dmMessage: 'Welcome to {server}! If you need help, feel free to open a ticket in #support.',
    }
  );

  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);

  const handleSave = async () => {
    await updateConfigSection('welcomeSystem', welcome);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      showToast('Please enter a valid Discord Webhook URL to test live dispatch', 'error');
      return;
    }

    setIsSendingWebhook(true);
    await testWebhook({
      webhookUrl,
      username: activeBot?.name || 'PulseCord Welcome',
      avatarUrl: activeBot?.avatar || undefined,
      embed: {
        title: welcome.title.replace('{server}', 'Pulse Community'),
        description: welcome.description
          .replace('{user}', '@NewMember')
          .replace('{server}', 'Pulse Community')
          .replace('{member_count}', '14,821'),
        color: welcome.color,
        footer: { text: welcome.footerText },
        thumbnailUrl: welcome.thumbnailUrl,
      },
    });
    setIsSendingWebhook(false);
  };

  // Preview formatting
  const previewTitle = welcome.title.replace('{server}', 'Nexus Alpha');
  const previewDesc = welcome.description
    .replace('{user}', '@SarahConnor')
    .replace('{username}', 'SarahConnor')
    .replace('{server}', 'Nexus Alpha')
    .replace('{member_count}', '14,821');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Welcome Messages & Cards</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Greet newcomers with rich customizable embed banners, role assignments, and private DM greetings.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/40 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Configuration Controls */}
        <div className="space-y-5">
          {/* Main Toggle & Channel */}
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-sm text-white">Enable Welcome Messages</h3>
                <p className="text-[11px] text-neutral-400">Post card when new members join your server</p>
              </div>
              <input
                type="checkbox"
                checked={welcome.enabled}
                onChange={(e) => setWelcome((prev) => ({ ...prev, enabled: e.target.checked }))}
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
                    value={welcome.channel}
                    onChange={(e) => setWelcome((prev) => ({ ...prev, channel: e.target.value }))}
                    placeholder="#welcome-lounge"
                    className="w-full bg-[#131520] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Embed Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={welcome.color}
                    onChange={(e) => setWelcome((prev) => ({ ...prev, color: e.target.value }))}
                    className="w-9 h-9 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={welcome.color}
                    onChange={(e) => setWelcome((prev) => ({ ...prev, color: e.target.value }))}
                    className="flex-1 bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white uppercase"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Card Title</label>
              <input
                type="text"
                value={welcome.title}
                onChange={(e) => setWelcome((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Welcome to {server}!"
                className="w-full bg-[#131520] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-300">Message Description</label>
                <span className="text-[10px] text-purple-300">Supports markdown</span>
              </div>
              <textarea
                value={welcome.description}
                onChange={(e) => setWelcome((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full bg-[#131520] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none leading-relaxed"
              />
              <div className="flex flex-wrap gap-1 mt-1.5 text-[10px] text-neutral-400">
                <span className="bg-white/5 px-1.5 py-0.5 rounded font-mono">{'{user}'}</span>
                <span className="bg-white/5 px-1.5 py-0.5 rounded font-mono">{'{username}'}</span>
                <span className="bg-white/5 px-1.5 py-0.5 rounded font-mono">{'{server}'}</span>
                <span className="bg-white/5 px-1.5 py-0.5 rounded font-mono">{'{member_count}'}</span>
              </div>
            </div>
          </div>

          {/* DM Welcome Option */}
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-sm text-white">Direct Message Welcome</h3>
                <p className="text-[11px] text-neutral-400">Dispatch an onboarding DM to new members</p>
              </div>
              <input
                type="checkbox"
                checked={welcome.sendDirectMessage}
                onChange={(e) => setWelcome((prev) => ({ ...prev, sendDirectMessage: e.target.checked }))}
                className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
              />
            </div>

            {welcome.sendDirectMessage && (
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">DM Body</label>
                <textarea
                  value={welcome.dmMessage}
                  onChange={(e) => setWelcome((prev) => ({ ...prev, dmMessage: e.target.value }))}
                  rows={2}
                  className="w-full bg-[#131520] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Real Discord Webhook Tester */}
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-purple-400" /> Test Live in Your Discord Channel
            </h4>
            <p className="text-[11px] text-neutral-400">
              Paste a Discord Channel Webhook URL (Integrations → Webhooks) to dispatch this card into your actual server.
            </p>
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
                <span>Send Test</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Discord Preview */}
        <div className="space-y-4">
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" /> Live Discord Channel Mockup
              </h3>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/30">
                {welcome.channel}
              </span>
            </div>

            <div className="flex justify-center">
              <DiscordEmbedPreview
                botName={activeBot?.name || 'PulseCord Sentinel'}
                botAvatar={activeBot?.avatar}
                title={previewTitle}
                description={previewDesc}
                color={welcome.color}
                thumbnailUrl={welcome.thumbnailUrl}
                footer={{ text: welcome.footerText }}
                buttons={[
                  { label: 'Read Server Rules', emoji: '📜' },
                  { label: 'Claim Member Roles', emoji: '⭐' },
                ]}
                reactions={[
                  { emoji: '👋', count: 12, active: true },
                  { emoji: '🎉', count: 7 },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
