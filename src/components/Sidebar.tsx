import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import { useTheme, THEME_PALETTES, SIDEBAR_STYLES, ThemeAccent, SidebarStyle } from '../context/ThemeContext';
import { SectionKey } from '../types';
import {
  LayoutDashboard,
  Bot,
  Sliders,
  Terminal,
  ShieldAlert,
  Zap,
  UserPlus,
  UserMinus,
  FileText,
  Users,
  Smile,
  Ticket,
  Gift,
  Award,
  Palette,
  BarChart3,
  Puzzle,
  Settings,
  Search,
  X,
  Sparkles,
  ChevronUp,
  Check,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { InitialsAvatar } from './InitialsAvatar';

interface SidebarItem {
  key: SectionKey;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  badge?: string;
}

interface SidebarGroup {
  group: string;
  items: SidebarItem[];
}

const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    group: 'General',
    items: [
      { key: 'overview', label: 'Overview', icon: LayoutDashboard },
      { key: 'my-bots', label: 'My Bots', icon: Bot, badge: 'Active' },
      { key: 'bot-management', label: 'Bot Management', icon: Sliders },
    ],
  },
  {
    group: 'Server Controls',
    items: [
      { key: 'commands', label: 'Commands', icon: Terminal },
      { key: 'moderation', label: 'Moderation', icon: ShieldAlert },
      { key: 'automations', label: 'Automations', icon: Zap },
    ],
  },
  {
    group: 'Member Engagement',
    items: [
      { key: 'welcome-system', label: 'Welcome System', icon: UserPlus },
      { key: 'leave-messages', label: 'Leave Messages', icon: UserMinus },
      { key: 'logging', label: 'Logging', icon: FileText },
      { key: 'auto-roles', label: 'Auto Roles', icon: Users },
      { key: 'reaction-roles', label: 'Reaction Roles', icon: Smile },
    ],
  },
  {
    group: 'Community Tools',
    items: [
      { key: 'ticket-system', label: 'Ticket System', icon: Ticket },
      { key: 'giveaway-system', label: 'Giveaway System', icon: Gift },
      { key: 'leveling-system', label: 'Leveling System', icon: Award },
      { key: 'custom-embeds', label: 'Custom Embeds', icon: Palette },
    ],
  },
  {
    group: 'Insights & System',
    items: [
      { key: 'analytics', label: 'Analytics', icon: BarChart3 },
      { key: 'integrations', label: 'Integrations', icon: Puzzle },
      { key: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeSection, setActiveSection, activeBot } = useBot();
  const {
    accent,
    sidebarStyle,
    sidebarDensity,
    currentPalette,
    currentSidebarStyle,
    setAccent,
    setSidebarStyle,
    setSidebarDensity,
  } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [isThemePopoverOpen, setIsThemePopoverOpen] = useState(false);

  const filteredGroups = SIDEBAR_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0);

  const handleSelectSection = (key: SectionKey) => {
    setActiveSection(key);
    onClose();
  };

  const isCompact = sidebarDensity === 'compact';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        style={{
          backgroundColor: currentSidebarStyle.bgColor,
          borderColor: `rgba(${currentPalette.rgb}, 0.2)`,
        }}
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 border-r flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${currentSidebarStyle.bgClass}`}
      >
        {/* Active Bot Capsule in Sidebar */}
        <div className="p-4 border-b border-white/5">
          <div
            style={{
              borderColor: `rgba(${currentPalette.rgb}, 0.3)`,
              background: `linear-gradient(135deg, rgba(${currentPalette.rgb}, 0.12) 0%, rgba(18, 20, 34, 0.7) 100%)`,
            }}
            className="p-3 rounded-xl border flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <InitialsAvatar
                name={activeBot?.name || 'Pulse Sentinel'}
                size="sm"
                shape="rounded"
                status={activeBot?.status || 'online'}
              />
              <div className="min-w-0">
                <div className="font-bold text-xs text-white truncate">
                  {activeBot?.name || 'Pulse Sentinel'}
                </div>
                <div
                  style={{ color: currentPalette.color }}
                  className="text-[10px] font-mono truncate font-medium"
                >
                  {activeBot?.serversCount || 42} Servers Connected
                </div>
              </div>
            </div>
            <span className="flex-shrink-0 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
              {activeBot?.latencyMs || 24}ms
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 18 modules..."
              className="w-full bg-[#131520] border border-white/10 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition"
              style={{
                borderColor: searchTerm ? currentPalette.color : undefined,
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-neutral-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div className={`flex-1 overflow-y-auto px-3 ${isCompact ? 'py-2 space-y-3' : 'py-3.5 space-y-5'}`}>
          {filteredGroups.map((group) => (
            <div key={group.group}>
              <div
                className={`px-3 ${
                  isCompact ? 'mb-1 text-[9px]' : 'mb-2 text-[10px]'
                } font-extrabold uppercase tracking-widest text-neutral-400`}
              >
                {group.group}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleSelectSection(item.key)}
                      style={
                        isActive
                          ? {
                              background: `linear-gradient(90deg, rgba(${currentPalette.rgb}, 0.28) 0%, rgba(${currentPalette.rgb}, 0.12) 100%)`,
                              borderColor: `rgba(${currentPalette.rgb}, 0.5)`,
                              boxShadow: `0 4px 16px -2px rgba(${currentPalette.rgb}, 0.25)`,
                            }
                          : undefined
                      }
                      className={`w-full flex items-center justify-between rounded-xl font-medium transition-all group ${
                        isCompact ? 'px-2.5 py-1.5 text-[11px]' : 'px-3 py-2 text-xs'
                      } ${
                        isActive
                          ? 'text-white border shadow-sm font-semibold'
                          : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          style={isActive ? { color: currentPalette.color } : undefined}
                          className={`${
                            isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'
                          } transition-colors flex-shrink-0 ${
                            isActive ? '' : 'text-neutral-500 group-hover:text-neutral-300'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          style={
                            isActive
                              ? {
                                  backgroundColor: `rgba(${currentPalette.rgb}, 0.25)`,
                                  color: currentPalette.color,
                                }
                              : undefined
                          }
                          className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-white/10 text-neutral-400 flex-shrink-0"
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Theme & Layout Settings in Sidebar */}
        <div className="p-3 border-t border-white/5 space-y-2">
          {/* Quick Theme Switcher Button / Accordion */}
          <div className="relative">
            <button
              onClick={() => setIsThemePopoverOpen(!isThemePopoverOpen)}
              className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-xs transition group"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20 transition-transform group-hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: currentPalette.color }}
                />
                <span className="text-neutral-300 font-medium text-[11px]">Theme & Layout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  style={{ color: currentPalette.color }}
                  className="text-[10px] font-mono font-semibold"
                >
                  {currentPalette.name.split(' ')[1] || currentPalette.name}
                </span>
                <ChevronUp
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                    isThemePopoverOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Expandable In-Sidebar Theme Controls */}
            {isThemePopoverOpen && (
              <div
                style={{
                  backgroundColor: currentSidebarStyle.bgColor === '#000000' ? '#0a0a0a' : '#10121d',
                  borderColor: `rgba(${currentPalette.rgb}, 0.3)`,
                }}
                className="mt-2 p-3 rounded-xl border shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
              >
                {/* 1. Color Palette Swatches */}
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400 mb-1.5 tracking-wider flex items-center justify-between">
                    <span>Accent Color</span>
                    <span style={{ color: currentPalette.color }} className="font-mono text-[9px]">
                      {currentPalette.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {(Object.keys(THEME_PALETTES) as ThemeAccent[]).map((paletteKey) => {
                      const p = THEME_PALETTES[paletteKey];
                      const isSelected = accent === paletteKey;
                      return (
                        <button
                          key={paletteKey}
                          onClick={() => setAccent(paletteKey)}
                          title={`${p.name} (${p.color})`}
                          className="relative h-6 rounded-lg transition-transform hover:scale-110 flex items-center justify-center focus:outline-none"
                          style={{ backgroundColor: p.color }}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white drop-shadow" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Sidebar Surface Background */}
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400 mb-1.5 tracking-wider">
                    Sidebar Style
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    {(Object.keys(SIDEBAR_STYLES) as SidebarStyle[]).map((styleKey) => {
                      const s = SIDEBAR_STYLES[styleKey];
                      const isSelected = sidebarStyle === styleKey;
                      return (
                        <button
                          key={styleKey}
                          onClick={() => setSidebarStyle(styleKey)}
                          style={{
                            borderColor: isSelected ? currentPalette.color : 'rgba(255,255,255,0.08)',
                            backgroundColor: isSelected ? `rgba(${currentPalette.rgb}, 0.15)` : 'rgba(255,255,255,0.03)',
                            color: isSelected ? '#ffffff' : '#9ca3af',
                          }}
                          className="p-1.5 rounded-lg border text-left truncate transition"
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Density & Settings link */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSidebarDensity('comfortable')}
                      className={`px-2 py-1 rounded transition ${
                        !isCompact ? 'bg-white/10 text-white font-bold' : 'text-neutral-500 hover:text-white'
                      }`}
                      title="Comfortable Spacing"
                    >
                      Comfort
                    </button>
                    <button
                      onClick={() => setSidebarDensity('compact')}
                      className={`px-2 py-1 rounded transition ${
                        isCompact ? 'bg-white/10 text-white font-bold' : 'text-neutral-500 hover:text-white'
                      }`}
                      title="Compact Spacing"
                    >
                      Compact
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setActiveSection('settings');
                      setIsThemePopoverOpen(false);
                      onClose();
                    }}
                    style={{ color: currentPalette.color }}
                    className="hover:underline font-semibold"
                  >
                    More Studio →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Tier Info */}
          <div
            style={{
              borderColor: `rgba(${currentPalette.rgb}, 0.25)`,
              backgroundColor: `rgba(${currentPalette.rgb}, 0.08)`,
            }}
            className="p-2.5 rounded-xl border flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles
                style={{ color: currentPalette.color }}
                className="w-4 h-4 flex-shrink-0"
              />
              <div className="text-[11px]">
                <div className="font-semibold text-white">Free &amp; Unlocked</div>
                <div className="text-[10px] text-neutral-400">All 18 features unmetered</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
              100% Free
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
