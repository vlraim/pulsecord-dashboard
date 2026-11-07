import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import { ReactionRoleConfig, ReactionRoleOption } from '../types';
import {
  Smile,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Hash,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { DiscordEmbedPreview } from '../components/DiscordEmbedPreview';

export const ReactionRolesView: React.FC = () => {
  const { config, activeBot, updateConfigSection, isSaving, showToast } = useBot();
  const [panels, setPanels] = useState<ReactionRoleConfig[]>(config?.reactionRoles || []);
  const [selectedPanelId, setSelectedPanelId] = useState<string>(panels[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Panel Form
  const [newPanelName, setNewPanelName] = useState('');
  const [newPanelChannel, setNewPanelChannel] = useState('#roles-select');
  const [newPanelMode, setNewPanelMode] = useState<ReactionRoleConfig['mode']>('TOGGLE');

  const activePanel = panels.find((p) => p.id === selectedPanelId) || panels[0];

  const handleSave = async () => {
    await updateConfigSection('reactionRoles', panels);
  };

  const handleAddOption = (panelId: string) => {
    const defaultEmoji = '⭐';
    const newOpt: ReactionRoleOption = {
      emoji: defaultEmoji,
      label: 'New Role Option',
      role: 'Member Role',
      color: '#8b5cf6',
    };
    setPanels((prev) =>
      prev.map((p) => (p.id === panelId ? { ...p, options: [...p.options, newOpt] } : p))
    );
  };

  const handleRemoveOption = (panelId: string, index: number) => {
    setPanels((prev) =>
      prev.map((p) =>
        p.id === panelId ? { ...p, options: p.options.filter((_, i) => i !== index) } : p
      )
    );
  };

  const handleUpdateOption = (panelId: string, index: number, field: keyof ReactionRoleOption, val: string) => {
    setPanels((prev) =>
      prev.map((p) => {
        if (p.id !== panelId) return p;
        const newOpts = [...p.options];
        newOpts[index] = { ...newOpts[index], [field]: val };
        return { ...p, options: newOpts };
      })
    );
  };

  const handleCreatePanel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPanelName.trim()) return;

    const newPanel: ReactionRoleConfig = {
      id: `rr_${Date.now()}`,
      name: newPanelName.trim(),
      channel: newPanelChannel || '#roles-selection',
      messageId: Math.floor(100000000000000000 + Math.random() * 900000000000000000).toString(),
      mode: newPanelMode,
      options: [
        { emoji: '🎮', label: 'Gamer', role: 'Gaming Club', color: '#38bdf8' },
        { emoji: '🎨', label: 'Artist', role: 'Creative Crew', color: '#ec4899' },
      ],
    };

    const updated = [...panels, newPanel];
    setPanels(updated);
    setSelectedPanelId(newPanel.id);
    setIsModalOpen(false);
    setNewPanelName('');
    showToast(`Created reaction role panel "${newPanel.name}"`, 'success');
  };

  const handleDeletePanel = (id: string) => {
    const updated = panels.filter((p) => p.id !== id);
    setPanels(updated);
    if (selectedPanelId === id && updated.length > 0) {
      setSelectedPanelId(updated[0].id);
    }
    showToast('Reaction role panel deleted', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Reaction & Button Roles</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Let members self-assign cosmetic, interest, or ping notification roles via reactions and buttons.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Panel</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/40 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Panels</span>
          </button>
        </div>
      </div>

      {/* Panel Tabs */}
      {panels.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {panels.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPanelId(p.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                selectedPanelId === p.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              <span>{p.name}</span>
              <span className="text-[10px] opacity-75 font-mono">({p.options.length})</span>
            </button>
          ))}
        </div>
      )}

      {activePanel && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Active Panel Settings & Options */}
          <div className="space-y-5">
            <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-purple-400" />
                  <h3 className="font-bold text-sm text-white">Panel Settings</h3>
                </div>
                <button
                  onClick={() => handleDeletePanel(activePanel.id)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Panel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Target Channel</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                    <input
                      type="text"
                      value={activePanel.channel}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPanels((prev) =>
                          prev.map((p) => (p.id === activePanel.id ? { ...p, channel: val } : p))
                        );
                      }}
                      className="w-full bg-[#131520] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Role Selection Mode</label>
                  <select
                    value={activePanel.mode}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setPanels((prev) =>
                        prev.map((p) => (p.id === activePanel.id ? { ...p, mode: val } : p))
                      );
                    }}
                    className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="TOGGLE">Toggle (Select multiple)</option>
                    <option value="UNIQUE">Unique (Only one role at a time)</option>
                    <option value="VERIFY">Verify Gate (One-time click to unlock)</option>
                  </select>
                </div>
              </div>

              {/* Options Table */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-neutral-300">Emoji to Role Mappings</span>
                  <button
                    type="button"
                    onClick={() => handleAddOption(activePanel.id)}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Option
                  </button>
                </div>

                <div className="space-y-2">
                  {activePanel.options.map((opt, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2.5 text-xs"
                    >
                      <input
                        type="text"
                        value={opt.emoji}
                        onChange={(e) => handleUpdateOption(activePanel.id, i, 'emoji', e.target.value)}
                        className="w-10 text-center bg-[#131520] border border-white/10 rounded-lg py-1 text-sm"
                        title="Emoji"
                      />
                      <input
                        type="text"
                        value={opt.label}
                        onChange={(e) => handleUpdateOption(activePanel.id, i, 'label', e.target.value)}
                        placeholder="Label"
                        className="flex-1 bg-[#131520] border border-white/10 rounded-lg px-2.5 py-1 text-white"
                      />
                      <input
                        type="text"
                        value={opt.role}
                        onChange={(e) => handleUpdateOption(activePanel.id, i, 'role', e.target.value)}
                        placeholder="Discord Role Name"
                        className="flex-1 bg-[#131520] border border-white/10 rounded-lg px-2.5 py-1 text-purple-300 font-semibold font-mono"
                      />
                      <button
                        onClick={() => handleRemoveOption(activePanel.id, i)}
                        className="text-neutral-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Reaction Role Message Preview */}
          <div className="space-y-4">
            <div className="carbon-card rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400" /> Interactive Discord Embed Preview
                </h3>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded">
                  {activePanel.channel}
                </span>
              </div>

              <div className="flex justify-center">
                <DiscordEmbedPreview
                  botName={activeBot?.name || 'PulseCord Sentinel'}
                  botAvatar={activeBot?.avatar}
                  title={`✨ ${activePanel.name}`}
                  description="Click the reaction buttons below to claim or remove your roles automatically!"
                  color="#8b5cf6"
                  fields={activePanel.options.map((opt) => ({
                    name: `${opt.emoji} ${opt.label}`,
                    value: `Grants role: **@${opt.role}**`,
                    inline: true,
                  }))}
                  reactions={activePanel.options.map((opt, i) => ({
                    emoji: opt.emoji,
                    count: 8 + i * 3,
                    active: i === 0,
                  }))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Panel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e1017] border border-purple-500/30 rounded-2xl shadow-2xl p-6 max-w-md w-full text-white">
            <h3 className="text-lg font-bold mb-1">Create Reaction Role Panel</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Add a new role assignment category for your Discord community.
            </p>

            <form onSubmit={handleCreatePanel} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-300 block mb-1">Panel Name</label>
                <input
                  type="text"
                  value={newPanelName}
                  onChange={(e) => setNewPanelName(e.target.value)}
                  placeholder="e.g. Regional Roles, Pronouns"
                  className="w-full bg-[#151722] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-300 block mb-1">Target Channel</label>
                <input
                  type="text"
                  value={newPanelChannel}
                  onChange={(e) => setNewPanelChannel(e.target.value)}
                  placeholder="#roles-selection"
                  className="w-full bg-[#151722] border border-white/10 rounded-xl px-3.5 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-300 block mb-1">Mode</label>
                <select
                  value={newPanelMode}
                  onChange={(e) => setNewPanelMode(e.target.value as any)}
                  className="w-full bg-[#151722] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="TOGGLE">Toggle Multiple Roles</option>
                  <option value="UNIQUE">Unique (Only One Allowed)</option>
                  <option value="VERIFY">Verification Gate</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Create Panel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
