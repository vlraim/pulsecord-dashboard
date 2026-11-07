import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import { ModerationConfig } from '../types';
import {
  ShieldAlert,
  Save,
  Plus,
  X,
  AlertTriangle,
  Lock,
  MessageSquare,
  Hash,
  Bell,
  RefreshCw,
} from 'lucide-react';

export const ModerationView: React.FC = () => {
  const { config, updateConfigSection, isSaving, showToast } = useBot();
  const [mod, setMod] = useState<ModerationConfig>(
    config?.moderation || {
      antiSpam: { enabled: true, maxMessages: 5, perSeconds: 3, action: 'TIMEOUT_5M' },
      antiInviteLinks: { enabled: true, whitelistDomains: ['discord.gg/pulse'], action: 'DELETE_AND_WARN' },
      badWordsFilter: { enabled: true, words: ['scam', 'nitro-free', 'phishing'], action: 'DELETE' },
      massMentions: { enabled: true, maxMentions: 4, action: 'TIMEOUT_10M' },
      antiCaps: { enabled: true, percentageThreshold: 70, minChars: 10, action: 'DELETE' },
      modLogChannel: '#mod-audit-logs',
      notifyUserInDM: true,
      maxWarningsBeforeBan: 3,
    }
  );

  const [newDomain, setNewDomain] = useState('');
  const [newWord, setNewWord] = useState('');

  const handleSave = async () => {
    await updateConfigSection('moderation', mod);
  };

  const addDomain = () => {
    if (!newDomain.trim()) return;
    setMod((prev) => ({
      ...prev,
      antiInviteLinks: {
        ...prev.antiInviteLinks,
        whitelistDomains: [...prev.antiInviteLinks.whitelistDomains, newDomain.trim()],
      },
    }));
    setNewDomain('');
  };

  const removeDomain = (domain: string) => {
    setMod((prev) => ({
      ...prev,
      antiInviteLinks: {
        ...prev.antiInviteLinks,
        whitelistDomains: prev.antiInviteLinks.whitelistDomains.filter((d) => d !== domain),
      },
    }));
  };

  const addWord = () => {
    if (!newWord.trim()) return;
    setMod((prev) => ({
      ...prev,
      badWordsFilter: {
        ...prev.badWordsFilter,
        words: [...prev.badWordsFilter.words, newWord.trim().toLowerCase()],
      },
    }));
    setNewWord('');
  };

  const removeWord = (word: string) => {
    setMod((prev) => ({
      ...prev,
      badWordsFilter: {
        ...prev.badWordsFilter,
        words: prev.badWordsFilter.words.filter((w) => w !== word),
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Automated Moderation & Shield</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Defend your server against raids, invite scrapers, spam floods, and toxic behavior in real-time.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/40 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Moderation Shield</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anti-Spam Card */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Anti-Spam Filter</h3>
                <p className="text-[11px] text-neutral-400">Detect and throttle repeated messages</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={mod.antiSpam.enabled}
              onChange={(e) =>
                setMod((prev) => ({
                  ...prev,
                  antiSpam: { ...prev.antiSpam, enabled: e.target.checked },
                }))
              }
              className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Max Messages</label>
              <input
                type="number"
                min={2}
                max={20}
                value={mod.antiSpam.maxMessages}
                onChange={(e) =>
                  setMod((prev) => ({
                    ...prev,
                    antiSpam: { ...prev.antiSpam, maxMessages: parseInt(e.target.value, 10) || 5 },
                  }))
                }
                className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Per Seconds Window</label>
              <input
                type="number"
                min={1}
                max={15}
                value={mod.antiSpam.perSeconds}
                onChange={(e) =>
                  setMod((prev) => ({
                    ...prev,
                    antiSpam: { ...prev.antiSpam, perSeconds: parseInt(e.target.value, 10) || 3 },
                  }))
                }
                className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">Enforcement Action</label>
            <select
              value={mod.antiSpam.action}
              onChange={(e) =>
                setMod((prev) => ({
                  ...prev,
                  antiSpam: { ...prev.antiSpam, action: e.target.value as any },
                }))
              }
              className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="WARN">Warn User</option>
              <option value="TIMEOUT_5M">Timeout for 5 Minutes</option>
              <option value="TIMEOUT_1H">Timeout for 1 Hour</option>
              <option value="KICK">Kick from Server</option>
            </select>
          </div>
        </div>

        {/* Anti-Invite Links */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Anti-Discord Invites</h3>
                <p className="text-[11px] text-neutral-400">Block unauthorized guild invite advertisements</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={mod.antiInviteLinks.enabled}
              onChange={(e) =>
                setMod((prev) => ({
                  ...prev,
                  antiInviteLinks: { ...prev.antiInviteLinks, enabled: e.target.checked },
                }))
              }
              className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 block mb-1.5">Whitelisted Domains</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="e.g. discord.gg/partner"
                className="flex-1 bg-[#131520] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={addDomain}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-semibold text-white"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {mod.antiInviteLinks.whitelistDomains.map((domain) => (
                <span
                  key={domain}
                  className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-[11px] text-purple-300 flex items-center gap-1.5"
                >
                  <span>{domain}</span>
                  <button onClick={() => removeDomain(domain)} className="hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bad Words & Phishing Filter */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-900/40 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Bad Words & Scam Blacklist</h3>
                <p className="text-[11px] text-neutral-400">Auto-delete messages containing flagged strings</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={mod.badWordsFilter.enabled}
              onChange={(e) =>
                setMod((prev) => ({
                  ...prev,
                  badWordsFilter: { ...prev.badWordsFilter, enabled: e.target.checked },
                }))
              }
              className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 block mb-1.5">Blacklist Keywords</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="e.g. steam-gift, free-nitro"
                className="flex-1 bg-[#131520] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={addWord}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-semibold text-white"
              >
                Add Word
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {mod.badWordsFilter.words.map((w) => (
                <span
                  key={w}
                  className="px-2.5 py-1 rounded-lg bg-rose-950/30 border border-rose-500/30 text-[11px] text-rose-300 flex items-center gap-1.5"
                >
                  <span>{w}</span>
                  <button onClick={() => removeWord(w)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Global Mod Channels & Settings */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <div className="pb-3 border-b border-white/10">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" /> Notifications & Audit Routing
            </h3>
            <p className="text-[11px] text-neutral-400">Where moderation action transcripts are logged</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Mod Log Audit Channel</label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  value={mod.modLogChannel}
                  onChange={(e) => setMod((prev) => ({ ...prev, modLogChannel: e.target.value }))}
                  placeholder="#mod-audit-logs"
                  className="w-full bg-[#131520] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
              <div>
                <span className="text-xs font-semibold text-white block">DM Violator Notice</span>
                <span className="text-[10px] text-neutral-400">Send private DM with infraction reason</span>
              </div>
              <input
                type="checkbox"
                checked={mod.notifyUserInDM}
                onChange={(e) => setMod((prev) => ({ ...prev, notifyUserInDM: e.target.checked }))}
                className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
