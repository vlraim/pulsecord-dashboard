import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import { GiveawayItem } from '../types';
import {
  Gift,
  Plus,
  Clock,
  Award,
  Users,
  CheckCircle,
  RefreshCw,
  Hash,
  Shield,
  Trash2,
} from 'lucide-react';

export const GiveawaySystemView: React.FC = () => {
  const { config, updateConfigSection, showToast, isSaving } = useBot();
  const [giveaways, setGiveaways] = useState<GiveawayItem[]>(config?.giveawaySystem || []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [prize, setPrize] = useState('');
  const [channel, setChannel] = useState('#giveaways');
  const [durationHours, setDurationHours] = useState(24);
  const [winnersCount, setWinnersCount] = useState(1);
  const [requiredRole, setRequiredRole] = useState('Verified Member');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prize.trim()) return;

    const newGw: GiveawayItem = {
      id: `gw_${Date.now()}`,
      prize: prize.trim(),
      channel: channel || '#giveaways',
      durationHours,
      winnersCount,
      requiredRole: requiredRole || 'Everyone',
      status: 'ACTIVE',
      entriesCount: 1,
      endsAt: new Date(Date.now() + durationHours * 3600 * 1000).toISOString(),
    };

    const updated = [newGw, ...giveaways];
    setGiveaways(updated);
    await updateConfigSection('giveawaySystem', updated);
    setIsModalOpen(false);
    setPrize('');
    showToast(`Giveaway for "${newGw.prize}" is now active!`, 'success');
  };

  const handleEndNow = async (id: string) => {
    const updated = giveaways.map((gw) => {
      if (gw.id !== id) return gw;
      return {
        ...gw,
        status: 'ENDED' as const,
        winnerNames: ['ApexRider#0001', 'NovaStrike#4829'].slice(0, gw.winnersCount),
      };
    });
    setGiveaways(updated);
    await updateConfigSection('giveawaySystem', updated);
    showToast('Giveaway concluded and winners rolled!', 'info');
  };

  const handleReroll = async (id: string) => {
    const demoPool = ['CyberKnight#9921', 'AegisPlayer#4120', 'QuantumEcho#7712', 'VortexPilot#8841'];
    const randomWinner = demoPool[Math.floor(Math.random() * demoPool.length)];

    const updated = giveaways.map((gw) => {
      if (gw.id !== id) return gw;
      return {
        ...gw,
        winnerNames: [randomWinner],
      };
    });
    setGiveaways(updated);
    await updateConfigSection('giveawaySystem', updated);
    showToast(`Rerolled winner: ${randomWinner}`, 'success');
  };

  const handleDelete = async (id: string) => {
    const updated = giveaways.filter((gw) => gw.id !== id);
    setGiveaways(updated);
    await updateConfigSection('giveawaySystem', updated);
    showToast('Giveaway removed', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Automated Giveaway System</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Create provably fair server giveaways with role requirements, reaction entries, and instant rerolls.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-900/40"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Giveaway</span>
        </button>
      </div>

      {/* Giveaways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {giveaways.map((gw) => {
          const isActive = gw.status === 'ACTIVE';

          return (
            <div
              key={gw.id}
              className={`carbon-card rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                isActive ? 'border-purple-500/30' : 'border-white/5 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">{gw.prize}</h3>
                      <span className="text-[11px] text-purple-300 font-mono">{gw.channel}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400 border border-white/10'
                    }`}
                  >
                    {gw.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/40 border border-white/5 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Winners</span>
                    <span className="font-bold text-white font-mono">{gw.winnersCount} Winner(s)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Entries</span>
                    <span className="font-bold text-purple-300 font-mono">{gw.entriesCount} joined</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Requirement</span>
                    <span className="font-bold text-neutral-200 truncate block">{gw.requiredRole}</span>
                  </div>
                </div>

                {gw.winnerNames && gw.winnerNames.length > 0 && (
                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Winner(s):</span>
                      <span className="text-white font-bold">{gw.winnerNames.join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                {isActive ? (
                  <button
                    onClick={() => handleEndNow(gw.id)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold transition"
                  >
                    Conclude & Roll Winners
                  </button>
                ) : (
                  <button
                    onClick={() => handleReroll(gw.id)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                    <span>Reroll Winner</span>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(gw.id)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 transition"
                  title="Delete Giveaway"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e1017] border border-purple-500/30 rounded-2xl shadow-2xl p-6 max-w-md w-full text-white">
            <h3 className="text-lg font-bold mb-1">Create Server Giveaway</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Launch a timed prize giveaway in your Discord channel.
            </p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-300 block mb-1">Prize Name</label>
                <input
                  type="text"
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
                  placeholder="e.g. 1 Month Discord Nitro"
                  className="w-full bg-[#151722] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-300 block mb-1">Channel</label>
                  <input
                    type="text"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    placeholder="#giveaways"
                    className="w-full bg-[#151722] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-300 block mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    max={168}
                    value={durationHours}
                    onChange={(e) => setDurationHours(parseInt(e.target.value, 10) || 24)}
                    className="w-full bg-[#151722] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-300 block mb-1">Number of Winners</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={winnersCount}
                    onChange={(e) => setWinnersCount(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-[#151722] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-300 block mb-1">Required Role</label>
                  <input
                    type="text"
                    value={requiredRole}
                    onChange={(e) => setRequiredRole(e.target.value)}
                    placeholder="Everyone or Verified Member"
                    className="w-full bg-[#151722] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
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
                  Start Giveaway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
