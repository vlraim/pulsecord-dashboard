import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import { TicketConfig } from '../types';
import {
  Ticket,
  Save,
  Send,
  Eye,
  Hash,
  Shield,
  Layers,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { DiscordEmbedPreview } from '../components/DiscordEmbedPreview';

export const TicketSystemView: React.FC = () => {
  const { config, activeBot, updateConfigSection, testWebhook, isSaving, showToast } = useBot();
  const [ticket, setTicket] = useState<TicketConfig>(
    config?.ticketSystem || {
      enabled: true,
      categoryName: 'SUPPORT TICKETS',
      transcriptChannel: '#ticket-transcripts',
      supportTeamRole: 'Senior Staff',
      maxOpenTicketsPerUser: 1,
      ticketPanelTitle: '🎫 Need Assistance? Open a Support Ticket',
      ticketPanelDescription: 'Our moderation and support staff are here to assist you with inquiries, server appeals, or bug reports. Click the button below to start a private session.',
      buttonLabel: 'Create Support Ticket',
      buttonEmoji: '📩',
      welcomeInsideTicket: 'Hello {user}! A staff member will be with you shortly. Please describe your inquiry with details.',
    }
  );

  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);

  const handleSave = async () => {
    await updateConfigSection('ticketSystem', ticket);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      showToast('Please enter a valid Discord Webhook URL', 'error');
      return;
    }

    setIsSendingWebhook(true);
    await testWebhook({
      webhookUrl,
      username: activeBot?.name || 'Pulse Support Dispatcher',
      avatarUrl: activeBot?.avatar || undefined,
      embed: {
        title: ticket.ticketPanelTitle,
        description: ticket.ticketPanelDescription,
        color: '#8b5cf6',
        footer: { text: `Assigned to @${ticket.supportTeamRole} Team` },
      },
    });
    setIsSendingWebhook(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Support Ticket Panel & Transcripts</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Deploy interactive ticket panels with private channels, staff pings, and HTML transcripts.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/40 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Ticket System</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="space-y-5">
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-sm text-white">Enable Ticket Engine</h3>
                <p className="text-[11px] text-neutral-400">Spawn private member channels with staff permissions</p>
              </div>
              <input
                type="checkbox"
                checked={ticket.enabled}
                onChange={(e) => setTicket((prev) => ({ ...prev, enabled: e.target.checked }))}
                className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Category Name</label>
                <div className="relative">
                  <Layers className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                  <input
                    type="text"
                    value={ticket.categoryName}
                    onChange={(e) => setTicket((prev) => ({ ...prev, categoryName: e.target.value }))}
                    className="w-full bg-[#131520] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Transcript Channel</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                  <input
                    type="text"
                    value={ticket.transcriptChannel}
                    onChange={(e) => setTicket((prev) => ({ ...prev, transcriptChannel: e.target.value }))}
                    className="w-full bg-[#131520] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Support Staff Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                  <input
                    type="text"
                    value={ticket.supportTeamRole}
                    onChange={(e) => setTicket((prev) => ({ ...prev, supportTeamRole: e.target.value }))}
                    className="w-full bg-[#131520] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Max Open Tickets / User</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={ticket.maxOpenTicketsPerUser}
                  onChange={(e) =>
                    setTicket((prev) => ({
                      ...prev,
                      maxOpenTicketsPerUser: parseInt(e.target.value, 10) || 1,
                    }))
                  }
                  className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Panel Title</label>
              <input
                type="text"
                value={ticket.ticketPanelTitle}
                onChange={(e) => setTicket((prev) => ({ ...prev, ticketPanelTitle: e.target.value }))}
                className="w-full bg-[#131520] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Panel Instructions</label>
              <textarea
                value={ticket.ticketPanelDescription}
                onChange={(e) => setTicket((prev) => ({ ...prev, ticketPanelDescription: e.target.value }))}
                rows={3}
                className="w-full bg-[#131520] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Button Label</label>
                <input
                  type="text"
                  value={ticket.buttonLabel}
                  onChange={(e) => setTicket((prev) => ({ ...prev, buttonLabel: e.target.value }))}
                  className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Button Emoji</label>
                <input
                  type="text"
                  value={ticket.buttonEmoji}
                  onChange={(e) => setTicket((prev) => ({ ...prev, buttonEmoji: e.target.value }))}
                  className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Webhook Tester */}
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-purple-400" /> Dispatch Ticket Panel to Real Discord Channel
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
                <span>Dispatch</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" /> Interactive Ticket Panel Mockup
            </h3>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded">
              #{ticket.categoryName.toLowerCase().replace(/\s+/g, '-')}
            </span>
          </div>

          <div className="flex justify-center">
            <DiscordEmbedPreview
              botName={activeBot?.name || 'Pulse Ticket Bot'}
              botAvatar={activeBot?.avatar}
              title={ticket.ticketPanelTitle}
              description={ticket.ticketPanelDescription}
              color="#8b5cf6"
              fields={[
                { name: 'Handling Team', value: `@${ticket.supportTeamRole}`, inline: true },
                { name: 'Transcripts', value: ticket.transcriptChannel, inline: true },
              ]}
              buttons={[
                { label: ticket.buttonLabel, emoji: ticket.buttonEmoji, style: 'primary' },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
