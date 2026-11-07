import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import { CustomEmbedItem, CustomEmbedField } from '../types';
import {
  Palette,
  Plus,
  Trash2,
  Save,
  Send,
  Eye,
  Code,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { DiscordEmbedPreview } from '../components/DiscordEmbedPreview';

export const CustomEmbedsView: React.FC = () => {
  const { config, activeBot, updateConfigSection, testWebhook, isSaving, showToast } = useBot();
  const [embeds, setEmbeds] = useState<CustomEmbedItem[]>(config?.customEmbeds || []);
  const [activeEmbedId, setActiveEmbedId] = useState<string>(embeds[0]?.id || '');

  const [activeEmbed, setActiveEmbed] = useState<CustomEmbedItem>(
    embeds[0] || {
      id: `emb_${Date.now()}`,
      name: 'Server Rules & Code of Conduct',
      title: '📜 Server Code of Conduct',
      description: 'Welcome to our community! Please follow these guidelines to keep our environment safe, productive, and inclusive for everyone.',
      color: '#8b5cf6',
      author: { name: 'PulseCord Sentinel' },
      fields: [
        { name: '1. Respect Others', value: 'Treat all members with courtesy. Harassment, hate speech, and toxicity will not be tolerated.', inline: false },
        { name: '2. No Spam or Self-Promotion', value: 'Keep advertisements restricted to dedicated showcase channels.', inline: false },
        { name: '3. Follow Discord ToS', value: 'Observe all terms of service provided by Discord platform at all times.', inline: false },
      ],
      footer: { text: 'Rules enforced by PulseCord Auto-Mod' },
      timestamp: true,
    }
  );

  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const handleSaveAll = async () => {
    const updated = embeds.map((e) => (e.id === activeEmbed.id ? activeEmbed : e));
    if (!updated.some((e) => e.id === activeEmbed.id)) {
      updated.push(activeEmbed);
    }
    setEmbeds(updated);
    await updateConfigSection('customEmbeds', updated);
  };

  const handleAddField = () => {
    const newField: CustomEmbedField = {
      name: `Field ${activeEmbed.fields.length + 1}`,
      value: 'Field description text here',
      inline: false,
    };
    setActiveEmbed((prev) => ({ ...prev, fields: [...prev.fields, newField] }));
  };

  const handleRemoveField = (index: number) => {
    setActiveEmbed((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateField = (index: number, key: keyof CustomEmbedField, val: any) => {
    setActiveEmbed((prev) => {
      const nextFields = [...prev.fields];
      nextFields[index] = { ...nextFields[index], [key]: val };
      return { ...prev, fields: nextFields };
    });
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      showToast('Please enter a valid Discord Webhook URL', 'error');
      return;
    }

    setIsSendingWebhook(true);
    await testWebhook({
      webhookUrl,
      username: activeBot?.name || 'Pulse Embed Builder',
      avatarUrl: activeBot?.avatar || undefined,
      embed: activeEmbed,
    });
    setIsSendingWebhook(false);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(activeEmbed, null, 2));
    setCopiedJson(true);
    showToast('Embed JSON copied to clipboard!', 'success');
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Visual Discord Embed Builder</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Craft rich interactive Discord embeds with live real-time preview and instant webhook dispatch.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowJsonModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 transition flex items-center gap-1.5"
          >
            <Code className="w-3.5 h-3.5 text-purple-400" />
            <span>JSON</span>
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/40 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Embed</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Embed Editor Controls */}
        <div className="space-y-5">
          {/* Main Info */}
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" /> Embed Content & Styling
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] text-neutral-400 block mb-1">Embed Title</label>
                <input
                  type="text"
                  value={activeEmbed.title}
                  onChange={(e) => setActiveEmbed({ ...activeEmbed, title: e.target.value })}
                  placeholder="Title"
                  className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeEmbed.color}
                    onChange={(e) => setActiveEmbed({ ...activeEmbed, color: e.target.value })}
                    className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={activeEmbed.color}
                    onChange={(e) => setActiveEmbed({ ...activeEmbed, color: e.target.value })}
                    className="w-full bg-[#131520] border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Description (Markdown Supported)</label>
              <textarea
                value={activeEmbed.description}
                onChange={(e) => setActiveEmbed({ ...activeEmbed, description: e.target.value })}
                rows={4}
                className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Author Name</label>
                <input
                  type="text"
                  value={activeEmbed.author?.name || ''}
                  onChange={(e) =>
                    setActiveEmbed({
                      ...activeEmbed,
                      author: { ...activeEmbed.author, name: e.target.value },
                    })
                  }
                  placeholder="Author / Bot Name"
                  className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Author Icon URL</label>
                <input
                  type="url"
                  value={activeEmbed.author?.iconUrl || ''}
                  onChange={(e) =>
                    setActiveEmbed({
                      ...activeEmbed,
                      author: { ...activeEmbed.author, iconUrl: e.target.value },
                    })
                  }
                  placeholder="https://..."
                  className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Footer Text</label>
                <input
                  type="text"
                  value={activeEmbed.footer?.text || ''}
                  onChange={(e) =>
                    setActiveEmbed({
                      ...activeEmbed,
                      footer: { ...activeEmbed.footer, text: e.target.value },
                    })
                  }
                  placeholder="Footer Note"
                  className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 mt-auto">
                <span className="text-[11px] text-neutral-300">Show Timestamp</span>
                <input
                  type="checkbox"
                  checked={activeEmbed.timestamp}
                  onChange={(e) => setActiveEmbed({ ...activeEmbed, timestamp: e.target.checked })}
                  className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
                />
              </div>
            </div>
          </div>

          {/* Fields Editor */}
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">Embed Fields ({activeEmbed.fields.length})</h3>
              <button
                type="button"
                onClick={handleAddField}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Field
              </button>
            </div>

            <div className="space-y-3">
              {activeEmbed.fields.map((f, i) => (
                <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={f.name}
                      onChange={(e) => handleUpdateField(i, 'name', e.target.value)}
                      placeholder="Field Name"
                      className="flex-1 bg-[#131520] border border-white/10 rounded-lg px-2.5 py-1 text-white font-semibold"
                    />
                    <label className="flex items-center gap-1.5 text-[11px] text-neutral-400 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={f.inline}
                        onChange={(e) => handleUpdateField(i, 'inline', e.target.checked)}
                        className="rounded text-purple-600"
                      />
                      <span>Inline</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveField(i)}
                      className="text-neutral-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    value={f.value}
                    onChange={(e) => handleUpdateField(i, 'value', e.target.value)}
                    placeholder="Field Value"
                    rows={2}
                    className="w-full bg-[#131520] border border-white/10 rounded-lg px-2.5 py-1 text-white leading-snug"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Webhook Test Dispatcher */}
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-purple-400" /> Dispatch to Real Discord Channel
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

        {/* Right: Live Discord Embed Preview */}
        <div className="space-y-4">
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" /> Real-Time Discord Preview
              </h3>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded">
                Live Output
              </span>
            </div>

            <div className="flex justify-center">
              <DiscordEmbedPreview
                botName={activeBot?.name || 'PulseCord Bot'}
                botAvatar={activeBot?.avatar}
                title={activeEmbed.title}
                description={activeEmbed.description}
                color={activeEmbed.color}
                author={activeEmbed.author}
                fields={activeEmbed.fields}
                footer={activeEmbed.footer}
                thumbnailUrl={activeEmbed.thumbnailUrl}
                imageUrl={activeEmbed.imageUrl}
                timestamp={activeEmbed.timestamp}
              />
            </div>
          </div>
        </div>
      </div>

      {/* JSON Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e1017] border border-purple-500/30 rounded-2xl shadow-2xl p-6 max-w-lg w-full text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">Discord Embed Payload JSON</h3>
              <button onClick={() => setShowJsonModal(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <pre className="p-3 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-purple-200 overflow-x-auto max-h-80">
              {JSON.stringify(activeEmbed, null, 2)}
            </pre>

            <div className="flex justify-end gap-2">
              <button
                onClick={copyJson}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-bold text-white flex items-center gap-1.5"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
