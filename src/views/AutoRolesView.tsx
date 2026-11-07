import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import { AutoRolesConfig } from '../types';
import {
  Users,
  Save,
  Plus,
  X,
  Clock,
  Shield,
  Bot,
  UserCheck,
  RefreshCw,
} from 'lucide-react';

export const AutoRolesView: React.FC = () => {
  const { config, updateConfigSection, isSaving, showToast } = useBot();
  const [autoRoles, setAutoRoles] = useState<AutoRolesConfig>(
    config?.autoRoles || {
      enabled: true,
      humanRoles: ['Verified Member', 'Community'],
      botRoles: ['Integrated Bots'],
      delaySeconds: 2,
      restoreOnRejoin: true,
    }
  );

  const [newHumanRole, setNewHumanRole] = useState('');
  const [newBotRole, setNewBotRole] = useState('');

  const handleSave = async () => {
    await updateConfigSection('autoRoles', autoRoles);
  };

  const addHumanRole = () => {
    if (!newHumanRole.trim()) return;
    setAutoRoles((prev) => ({
      ...prev,
      humanRoles: [...prev.humanRoles, newHumanRole.trim()],
    }));
    setNewHumanRole('');
  };

  const removeHumanRole = (role: string) => {
    setAutoRoles((prev) => ({
      ...prev,
      humanRoles: prev.humanRoles.filter((r) => r !== role),
    }));
  };

  const addBotRole = () => {
    if (!newBotRole.trim()) return;
    setAutoRoles((prev) => ({
      ...prev,
      botRoles: [...prev.botRoles, newBotRole.trim()],
    }));
    setNewBotRole('');
  };

  const removeBotRole = (role: string) => {
    setAutoRoles((prev) => ({
      ...prev,
      botRoles: prev.botRoles.filter((r) => r !== role),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Auto Roles on Join</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Automatically grant roles to newly joined humans and bot accounts with optional delay timers.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/40 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Auto Roles</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Human Roles */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Human Member Roles</h3>
                <p className="text-[11px] text-neutral-400">Assigned immediately or after delay to real users</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoRoles.enabled}
              onChange={(e) => setAutoRoles((prev) => ({ ...prev, enabled: e.target.checked }))}
              className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newHumanRole}
              onChange={(e) => setNewHumanRole(e.target.value)}
              placeholder="e.g. Member, Citizen"
              className="flex-1 bg-[#131520] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={addHumanRole}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-semibold text-white flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Role
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {autoRoles.humanRoles.map((role) => (
              <span
                key={role}
                className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs font-semibold text-purple-200 flex items-center gap-2"
              >
                <span>{role}</span>
                <button onClick={() => removeHumanRole(role)} className="hover:text-rose-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Bot Roles */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Bot Application Roles</h3>
              <p className="text-[11px] text-neutral-400">Separate role tag given only to joined bots</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newBotRole}
              onChange={(e) => setNewBotRole(e.target.value)}
              placeholder="e.g. Bots, Integrations"
              className="flex-1 bg-[#131520] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={addBotRole}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold text-white flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {autoRoles.botRoles.map((role) => (
              <span
                key={role}
                className="px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs font-semibold text-blue-200 flex items-center gap-2"
              >
                <span>{role}</span>
                <button onClick={() => removeBotRole(role)} className="hover:text-rose-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Timing & Sticky Roles */}
        <div className="lg:col-span-2 carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" /> Assignment Rules & Timing
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Delay Before Granting ({autoRoles.delaySeconds} seconds)
              </label>
              <input
                type="range"
                min={0}
                max={30}
                value={autoRoles.delaySeconds}
                onChange={(e) =>
                  setAutoRoles((prev) => ({
                    ...prev,
                    delaySeconds: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Helps filter raid accounts and bots before Discord gateway verification.
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/20 border border-white/5">
              <div>
                <span className="text-xs font-semibold text-white block">Sticky Roles (Restore on Rejoin)</span>
                <span className="text-[11px] text-neutral-400">
                  Reassign previous roles if a member leaves and returns
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoRoles.restoreOnRejoin}
                onChange={(e) =>
                  setAutoRoles((prev) => ({
                    ...prev,
                    restoreOnRejoin: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
