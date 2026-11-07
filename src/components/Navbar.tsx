import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import { useTheme } from '../context/ThemeContext';
import {
  Bot,
  ChevronDown,
  Plus,
  RefreshCw,
  ExternalLink,
  Shield,
  LogOut,
  Zap,
  Menu,
  X,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';
import { InitialsAvatar } from './InitialsAvatar';

interface NavbarProps {
  onToggleSidebar?: () => void;
  showLandingPage: boolean;
  setShowLandingPage: (show: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  showLandingPage,
  setShowLandingPage,
}) => {
  const {
    user,
    bots,
    activeBot,
    setActiveBotId,
    setIsAddBotOpen,
    setIsOAuthModalOpen,
    logout,
    syncSlashCommands,
    loginWithDiscord,
  } = useBot();
  const { currentPalette } = useTheme();

  const [isBotDropdownOpen, setIsBotDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncCommands = async () => {
    setIsSyncing(true);
    await syncSlashCommands();
    setIsSyncing(false);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500 shadow-emerald-500/50';
      case 'idle':
        return 'bg-amber-500 shadow-amber-500/50';
      case 'dnd':
        return 'bg-rose-500 shadow-rose-500/50';
      default:
        return 'bg-neutral-500';
    }
  };

  return (
    <header
      style={{ borderColor: `rgba(${currentPalette.rgb}, 0.2)` }}
      className="sticky top-0 z-40 w-full bg-[#0a0b12]/90 backdrop-blur-xl border-b"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowLandingPage(!showLandingPage)}
            className="flex items-center gap-2.5 group text-left"
          >
            <div
              style={{
                background: `linear-gradient(135deg, ${currentPalette.color} 0%, ${currentPalette.hoverColor} 100%)`,
                boxShadow: `0 4px 14px 0 rgba(${currentPalette.rgb}, 0.35)`,
              }}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition"
            >
              <Zap className="w-5 h-5 fill-current" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0a0b12] rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-purple-300 transition">
                  PulseCord
                </span>
                <span
                  style={{
                    backgroundColor: `rgba(${currentPalette.rgb}, 0.2)`,
                    borderColor: `rgba(${currentPalette.rgb}, 0.35)`,
                    color: currentPalette.color,
                  }}
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider"
                >
                  Pro
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono -mt-0.5">Universal Bot Manager</p>
            </div>
          </button>
        </div>

        {/* Center: Bot Switcher (if logged in and on dashboard) */}
        {!showLandingPage && (
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsBotDropdownOpen(!isBotDropdownOpen)}
              style={{ borderColor: `rgba(${currentPalette.rgb}, 0.25)` }}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#141624] border hover:border-white/30 text-white text-xs transition"
            >
              {activeBot ? (
                <>
                  <InitialsAvatar name={activeBot.name} size="xs" shape="circle" status={activeBot.status} />
                  <div className="text-left font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white">{activeBot.name}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">#{activeBot.discriminator}</span>
                    </div>
                  </div>
                </>
              ) : (
                <span className="text-neutral-400">No Bot Selected</span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isBotDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isBotDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsBotDropdownOpen(false)} />
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-[#121422] border border-purple-500/30 shadow-2xl p-2 z-20 space-y-1">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    Connected Bots ({bots.length})
                  </div>
                  {bots.map((bot) => (
                    <button
                      key={bot.id}
                      onClick={() => {
                        setActiveBotId(bot.id);
                        setIsBotDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition ${
                        activeBot?.id === bot.id
                          ? 'bg-purple-600/20 text-white border border-purple-500/30'
                          : 'hover:bg-white/5 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <InitialsAvatar name={bot.name} size="xs" shape="circle" status={bot.status} />
                        <span className="font-medium truncate max-w-[120px]">{bot.name}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">{bot.serversCount} servers</span>
                    </button>
                  ))}
                  <div className="pt-1.5 border-t border-white/10">
                    <button
                      onClick={() => {
                        setIsBotDropdownOpen(false);
                        setIsAddBotOpen(true);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-purple-300 hover:bg-purple-600/10 transition"
                    >
                      <Plus className="w-4 h-4 text-purple-400" />
                      <span>Add Another Bot</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Right: Actions & User Account */}
        <div className="flex items-center gap-2.5">
          {/* Quick sync & add bot (in dashboard mode) */}
          {!showLandingPage && activeBot && (
            <>
              <button
                onClick={handleSyncCommands}
                disabled={isSyncing}
                title="Sync Slash Commands with Discord"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-medium transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync Slash</span>
              </button>

              <button
                onClick={() => setIsAddBotOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 text-purple-200 text-xs font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bot</span>
              </button>
            </>
          )}

          {/* Toggle between landing & dashboard */}
          <button
            onClick={() => setShowLandingPage(!showLandingPage)}
            className="px-3 py-1.5 rounded-xl border border-purple-500/30 bg-[#161828] hover:bg-purple-950/40 text-purple-300 text-xs font-semibold transition"
          >
            {showLandingPage ? 'Open Dashboard' : 'View Landing'}
          </button>

          {/* User Account Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-[#141624] border border-white/10 hover:border-purple-500/40 transition"
              >
                <InitialsAvatar name={user.username} size="sm" shape="rounded" />
                <div className="hidden lg:block text-left text-xs pr-1">
                  <div className="font-semibold text-white leading-tight flex items-center gap-1">
                    <span>{user.username}</span>
                    {user.verified && <span className="text-[10px] text-purple-400">✓</span>}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">#{user.discriminator}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 pr-1" />
              </button>

              {isUserDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsUserDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#121422] border border-purple-500/30 shadow-2xl p-2 z-20 text-xs">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <div className="font-semibold text-white">{user.username}#{user.discriminator}</div>
                      <div className="text-[11px] text-neutral-400 truncate">{user.email || 'Verified Discord User'}</div>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-purple-400">
                        <Server className="w-3 h-3" />
                        <span>Managing {user.serversCount} guilds</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        setIsOAuthModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-neutral-300 transition"
                    >
                      <Shield className="w-3.5 h-3.5 text-purple-400" />
                      <span>OAuth Credentials</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-950/30 text-rose-300 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsOAuthModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold transition shadow-md shadow-[#5865F2]/20"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Connect Discord</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
