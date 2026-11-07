import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import { LevelingConfig } from '../types';
import {
  Award,
  Save,
  Plus,
  Trash2,
  Mic,
  MessageSquare,
  Sparkles,
  Palette,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { InitialsAvatar } from '../components/InitialsAvatar';

export const LevelingSystemView: React.FC = () => {
  const { config, user, updateConfigSection, isSaving, showToast } = useBot();
  const [leveling, setLeveling] = useState<LevelingConfig>(
    config?.levelingSystem || {
      enabled: true,
      xpMultiplier: 1.0,
      xpCooldownSeconds: 60,
      voiceXpEnabled: true,
      announceLevelUp: true,
      levelUpChannel: 'SAME_CHANNEL',
      customCardBgColor: '#12141f',
      customCardAccent: '#8b5cf6',
      roleRewards: [
        { level: 5, role: 'Novice Adventurer' },
        { level: 10, role: 'Elite Sentinel' },
        { level: 25, role: 'Guild Veteran' },
        { level: 50, role: 'Mythic Legend' },
      ],
    }
  );

  const [newLevel, setNewLevel] = useState(15);
  const [newRole, setNewRole] = useState('');

  const handleSave = async () => {
    await updateConfigSection('levelingSystem', leveling);
  };

  const addRoleReward = () => {
    if (!newRole.trim()) return;
    const updated = [
      ...leveling.roleRewards,
      { level: Number(newLevel), role: newRole.trim() },
    ].sort((a, b) => a.level - b.level);
    setLeveling((prev) => ({ ...prev, roleRewards: updated }));
    setNewRole('');
  };

  const removeRoleReward = (index: number) => {
    setLeveling((prev) => ({
      ...prev,
      roleRewards: prev.roleRewards.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Leveling System & XP Rewards</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Reward text and voice activity with customizable XP rates, level-up cards, and automatic role milestones.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/40 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Leveling Engine</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Config Options */}
        <div className="space-y-5">
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-sm text-white">Enable Leveling System</h3>
                <p className="text-[11px] text-neutral-400">Award XP for chat messages and voice time</p>
              </div>
              <input
                type="checkbox"
                checked={leveling.enabled}
                onChange={(e) => setLeveling((prev) => ({ ...prev, enabled: e.target.checked }))}
                className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-neutral-300">XP Rate Multiplier</span>
                <span className="font-mono text-purple-400 font-bold">{leveling.xpMultiplier.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3.0}
                step={0.1}
                value={leveling.xpMultiplier}
                onChange={(e) =>
                  setLeveling((prev) => ({
                    ...prev,
                    xpMultiplier: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">XP Cooldown (Seconds)</label>
                <input
                  type="number"
                  min={10}
                  max={180}
                  value={leveling.xpCooldownSeconds}
                  onChange={(e) =>
                    setLeveling((prev) => ({
                      ...prev,
                      xpCooldownSeconds: parseInt(e.target.value, 10) || 60,
                    }))
                  }
                  className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Level-Up Announcement</label>
                <select
                  value={leveling.levelUpChannel}
                  onChange={(e) =>
                    setLeveling((prev) => ({
                      ...prev,
                      levelUpChannel: e.target.value as any,
                    }))
                  }
                  className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="SAME_CHANNEL">Same Channel</option>
                  <option value="DEDICATED">#level-ups Channel</option>
                  <option value="DM">Private Direct Message</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/20 border border-white/5 text-xs">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="font-semibold text-white block">Voice Channel XP</span>
                  <span className="text-[11px] text-neutral-400">Award XP when talking in voice rooms</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={leveling.voiceXpEnabled}
                onChange={(e) => setLeveling((prev) => ({ ...prev, voiceXpEnabled: e.target.checked }))}
                className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
              />
            </div>
          </div>

          {/* Role Rewards Milestone List */}
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" /> Milestone Role Rewards
            </h3>

            <div className="flex gap-2 text-xs">
              <input
                type="number"
                min={1}
                max={100}
                value={newLevel}
                onChange={(e) => setNewLevel(parseInt(e.target.value, 10) || 1)}
                className="w-20 bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-center"
                title="Level"
              />
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Role to grant (e.g. Bronze Elite)"
                className="flex-1 bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={addRoleReward}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-semibold text-white flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              {leveling.roleRewards.map((reward, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-12 text-center py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-[11px] font-mono text-purple-300 font-bold">
                      Lvl {reward.level}
                    </span>
                    <span className="font-semibold text-white">{reward.role}</span>
                  </div>
                  <button
                    onClick={() => removeRoleReward(i)}
                    className="text-neutral-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Customizable Discord Rank Card Mockup */}
        <div className="space-y-4">
          <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" /> Discord Rank Card Preview
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={leveling.customCardAccent}
                  onChange={(e) => setLeveling((prev) => ({ ...prev, customCardAccent: e.target.value }))}
                  className="w-6 h-6 rounded border border-white/10 bg-transparent cursor-pointer"
                  title="Accent Color"
                />
              </div>
            </div>

            {/* Canvas / Rendered Rank Card */}
            <div className="p-6 rounded-2xl bg-[#12141f] border border-[#2b2d38] shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <InitialsAvatar
                    name={user?.username || 'Ibrahim Asad'}
                    size="xl"
                    shape="circle"
                    status="online"
                    className="border-2 border-purple-500/50 text-base font-extrabold"
                  />
                  <div>
                    <div className="text-base font-extrabold text-white flex items-center gap-1.5">
                      <span>{user?.username || 'Ibrahim Asad'}</span>
                      <span className="text-xs text-neutral-400 font-mono">#{user?.discriminator || '0001'}</span>
                    </div>
                    <span className="text-[11px] text-purple-400 font-semibold">
                      Rank #4 in Server
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-white font-mono">LEVEL 14</div>
                  <div className="text-[11px] text-neutral-400 font-mono">3,420 / 4,500 XP</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="w-full h-3.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: '76%',
                      backgroundColor: leveling.customCardAccent,
                      boxShadow: `0 0 12px ${leveling.customCardAccent}`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                  <span>76% to Level 15</span>
                  <span>+1,080 XP needed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
