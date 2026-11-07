import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import { AutomationRule } from '../types';
import {
  Zap,
  Plus,
  Trash2,
  CheckCircle,
  ArrowRight,
  Radio,
  Sparkles,
  MessageSquare,
  Smile,
  Megaphone,
} from 'lucide-react';

export const AutomationsView: React.FC = () => {
  const { config, updateConfigSection, showToast, isSaving } = useBot();
  const [rules, setRules] = useState<AutomationRule[]>(config?.automations || []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Rule Form
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState<AutomationRule['trigger']>('MEMBER_JOIN');
  const [action, setAction] = useState<AutomationRule['action']>('SEND_DM');
  const [paramText, setParamText] = useState('');

  const toggleRule = async (id: string) => {
    const updated = rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    setRules(updated);
    await updateConfigSection('automations', updated);
  };

  const deleteRule = async (id: string) => {
    const updated = rules.filter((r) => r.id !== id);
    setRules(updated);
    await updateConfigSection('automations', updated);
    showToast('Automation rule deleted', 'info');
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRule: AutomationRule = {
      id: `auto_${Date.now()}`,
      name: name.trim(),
      trigger,
      action,
      enabled: true,
      params: {
        message: action === 'SEND_DM' ? paramText : undefined,
        keyword: trigger === 'KEYWORD_MATCH' ? paramText : undefined,
        emoji: action === 'ADD_REACTION' ? paramText || '⭐' : undefined,
      },
    };

    const updated = [...rules, newRule];
    setRules(updated);
    await updateConfigSection('automations', updated);
    setIsModalOpen(false);
    setName('');
    setParamText('');
    showToast(`Created automation "${newRule.name}"`, 'success');
  };

  const getTriggerLabel = (t: AutomationRule['trigger']) => {
    switch (t) {
      case 'MEMBER_JOIN':
        return 'When Member Joins';
      case 'KEYWORD_MATCH':
        return 'When Message Contains Word';
      case 'MESSAGE_IN_ANNOUNCEMENT_CHANNEL':
        return 'When Announcement Posted';
      case 'USER_LEVEL_UP':
        return 'When User Reaches Level';
      default:
        return t;
    }
  };

  const getActionLabel = (a: AutomationRule['action']) => {
    switch (a) {
      case 'SEND_DM':
        return 'Send Private Direct Message';
      case 'ADD_REACTION':
        return 'React with Emoji';
      case 'CROSSPOST_MESSAGE':
        return 'Auto-Publish / Crosspost';
      case 'ASSIGN_ROLE':
        return 'Grant Role';
      default:
        return a;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Event Automations Engine</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Build server triggers and automated actions without writing code.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-900/40"
        >
          <Plus className="w-4 h-4" />
          <span>New Automation</span>
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`carbon-card rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              rule.enabled ? 'border-purple-500/30' : 'border-white/10 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white">{rule.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => toggleRule(rule.id)}
                    className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
                  />
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-1 text-neutral-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Workflow Flow Visualization */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-purple-300 font-medium">
                  <span className="text-[10px] uppercase font-bold text-neutral-500">Trigger:</span>
                  <span>{getTriggerLabel(rule.trigger)}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-500">Action:</span>
                  <span>{getActionLabel(rule.action)}</span>
                </div>
                {rule.params.message && (
                  <div className="text-[11px] text-neutral-400 italic bg-white/5 p-2 rounded-lg">
                    &quot;{rule.params.message}&quot;
                  </div>
                )}
                {rule.params.keyword && (
                  <div className="text-[11px] text-neutral-400 font-mono">
                    Keyword: <span className="text-white font-bold">&quot;{rule.params.keyword}&quot;</span>
                  </div>
                )}
                {rule.params.emoji && (
                  <div className="text-[11px] text-neutral-400">
                    Reaction Emoji: <span className="text-base">{rule.params.emoji}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Automation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e1017] border border-purple-500/30 rounded-2xl shadow-2xl p-6 max-w-md w-full text-white">
            <h3 className="text-lg font-bold mb-1">Create Event Automation</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Select an event trigger and assign an action to execute.
            </p>

            <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-300 block mb-1">Automation Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. VIP Join Greeting"
                  className="w-full bg-[#151722] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-300 block mb-1">Select Trigger</label>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value as any)}
                  className="w-full bg-[#151722] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="MEMBER_JOIN">When Member Joins Server</option>
                  <option value="KEYWORD_MATCH">When Message Matches Keyword</option>
                  <option value="MESSAGE_IN_ANNOUNCEMENT_CHANNEL">When New Announcement Published</option>
                  <option value="USER_LEVEL_UP">When User Reaches Level Threshold</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-neutral-300 block mb-1">Select Action</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value as any)}
                  className="w-full bg-[#151722] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="SEND_DM">Send Private Direct Message</option>
                  <option value="ADD_REACTION">Add Emoji Reaction to Message</option>
                  <option value="CROSSPOST_MESSAGE">Crosspost Announcement to Followers</option>
                  <option value="ASSIGN_ROLE">Assign Designated Role</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-neutral-300 block mb-1">
                  {action === 'SEND_DM' ? 'Direct Message Text' : trigger === 'KEYWORD_MATCH' ? 'Keyword to Match' : 'Emoji or Parameter'}
                </label>
                <input
                  type="text"
                  value={paramText}
                  onChange={(e) => setParamText(e.target.value)}
                  placeholder={action === 'SEND_DM' ? 'Welcome to the server! Read #rules' : 'e.g. gg'}
                  className="w-full bg-[#151722] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none"
                  required
                />
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
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
