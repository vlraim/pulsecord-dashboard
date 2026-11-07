import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export type ThemeAccent =
  | 'violet'
  | 'blurple'
  | 'emerald'
  | 'crimson'
  | 'amber'
  | 'cyan'
  | 'fuchsia';

export type SidebarStyle = 'carbon' | 'oled' | 'slate' | 'amethyst';
export type SidebarDensity = 'comfortable' | 'compact';
export type GlowEffect = 'vibrant' | 'minimal' | 'sidebar-stripe';

export interface ThemePalette {
  id: ThemeAccent;
  name: string;
  color: string;
  hoverColor: string;
  rgb: string;
  gradientText: string;
  badgeBg: string;
  badgeText: string;
  activeItemGradient: string;
  activeItemBorder: string;
  activeItemShadow: string;
  buttonGradient: string;
}

export const THEME_PALETTES: Record<ThemeAccent, ThemePalette> = {
  violet: {
    id: 'violet',
    name: 'Carbon Violet',
    color: '#8b5cf6',
    hoverColor: '#7c3aed',
    rgb: '139, 92, 246',
    gradientText: 'from-purple-400 to-violet-300',
    badgeBg: 'bg-purple-500/20 border-purple-500/30',
    badgeText: 'text-purple-300',
    activeItemGradient: 'from-purple-600/30 to-violet-600/20',
    activeItemBorder: 'border-purple-500/40',
    activeItemShadow: 'shadow-purple-900/40',
    buttonGradient: 'from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500',
  },
  blurple: {
    id: 'blurple',
    name: 'Discord Blurple',
    color: '#5865F2',
    hoverColor: '#4752C4',
    rgb: '88, 101, 242',
    gradientText: 'from-indigo-400 to-blue-400',
    badgeBg: 'bg-[#5865F2]/20 border-[#5865F2]/40',
    badgeText: 'text-[#8da0f9]',
    activeItemGradient: 'from-[#5865F2]/30 to-indigo-600/20',
    activeItemBorder: 'border-[#5865F2]/50',
    activeItemShadow: 'shadow-indigo-900/40',
    buttonGradient: 'from-[#5865F2] to-indigo-600 hover:from-[#6b77f5] hover:to-indigo-500',
  },
  emerald: {
    id: 'emerald',
    name: 'Cyber Emerald',
    color: '#10b981',
    hoverColor: '#059669',
    rgb: '16, 185, 129',
    gradientText: 'from-emerald-400 to-teal-300',
    badgeBg: 'bg-emerald-500/20 border-emerald-500/30',
    badgeText: 'text-emerald-300',
    activeItemGradient: 'from-emerald-600/30 to-teal-600/20',
    activeItemBorder: 'border-emerald-500/40',
    activeItemShadow: 'shadow-emerald-900/40',
    buttonGradient: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500',
  },
  crimson: {
    id: 'crimson',
    name: 'Neon Crimson',
    color: '#f43f5e',
    hoverColor: '#e11d48',
    rgb: '244, 63, 94',
    gradientText: 'from-rose-400 to-red-400',
    badgeBg: 'bg-rose-500/20 border-rose-500/30',
    badgeText: 'text-rose-300',
    activeItemGradient: 'from-rose-600/30 to-red-600/20',
    activeItemBorder: 'border-rose-500/40',
    activeItemShadow: 'shadow-rose-900/40',
    buttonGradient: 'from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500',
  },
  amber: {
    id: 'amber',
    name: 'Solar Amber',
    color: '#f59e0b',
    hoverColor: '#d97706',
    rgb: '245, 158, 11',
    gradientText: 'from-amber-400 to-orange-400',
    badgeBg: 'bg-amber-500/20 border-amber-500/30',
    badgeText: 'text-amber-300',
    activeItemGradient: 'from-amber-600/30 to-orange-600/20',
    activeItemBorder: 'border-amber-500/40',
    activeItemShadow: 'shadow-amber-900/40',
    buttonGradient: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500',
  },
  cyan: {
    id: 'cyan',
    name: 'Glacier Cyan',
    color: '#06b6d4',
    hoverColor: '#0891b2',
    rgb: '6, 182, 212',
    gradientText: 'from-cyan-400 to-sky-300',
    badgeBg: 'bg-cyan-500/20 border-cyan-500/30',
    badgeText: 'text-cyan-300',
    activeItemGradient: 'from-cyan-600/30 to-blue-600/20',
    activeItemBorder: 'border-cyan-500/40',
    activeItemShadow: 'shadow-cyan-900/40',
    buttonGradient: 'from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500',
  },
  fuchsia: {
    id: 'fuchsia',
    name: 'Synthwave Pink',
    color: '#ec4899',
    hoverColor: '#db2777',
    rgb: '236, 72, 153',
    gradientText: 'from-pink-400 to-fuchsia-300',
    badgeBg: 'bg-pink-500/20 border-pink-500/30',
    badgeText: 'text-pink-300',
    activeItemGradient: 'from-pink-600/30 to-fuchsia-600/20',
    activeItemBorder: 'border-pink-500/40',
    activeItemShadow: 'shadow-pink-900/40',
    buttonGradient: 'from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500',
  },
};

