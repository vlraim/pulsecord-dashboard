import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import {
  useTheme,
  THEME_PALETTES,
  SIDEBAR_STYLES,
  ThemeAccent,
  SidebarStyle,
  SidebarDensity,
} from '../context/ThemeContext';
import { DashboardSettings } from '../types';
import {
  Settings,
  Save,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Palette,
  Globe,
  RefreshCw,
  Check,
  Layout,
  Sliders,
  Sparkles,
  Terminal,
  ShieldAlert,
  Bot,
} from 'lucide-react';
import { InitialsAvatar } from '../components/InitialsAvatar';

export const SettingsView: React.FC = () => {
  const { config, activeBot, updateConfigSection, isSaving, showToast } = useBot();
  const {
    accent,
    sidebarStyle,
    sidebarDensity,
    currentPalette,
    currentSidebarStyle,
    setAccent,
    setSidebarStyle,
    setSidebarDensity,
    resetToDefaults,
  } = useTheme();

  const [settings, setSettings] = useState<DashboardSettings>(
    config?.settings || {
      language: 'en-US',
      timezone: 'UTC',
      dashboardTheme: accent,
      auditLogging: true,
      enableTwoFactorAuth: true,
    }
  );

  const handleSave = async () => {
    const updated = {
      ...settings,
      dashboardTheme: accent,
    };
    setSettings(updated);
    await updateConfigSection('settings', updated);
    showToast('Theme layout and preferences saved!', 'success');
  };

  const handleExportConfig = () => {
    const exportData = {
      ...config,
      themeSettings: {
        accent,
        sidebarStyle,
        sidebarDensity,
      },
    };
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeBot?.name || 'bot'}-pulsecord-config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Full bot configuration exported to JSON file', 'success');
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (typeof imported === 'object') {
          if (imported.themeSettings?.accent && THEME_PALETTES[imported.themeSettings.accent as ThemeAccent]) {
            setAccent(imported.themeSettings.accent);
          }
          if (imported.themeSettings?.sidebarStyle && SIDEBAR_STYLES[imported.themeSettings.sidebarStyle as SidebarStyle]) {
            setSidebarStyle(imported.themeSettings.sidebarStyle);
          }
          if (imported.themeSettings?.sidebarDensity) {
            setSidebarDensity(imported.themeSettings.sidebarDensity);
          }
          showToast('Imported configuration applied to session', 'success');
        }
      } catch (err) {
        showToast('Invalid JSON file format', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Dashboard Preferences &amp; Theme Studio
            </h2>
            <span
              style={{
                backgroundColor: `rgba(${currentPalette.rgb}, 0.2)`,
                color: currentPalette.color,
                borderColor: `rgba(${currentPalette.rgb}, 0.3)`,
              }}
              className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono"
            >
              {currentPalette.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Customize the sidebar color scheme, surface background styles, layout density, and server controls.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefaults}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold transition flex items-center gap-1.5"
            title="Reset theme and sidebar layout to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Theme</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              background: `linear-gradient(135deg, ${currentPalette.color} 0%, ${currentPalette.hoverColor} 100%)`,
              boxShadow: `0 4px 16px -2px rgba(${currentPalette.rgb}, 0.4)`,
            }}
            className="px-5 py-2.5 rounded-xl text-white text-xs font-bold transition flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* Main Theme Studio Card */}
      <div
        style={{ borderColor: `rgba(${currentPalette.rgb}, 0.25)` }}
        className="carbon-card rounded-2xl p-6 border space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div
              style={{
                backgroundColor: `rgba(${currentPalette.rgb}, 0.2)`,
                color: currentPalette.color,
              }}
              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold"
            >
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Sidebar &amp; Layout Theme Studio</h3>
              <p className="text-xs text-neutral-400">
                Choose accent colors, carbon surface textures, and menu density for your sidebar.
              </p>
            </div>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">
            Active: <span style={{ color: currentPalette.color }} className="font-bold">{currentPalette.name}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Primary Accent Colors */}
            <div>
              <label className="text-xs font-bold text-neutral-200 block mb-2">
                1. Sidebar &amp; UI Accent Color
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(Object.keys(THEME_PALETTES) as ThemeAccent[]).map((key) => {
                  const pal = THEME_PALETTES[key];
                  const isSelected = accent === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setAccent(key)}
                      style={{
                        borderColor: isSelected ? pal.color : 'rgba(255, 255, 255, 0.08)',
                        backgroundColor: isSelected ? `rgba(${pal.rgb}, 0.15)` : 'rgba(255, 255, 255, 0.02)',
                      }}
                      className="p-3 rounded-xl border flex items-center gap-2.5 transition group hover:border-white/20 text-left"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
                        style={{ backgroundColor: pal.color }}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white drop-shadow" />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-white truncate">{pal.name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono truncate">{pal.color}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Sidebar Surface & Background Style */}
            <div>
              <label className="text-xs font-bold text-neutral-200 block mb-2">
                2. Sidebar Surface Texture &amp; Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(Object.keys(SIDEBAR_STYLES) as SidebarStyle[]).map((key) => {
                  const style = SIDEBAR_STYLES[key];
                  const isSelected = sidebarStyle === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSidebarStyle(key)}
                      style={{
                        borderColor: isSelected ? currentPalette.color : 'rgba(255, 255, 255, 0.08)',
                        backgroundColor: isSelected ? `rgba(${currentPalette.rgb}, 0.12)` : 'rgba(255, 255, 255, 0.02)',
                      }}
                      className="p-3 rounded-xl border flex flex-col gap-1 transition text-left hover:border-white/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-md border border-white/20"
                            style={{ backgroundColor: style.bgColor }}
                          />
                          <span className="font-bold text-xs text-white">{style.name}</span>
                        </div>
                        {isSelected && (
                          <span
                            style={{ color: currentPalette.color }}
                            className="text-[10px] font-bold"
                          >
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2">
                        {style.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Sidebar Density */}
            <div>
              <label className="text-xs font-bold text-neutral-200 block mb-2">
                3. Sidebar Layout Density
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSidebarDensity('comfortable')}
                  style={{
                    borderColor: sidebarDensity === 'comfortable' ? currentPalette.color : 'rgba(255, 255, 255, 0.08)',
                    backgroundColor: sidebarDensity === 'comfortable' ? `rgba(${currentPalette.rgb}, 0.12)` : 'rgba(255, 255, 255, 0.02)',
                  }}
                  className="p-3 rounded-xl border text-left transition"
                >
                  <div className="font-bold text-xs text-white">Comfortable (Default)</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    Spacious navigation padding with large touch targets.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSidebarDensity('compact')}
                  style={{
                    borderColor: sidebarDensity === 'compact' ? currentPalette.color : 'rgba(255, 255, 255, 0.08)',
                    backgroundColor: sidebarDensity === 'compact' ? `rgba(${currentPalette.rgb}, 0.12)` : 'rgba(255, 255, 255, 0.02)',
                  }}
                  className="p-3 rounded-xl border text-left transition"
                >
                  <div className="font-bold text-xs text-white">Compact (High Density)</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    Tighter menu item spacing designed for power users.
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                <span>Live Sidebar Preview</span>
                <span style={{ color: currentPalette.color }} className="font-mono text-[10px]">
                  {sidebarDensity.toUpperCase()}
                </span>
              </div>

              {/* Miniature Sidebar Mock */}
              <div
                style={{
                  backgroundColor: currentSidebarStyle.bgColor,
                  borderColor: `rgba(${currentPalette.rgb}, 0.3)`,
                }}
                className="rounded-xl border p-3 space-y-3 shadow-inner"
              >
                {/* Mock Active Bot Capsule */}
                <div
                  style={{
                    borderColor: `rgba(${currentPalette.rgb}, 0.35)`,
                    background: `linear-gradient(135deg, rgba(${currentPalette.rgb}, 0.15) 0%, rgba(18, 20, 34, 0.8) 100%)`,
                  }}
                  className="p-2.5 rounded-lg border flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] text-white"
                      style={{ backgroundColor: currentPalette.color }}
                    >
                      PS
                    </div>
                    <div>
                      <div className="font-bold text-[11px] text-white">Pulse Sentinel</div>
                      <div style={{ color: currentPalette.color }} className="text-[9px] font-mono">
                        42 Servers Connected
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1 py-0.5 rounded">
                    24ms
                  </span>
                </div>

                {/* Mock Navigation Items */}
                <div className="space-y-1 text-xs">
                  <div className="text-[9px] font-extrabold uppercase text-neutral-400 tracking-wider px-1">
                    General
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg text-neutral-400 hover:text-white flex items-center gap-2 text-[11px]">
                    <Bot className="w-3.5 h-3.5" />
                    <span>My Bots</span>
                  </div>

                  {/* Active Item in Mock */}
                  <div
                    style={{
                      background: `linear-gradient(90deg, rgba(${currentPalette.rgb}, 0.28) 0%, rgba(${currentPalette.rgb}, 0.12) 100%)`,
                      borderColor: `rgba(${currentPalette.rgb}, 0.5)`,
                    }}
                    className="px-2.5 py-1.5 rounded-lg border text-white font-semibold flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <Terminal style={{ color: currentPalette.color }} className="w-3.5 h-3.5" />
                      <span>Commands</span>
                    </div>
                    <span
                      style={{
                        backgroundColor: `rgba(${currentPalette.rgb}, 0.25)`,
                        color: currentPalette.color,
                      }}
                      className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold"
                    >
                      29
                    </span>
                  </div>

                  <div className="px-2.5 py-1.5 rounded-lg text-neutral-400 hover:text-white flex items-center gap-2 text-[11px]">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Moderation</span>
                  </div>
                </div>

                {/* Mock Bottom Badge */}
                <div
                  style={{
                    borderColor: `rgba(${currentPalette.rgb}, 0.25)`,
                    backgroundColor: `rgba(${currentPalette.rgb}, 0.08)`,
                  }}
                  className="p-2 rounded-lg border flex items-center justify-between text-[10px]"
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles style={{ color: currentPalette.color }} className="w-3.5 h-3.5" />
                    <span className="font-semibold text-white">Free &amp; Unlocked</span>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-bold">100% FREE</span>
                </div>
              </div>

              <div className="text-[11px] text-neutral-400 text-center">
                Changes apply instantly across your entire dashboard.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regional & Security Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional & Localization */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-400" /> Regional &amp; Localization
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="en-US">English (United States)</option>
                <option value="en-GB">English (UK)</option>
                <option value="de-DE">Deutsch (German)</option>
                <option value="fr-FR">Français (French)</option>
                <option value="es-ES">Español (Spanish)</option>
                <option value="ja-JP">日本語 (Japanese)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="UTC">UTC (Universal Coordinated)</option>
                <option value="America/New_York">Eastern Time (US / NY)</option>
                <option value="America/Los_Angeles">Pacific Time (US / LA)</option>
                <option value="Europe/London">London (GMT / BST)</option>
                <option value="Europe/Paris">Central Europe (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Audit Controls */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" /> Security &amp; Logging Controls
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/20 border border-white/5 text-xs">
              <div>
                <span className="font-semibold text-white block">Audit Log Internal Changes</span>
                <span className="text-[11px] text-neutral-400">Record configuration modifications</span>
              </div>
              <input
                type="checkbox"
                checked={settings.auditLogging}
                onChange={(e) => setSettings({ ...settings, auditLogging: e.target.checked })}
                className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/20 border border-white/5 text-xs">
              <div>
                <span className="font-semibold text-white block">Strict 2FA For Mod Commands</span>
                <span className="text-[11px] text-neutral-400">Require staff 2FA for ban and kick</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableTwoFactorAuth}
                onChange={(e) => setSettings({ ...settings, enableTwoFactorAuth: e.target.checked })}
                className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Backup & Restore Full Config */}
        <div className="lg:col-span-2 carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-purple-400" /> Configuration Backup &amp; Restoration
          </h3>
          <p className="text-xs text-neutral-400">
            Export a complete JSON snapshot of all 18 modules (including your customized theme and sidebar styling) or restore from an earlier backup.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleExportConfig}
              style={{
                background: `linear-gradient(135deg, ${currentPalette.color} 0%, ${currentPalette.hoverColor} 100%)`,
              }}
              className="px-4 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>

            <label className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition">
              <Upload className="w-4 h-4 text-purple-400" />
              <span>Restore from JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportConfig}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
