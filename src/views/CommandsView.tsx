import React, { useState, useEffect } from 'react';
import { useBot } from '../context/BotContext';
import { BotCommand } from '../types';
import {
  Terminal,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  Sliders,
  Shield,
  Clock,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';

export const CommandsView: React.FC = () => {
  const { config, updateConfigSection, syncSlashCommands, showToast, isSaving } = useBot();
  const [commands, setCommands] = useState<BotCommand[]>(config?.commands || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Sync state whenever config updates or loads asynchronously
  useEffect(() => {
    if (config?.commands && config.commands.length > 0) {
      setCommands(config.commands);
    }
  }, [config?.commands]);

  // New Command Form State
  const [newCmdName, setNewCmdName] = useState('');
  const [newCmdDesc, setNewCmdDesc] = useState('');
  const [newCmdCategory, setNewCmdCategory] = useState<BotCommand['category']>('Custom');
  const [newCmdResponse, setNewCmdResponse] = useState('');
  const [newCmdCooldown, setNewCmdCooldown] = useState(3);

  const categories = ['All', 'Moderation', 'Utility', 'Leveling', 'Giveaways', 'Custom'];

  const filteredCommands = commands.filter((cmd) => {
    const matchesCat = selectedCategory === 'All' || cmd.category === selectedCategory;
    const matchesSearch =
      cmd.name.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase()) ||
      (cmd.userPerms && cmd.userPerms.some((p) => p.toLowerCase().includes(search.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  const toggleCommandEnabled = async (id: string) => {
    const updated = commands.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c));
    setCommands(updated);
    await updateConfigSection('commands', updated);
  };

  const toggleCommandSlash = async (id: string) => {
    const updated = commands.map((c) => (c.id === id ? { ...c, slash: !c.slash } : c));
    setCommands(updated);
    await updateConfigSection('commands', updated);
  };

  const toggleCommandPrefix = async (id: string) => {
    const updated = commands.map((c) => (c.id === id ? { ...c, prefix: !c.prefix } : c));
    setCommands(updated);
    await updateConfigSection('commands', updated);
  };

  const handleCooldownChange = async (id: string, cooldown: number) => {
    const updated = commands.map((c) => (c.id === id ? { ...c, cooldown } : c));
    setCommands(updated);
    await updateConfigSection('commands', updated);
  };

  const handleDeleteCommand = async (id: string) => {
    const updated = commands.filter((c) => c.id !== id);
    setCommands(updated);
    await updateConfigSection('commands', updated);
    showToast('Command removed', 'info');
  };

  const handleCopyCommand = (name: string) => {
    navigator.clipboard?.writeText(`/${name}`);
    setCopiedCmd(name);
    showToast(`Copied /${name} to clipboard`, 'info');
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleAddCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCmdName.trim()) {
      showToast('Command name is required', 'error');
      return;
    }

    const cleanName = newCmdName.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const newCmd: BotCommand = {
      id: `cmd_${Date.now()}`,
      name: cleanName,
      description: newCmdDesc || 'Custom automated command response',
      category: newCmdCategory,
      enabled: true,
      slash: true,
      prefix: true,
      cooldown: newCmdCooldown,
      userPerms: [],
      response: newCmdResponse || 'Default command response',
    };

    const updated = [...commands, newCmd];
    setCommands(updated);
    await updateConfigSection('commands', updated);
    setIsAddModalOpen(false);
    setNewCmdName('');
    setNewCmdDesc('');
    setNewCmdResponse('');
    showToast(`Added command /${cleanName}`, 'success');
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await syncSlashCommands();
    setIsSyncing(false);
  };

  const activeCount = commands.filter((c) => c.enabled).length;
  const slashCount = commands.filter((c) => c.slash && c.enabled).length;
  const prefixCount = commands.filter((c) => c.prefix && c.enabled).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Commands Orchestrator</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {commands.length} Commands
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Configure application slash commands and prefix triggers. Adjust cooldowns, permissions, and custom responses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl border border-purple-500/30 bg-purple-950/30 hover:bg-purple-900/40 text-purple-200 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync with Discord REST API</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-900/40"
          >
            <Plus className="w-4 h-4" />
            <span>New Custom Command</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#12141e] border border-white/5">
          <div className="text-[11px] text-neutral-400">Total Registered</div>
          <div className="text-lg font-bold text-white mt-0.5">{commands.length}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#12141e] border border-white/5">
          <div className="text-[11px] text-neutral-400">Active / Enabled</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">{activeCount}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#12141e] border border-white/5">
          <div className="text-[11px] text-neutral-400">Slash Triggers (/)</div>
          <div className="text-lg font-bold text-purple-400 mt-0.5">{slashCount}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#12141e] border border-white/5">
          <div className="text-[11px] text-neutral-400">Prefix Triggers (!)</div>
          <div className="text-lg font-bold text-blue-400 mt-0.5">{prefixCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? commands.length
                : commands.filter((c) => c.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    selectedCategory === cat ? 'bg-purple-800 text-purple-100' : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commands or permissions..."
            className="w-full bg-[#131520] border border-white/10 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Commands Table / Card List */}
      <div className="carbon-card rounded-2xl border border-purple-500/20 overflow-hidden">
        <div className="p-4 bg-black/30 border-b border-white/10 grid grid-cols-12 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
          <div className="col-span-4 sm:col-span-3">Command</div>
          <div className="hidden sm:block col-span-4">Description &amp; Permissions</div>
          <div className="col-span-3 sm:col-span-2 text-center">Cooldown</div>
          <div className="col-span-3 sm:col-span-2 text-center">Triggers</div>
          <div className="col-span-2 sm:col-span-1 text-right">State</div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-xs">
              No commands matching &quot;{search}&quot; found in category &quot;{selectedCategory}&quot;.
            </div>
          ) : (
            filteredCommands.map((cmd) => (
              <div
                key={cmd.id}
                className={`p-4 grid grid-cols-12 items-center gap-2 transition ${
                  cmd.enabled ? 'hover:bg-white/[0.02]' : 'opacity-50 bg-black/20'
                }`}
              >
                <div className="col-span-4 sm:col-span-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCommand(cmd.name)}
                      className="w-7 h-7 rounded-lg bg-purple-900/30 border border-purple-500/20 hover:border-purple-500/50 flex items-center justify-center text-purple-400 font-mono text-xs font-bold flex-shrink-0 transition group"
                      title="Click to copy command"
                    >
                      {copiedCmd === cmd.name ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span>/</span>
                      )}
                    </button>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-white font-mono block truncate">
                        /{cmd.name}
                      </span>
                      <span className="text-[10px] text-purple-400 font-medium">
                        {cmd.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block col-span-4 text-xs text-neutral-300">
                  <div className="truncate">{cmd.description}</div>
                  {cmd.userPerms && cmd.userPerms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {cmd.userPerms.map((perm) => (
                        <span
                          key={perm}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-800/40"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  )}
                  {cmd.response && (
                    <span className="block text-[11px] text-neutral-500 truncate font-mono mt-0.5">
                      ↳ &quot;{cmd.response}&quot;
                    </span>
                  )}
                </div>

                <div className="col-span-3 sm:col-span-2 text-center">
                  <select
                    value={cmd.cooldown}
                    onChange={(e) => handleCooldownChange(cmd.id, parseInt(e.target.value, 10))}
                    className="bg-[#131520] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-neutral-300 font-mono focus:outline-none"
                  >
                    <option value={0}>0s (None)</option>
                    <option value={2}>2s</option>
                    <option value={3}>3s</option>
                    <option value={5}>5s</option>
                    <option value={10}>10s</option>
                    <option value={15}>15s</option>
                    <option value={30}>30s</option>
                    <option value={60}>60s</option>
                  </select>
                </div>

                <div className="col-span-3 sm:col-span-2 flex items-center justify-center gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => toggleCommandSlash(cmd.id)}
                    className={`px-2 py-0.5 rounded font-mono transition ${
                      cmd.slash
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                        : 'bg-black/30 text-neutral-500 border border-transparent'
                    }`}
                    title="Toggle Slash Command support"
                  >
                    /slash
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCommandPrefix(cmd.id)}
                    className={`px-2 py-0.5 rounded font-mono transition ${
                      cmd.prefix
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                        : 'bg-black/30 text-neutral-500 border border-transparent'
                    }`}
                    title="Toggle Prefix Command support"
                  >
                    prefix
                  </button>
                </div>

                <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-2">
                  <input
                    type="checkbox"
                    checked={cmd.enabled}
                    onChange={() => toggleCommandEnabled(cmd.id)}
                    className="rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20 h-4 w-4 cursor-pointer"
                  />
                  {cmd.category === 'Custom' && (
                    <button
                      onClick={() => handleDeleteCommand(cmd.id)}
                      className="text-neutral-500 hover:text-rose-400 p-1"
                      title="Delete custom command"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Custom Command Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e1017] border border-purple-500/30 rounded-2xl shadow-2xl p-6 max-w-lg w-full text-white">
            <h3 className="text-lg font-bold mb-1">Create Custom Command</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Add a new automated response command for your bot.
            </p>

            <form onSubmit={handleAddCommand} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Command Trigger (without slash)
                </label>
                <input
                  type="text"
                  value={newCmdName}
                  onChange={(e) => setNewCmdName(e.target.value)}
                  placeholder="e.g. social, shop, discord"
                  className="w-full bg-[#151722] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newCmdDesc}
                  onChange={(e) => setNewCmdDesc(e.target.value)}
                  placeholder="e.g. Display our official store link and perks"
                  className="w-full bg-[#151722] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Bot Response Message
                </label>
                <textarea
                  value={newCmdResponse}
                  onChange={(e) => setNewCmdResponse(e.target.value)}
                  placeholder="Check out our store at https://example.com/store! Use code DISCORD for 15% off."
                  rows={3}
                  className="w-full bg-[#151722] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Create Command
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