export interface SidebarStyleOption {
  id: SidebarStyle;
  name: string;
  description: string;
  bgClass: string;
  bgColor: string;
  borderClass: string;
}

export const SIDEBAR_STYLES: Record<SidebarStyle, SidebarStyleOption> = {
  carbon: {
    id: 'carbon',
    name: 'Carbon Fiber',
    description: 'Textured deep charcoal with carbon weave microdots',
    bgClass: 'bg-[#090a10]',
    bgColor: '#090a10',
    borderClass: 'border-white/10',
  },
  oled: {
    id: 'oled',
    name: 'Midnight OLED',
    description: 'Pure pitch black #000000 with crisp high-contrast lines',
    bgClass: 'bg-black',
    bgColor: '#000000',
    borderClass: 'border-white/15',
  },
  slate: {
    id: 'slate',
    name: 'Obsidian Slate',
    description: 'Deep navy-slate #0c1017 with subtle cool undertones',
    bgClass: 'bg-[#0c1017]',
    bgColor: '#0c1017',
    borderClass: 'border-sky-500/10',
  },
  amethyst: {
    id: 'amethyst',
    name: 'Deep Amethyst',
    description: 'Smoky dark velvet purple #0f0a17 with rich warmth',
    bgClass: 'bg-[#0f0a17]',
    bgColor: '#0f0a17',
    borderClass: 'border-purple-500/20',
  },
};

interface ThemeContextType {
  accent: ThemeAccent;
  sidebarStyle: SidebarStyle;
  sidebarDensity: SidebarDensity;
  glowEffect: GlowEffect;
  currentPalette: ThemePalette;
  currentSidebarStyle: SidebarStyleOption;
  setAccent: (accent: ThemeAccent) => void;
  setSidebarStyle: (style: SidebarStyle) => void;
  setSidebarDensity: (density: SidebarDensity) => void;
  setGlowEffect: (glow: GlowEffect) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'pulsecord_dashboard_theme';

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accent, setAccentState] = useState<ThemeAccent>('violet');
  const [sidebarStyle, setSidebarStyleState] = useState<SidebarStyle>('carbon');
  const [sidebarDensity, setSidebarDensityState] = useState<SidebarDensity>('comfortable');
  const [glowEffect, setGlowEffectState] = useState<GlowEffect>('vibrant');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.accent && THEME_PALETTES[parsed.accent as ThemeAccent]) {
          setAccentState(parsed.accent);
        }
        if (parsed.sidebarStyle && SIDEBAR_STYLES[parsed.sidebarStyle as SidebarStyle]) {
          setSidebarStyleState(parsed.sidebarStyle);
        }
        if (parsed.sidebarDensity) {
          setSidebarDensityState(parsed.sidebarDensity);
        }
        if (parsed.glowEffect) {
          setGlowEffectState(parsed.glowEffect);
        }
      }
    } catch (e) {
      console.warn('Could not load theme from storage', e);
    }
  }, []);

  // Update root CSS variables when theme changes
  useEffect(() => {
    const palette = THEME_PALETTES[accent];
    const root = document.documentElement;
    root.style.setProperty('--accent-color', palette.color);
    root.style.setProperty('--accent-hover', palette.hoverColor);
    root.style.setProperty('--accent-rgb', palette.rgb);
    root.setAttribute('data-theme-accent', accent);
    root.setAttribute('data-sidebar-style', sidebarStyle);
    root.setAttribute('data-sidebar-density', sidebarDensity);

    // Save to localStorage
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ accent, sidebarStyle, sidebarDensity, glowEffect })
      );
    } catch (e) {
      // ignore
    }
  }, [accent, sidebarStyle, sidebarDensity, glowEffect]);

  const setAccent = (newAccent: ThemeAccent) => setAccentState(newAccent);
  const setSidebarStyle = (newStyle: SidebarStyle) => setSidebarStyleState(newStyle);
  const setSidebarDensity = (newDensity: SidebarDensity) => setSidebarDensityState(newDensity);
  const setGlowEffect = (newGlow: GlowEffect) => setGlowEffectState(newGlow);

  const resetToDefaults = () => {
    setAccentState('violet');
    setSidebarStyleState('carbon');
    setSidebarDensityState('comfortable');
    setGlowEffectState('vibrant');
  };

  const currentPalette = useMemo(() => THEME_PALETTES[accent], [accent]);
  const currentSidebarStyle = useMemo(() => SIDEBAR_STYLES[sidebarStyle], [sidebarStyle]);

  return (
    <ThemeContext.Provider
      value={{
        accent,
        sidebarStyle,
        sidebarDensity,
        glowEffect,
        currentPalette,
        currentSidebarStyle,
        setAccent,
        setSidebarStyle,
        setSidebarDensity,
        setGlowEffect,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
