import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import {
  X,
  Bot,
  Key,
  Shield,
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  Link,
  Lock,
} from 'lucide-react';

const PERMISSIONS = [
  { bit: 8, label: 'Administrator (All Permissions)', default: true },
  { bit: 32, label: 'Manage Server', default: true },
  { bit: 268435456, label: 'Manage Roles', default: true },
  { bit: 16, label: 'Manage Channels', default: true },
  { bit: 2, label: 'Kick Members', default: true },
  { bit: 4, label: 'Ban Members', default: true },
  { bit: 2048, label: 'Send Messages', default: true },
  { bit: 16384, label: 'Embed Links', default: true },
  { bit: 32768, label: 'Attach Files', default: true },
  { bit: 65536, label: 'Read Message History', default: true },
  { bit: 64, label: 'Add Reactions', default: true },
  { bit: 1099511627776, label: 'Use Slash Commands', default: true },
];

export const AddBotModal: React.FC = () => {
  const { isAddBotOpen, setIsAddBotOpen, validateAndAddBot, showToast } = useBot();
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [prefix, setPrefix] = useState('!');
  const [showToken, setShowToken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [clientId, setClientId] = useState('119827364528192837');
  const [selectedPerms, setSelectedPerms] = useState<number[]>(
    PERMISSIONS.map((p) => p.bit)
  );

  if (!isAddBotOpen) return null;

  // Calculate permissions bitwise sum
  const calculatedPerms = selectedPerms.reduce((acc, bit) => acc | bit, 0);
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId || 'YOUR_APPLICATION_ID'}&permissions=${calculatedPerms}&scope=bot%20applications.commands`;

  const togglePerm = (bit: number) => {
    if (selectedPerms.includes(bit)) {
      setSelectedPerms(selectedPerms.filter((b) => b !== bit));
    } else {
      setSelectedPerms([...selectedPerms, bit]);
    }
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    showToast('Discord invite link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      showToast('Please enter your Discord Bot Token or select Sandbox', 'error');
      return;
    }

    setIsSubmitting(true);
    await validateAndAddBot(token, name || undefined, prefix || '!');
    setIsSubmitting(false);
  };

  const handleLoadSandboxBot = async () => {
    setIsSubmitting(true);
    await validateAndAddBot('test_sandbox_guardian_token_' + Date.now(), 'Chronos Sentinel', '/');
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0e1017] border border-purple-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Connect Discord Bot</h3>
              <p className="text-xs text-neutral-400">Link your bot application to unlock all features</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddBotOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-5 p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-start gap-3">
          <Lock className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-purple-200/90 leading-relaxed">
            <span className="font-semibold text-white">Zero Token Exposure:</span> Your bot token is validated strictly through our backend proxy and securely stored server-side. It is never exposed in browser storage, console logs, or frontend code.
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Discord Bot Token *</span>
              <a
                href="https://discord.com/developers/applications"
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[11px] normal-case"
              >
                Get Token on Discord Portal <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="MTI...Your.Real.Discord.Bot.Token..."
                className="w-full bg-[#151722] border border-white/15 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none transition pr-11"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-white transition"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Bot Application Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Sentinel"
                className="w-full bg-[#151722] border border-white/15 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Default Prefix
              </label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="!"
                className="w-full bg-[#151722] border border-white/15 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Discord Dev Portal Instructions Accordion */}
          <div className="p-4 rounded-xl bg-[#141724] border border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> 4-Step Quick Setup Guide
            </h4>
            <ol className="text-xs text-neutral-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Open <span className="text-purple-300 font-mono">discord.com/developers/applications</span> and click <span className="font-semibold text-white">New Application</span>.</li>
              <li>Navigate to the <span className="font-semibold text-white">Bot</span> tab and click <span className="text-purple-300 font-medium">Reset Token</span> to copy your bot token.</li>
              <li>Under <span className="font-semibold text-white">Privileged Gateway Intents</span>, toggle ON <span className="text-purple-300">Message Content Intent</span> & <span className="text-purple-300">Server Members Intent</span>.</li>
              <li>Paste the token above to instantly link your bot into PulseCord!</li>
            </ol>
          </div>

          {/* Bot Invite Generator Section */}
          <div className="p-4 rounded-xl bg-[#141724] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-purple-400" /> Bot Permission Calculator & Invite Link
              </span>
              <span className="text-[11px] text-purple-400 font-mono">Bits: {calculatedPerms}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {PERMISSIONS.map((perm) => (
                <label
                  key={perm.bit}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer select-none transition ${
                    selectedPerms.includes(perm.bit)
                      ? 'bg-purple-900/30 border-purple-500/50 text-white'
                      : 'bg-black/20 border-white/5 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPerms.includes(perm.bit)}
                    onChange={() => togglePerm(perm.bit)}
                    className="rounded border-neutral-600 text-purple-600 focus:ring-purple-500 h-3.5 w-3.5"
                  />
                  <span className="truncate text-[11px]">{perm.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-neutral-300 select-all"
              />
              <button
                type="button"
                onClick={handleCopyInvite}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold flex items-center gap-1 flex-shrink-0 transition"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
              <a
                href={inviteUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-semibold flex items-center gap-1 text-white flex-shrink-0 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Invite</span>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={handleLoadSandboxBot}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/30 text-purple-300 text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Try Sandbox Bot Instantly</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsAddBotOpen(false)}
                className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Validating...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>Connect Bot</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
