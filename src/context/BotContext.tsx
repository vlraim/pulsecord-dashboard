import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DiscordUser,
  ConnectedBot,
  BotFullConfig,
  SectionKey,
} from '../types';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface BotContextType {
  user: DiscordUser | null;
  bots: ConnectedBot[];
  activeBot: ConnectedBot | null;
  activeSection: SectionKey;
  config: BotFullConfig | null;
  isLoading: boolean;
  isSaving: boolean;
  toasts: Toast[];
  isAddBotOpen: boolean;
  isOAuthModalOpen: boolean;
  setActiveSection: (section: SectionKey) => void;
  setActiveBotId: (botId: string) => void;
  setIsAddBotOpen: (open: boolean) => void;
  setIsOAuthModalOpen: (open: boolean) => void;
  loginWithDiscord: () => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => Promise<void>;
  validateAndAddBot: (token: string, name?: string, prefix?: string) => Promise<{ success: boolean; message: string }>;
  updateBotStatus: (params: {
    status?: ConnectedBot['status'];
    activityType?: ConnectedBot['activityType'];
    activityText?: string;
    prefix?: string;
    slashCommandsEnabled?: boolean;
  }) => Promise<boolean>;
  updateConfigSection: (section: keyof BotFullConfig, data: any) => Promise<boolean>;
  syncSlashCommands: () => Promise<boolean>;
  testWebhook: (params: {
    webhookUrl: string;
    embed?: any;
    content?: string;
    username?: string;
    avatarUrl?: string;
  }) => Promise<{ success: boolean; message: string }>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const BotContext = createContext<BotContextType | null>(null);

export const BotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [bots, setBots] = useState<ConnectedBot[]>([]);
  const [activeBot, setActiveBot] = useState<ConnectedBot | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>('overview');
  const [config, setConfig] = useState<BotFullConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isAddBotOpen, setIsAddBotOpen] = useState<boolean>(false);
  const [isOAuthModalOpen, setIsOAuthModalOpen] = useState<boolean>(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial user and bots
  const refreshUserData = useCallback(async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }
    } catch (e) {
      console.warn('Could not fetch user session', e);
    }
  }, []);

  const refreshBots = useCallback(async (selectBotId?: string) => {
    try {
      const res = await fetch('/api/bots');
      if (res.ok) {
        const data = await res.json();
        const list: ConnectedBot[] = data.bots || [];
        setBots(list);
        if (list.length > 0) {
          if (selectBotId) {
            const found = list.find((b) => b.id === selectBotId);
            setActiveBot(found || list[0]);
          } else {
            setActiveBot((prev) => (prev ? list.find((b) => b.id === prev.id) || list[0] : list[0]));
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch bots', e);
    }
  }, []);

  // Load bot configuration when activeBot changes
  useEffect(() => {
    if (!activeBot) return;
    let isCancelled = false;

    const loadConfig = async () => {
      try {
        const res = await fetch(`/api/bot/${activeBot.id}/config`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setConfig(data.config);
          }
        }
      } catch (e) {
        console.error('Failed to load bot config:', e);
      }
    };

    loadConfig();
    return () => {
      isCancelled = true;
    };
  }, [activeBot?.id]);

  // Initial mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([refreshUserData(), refreshBots()]);
      setIsLoading(false);
    };
    init();
  }, [refreshUserData, refreshBots]);

  // Listen for OAuth success message from popup window (AI Studio cross-origin standard)
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        showToast('Discord account successfully connected!', 'success');
        await refreshUserData();
        setIsOAuthModalOpen(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [refreshUserData, showToast]);

  const loginWithDiscord = async () => {
    try {
      const res = await fetch('/api/auth/url');
      if (!res.ok) throw new Error('Could not get auth URL');
      const data = await res.json();

      const width = 580;
      const height = 750;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        data.url,
        'discord_oauth_popup',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=no,menubar=no`
      );

      if (!popup) {
        // Popup was blocked by browser
        setIsOAuthModalOpen(true);
        showToast('Popup was blocked by your browser. You can configure OAuth or quick-connect below.', 'info');
      }
    } catch (e) {
      setIsOAuthModalOpen(true);
      showToast('OAuth configuration details opened.', 'info');
    }
  };

  const demoLogin = async () => {
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        showToast(`Signed in as ${data.user.username}#${data.user.discriminator}`, 'success');
        setIsOAuthModalOpen(false);
      }
    } catch (e) {
      showToast('Failed to sign in', 'error');
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      showToast('Logged out of Discord session', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  const setActiveBotId = (botId: string) => {
    const found = bots.find((b) => b.id === botId);
    if (found) {
      setActiveBot(found);
      showToast(`Switched active bot to ${found.name}`, 'info');
    }
  };

  const validateAndAddBot = async (token: string, name?: string, prefix?: string) => {
    try {
      const res = await fetch('/api/bot/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: token, applicationName: name, customPrefix: prefix }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await refreshBots(data.bot.id);
        setIsAddBotOpen(false);
        showToast(data.message || `Successfully linked bot ${data.bot.name}!`, 'success');
        return { success: true, message: data.message };
      } else {
        showToast(data.error || 'Failed to validate bot token with Discord API', 'error');
        return { success: false, message: data.error || 'Validation failed' };
      }
    } catch (err: any) {
      showToast(err.message || 'Network error while connecting bot', 'error');
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const updateBotStatus = async (params: {
    status?: ConnectedBot['status'];
    activityType?: ConnectedBot['activityType'];
    activityText?: string;
    prefix?: string;
    slashCommandsEnabled?: boolean;
  }) => {
    if (!activeBot) return false;
    try {
      const res = await fetch(`/api/bot/${activeBot.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveBot(data.bot);
        setBots((prev) => prev.map((b) => (b.id === data.bot.id ? data.bot : b)));
        showToast('Bot presence and settings updated successfully!', 'success');
        return true;
      }
      return false;
    } catch (e) {
      showToast('Failed to update bot status', 'error');
      return false;
    }
  };

  const updateConfigSection = async (section: keyof BotFullConfig, data: any) => {
    if (!activeBot) return false;
    setIsSaving(true);
    try {
      // Optimistically update local state
      setConfig((prev) => {
        if (!prev) return null;
        return { ...prev, [section]: data };
      });

      const res = await fetch(`/api/bot/${activeBot.id}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data }),
      });

      if (res.ok) {
        showToast(`${String(section)} settings saved.`, 'success');
        setIsSaving(false);
        return true;
      } else {
        throw new Error('Save returned error status');
      }
    } catch (e) {
      setIsSaving(false);
      showToast('Could not save configuration to server', 'error');
      return false;
    }
  };

  const syncSlashCommands = async () => {
    if (!activeBot) return false;
    try {
      showToast('Synchronizing application slash commands with Discord API...', 'info');
      const res = await fetch(`/api/bot/${activeBot.id}/sync-commands`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        showToast(data.message || 'Slash commands successfully synced!', 'success');
        return true;
      }
      return false;
    } catch (e) {
      showToast('Failed to sync slash commands', 'error');
      return false;
    }
  };

  const testWebhook = async (params: {
    webhookUrl: string;
    embed?: any;
    content?: string;
    username?: string;
    avatarUrl?: string;
  }) => {
    try {
      const res = await fetch('/api/bot/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Real message dispatched to your Discord channel!', 'success');
        return { success: true, message: data.message };
      } else {
        showToast(data.error || 'Webhook test dispatch failed', 'error');
        return { success: false, message: data.error || 'Failed' };
      }
    } catch (e: any) {
      showToast('Webhook network error: ' + e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  return (
    <BotContext.Provider
      value={{
        user,
        bots,
        activeBot,
        activeSection,
        config,
        isLoading,
        isSaving,
        toasts,
        isAddBotOpen,
        isOAuthModalOpen,
        setActiveSection,
        setActiveBotId,
        setIsAddBotOpen,
        setIsOAuthModalOpen,
        loginWithDiscord,
        demoLogin,
        logout,
        validateAndAddBot,
        updateBotStatus,
        updateConfigSection,
        syncSlashCommands,
        testWebhook,
        showToast,
        removeToast,
      }}
    >
      {children}
    </BotContext.Provider>
  );
};

export const useBot = () => {
  const context = useContext(BotContext);
  if (!context) throw new Error('useBot must be used within a BotProvider');
  return context;
};
