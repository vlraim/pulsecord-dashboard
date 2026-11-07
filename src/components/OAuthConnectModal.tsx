import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

export const OAuthConnectModal: React.FC = () => {
  const { isOAuthModalOpen, setIsOAuthModalOpen, loginWithDiscord, demoLogin, showToast } = useBot();
  const [copiedRedirect, setCopiedRedirect] = useState(false);

  if (!isOAuthModalOpen) return null;

  const currentRedirectUri = `${window.location.origin}/api/auth/discord/callback`;

  const handleCopyRedirect = () => {
    navigator.clipboard.writeText(currentRedirectUri);
    setCopiedRedirect(true);
    showToast('Redirect URI copied to clipboard!', 'success');
    setTimeout(() => setCopiedRedirect(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0e1017] border border-purple-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Discord OAuth2 Connection</h3>
              <p className="text-xs text-neutral-400">Authorize with Discord to manage your bots and guilds</p>
            </div>
          </div>
          <button
            onClick={() => setIsOAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-xl bg-[#141724] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Your Exact Discord OAuth Redirect URI
              </span>
              <button
                onClick={handleCopyRedirect}
                className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                {copiedRedirect ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedRedirect ? 'Copied' : 'Copy URI'}</span>
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-black/50 border border-purple-500/30 font-mono text-xs text-purple-200 select-all break-all">
              {currentRedirectUri}
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Add this callback URL in your Discord Developer Application under <span className="text-white font-medium">OAuth2 → Redirects</span>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-neutral-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-purple-300">
              <Info className="w-3.5 h-3.5" /> Fast Setup Instructions
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              If you have your own Discord App credentials, configure <code className="text-purple-300">DISCORD_CLIENT_ID</code> and <code className="text-purple-300">DISCORD_CLIENT_SECRET</code> in the project secrets. You can also sign in with our Demo Discord profile to test all features immediately!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={loginWithDiscord}
              className="w-full py-3 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-[#5865F2]/25"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Connect with Discord OAuth2</span>
            </button>

            <button
              onClick={demoLogin}
              className="w-full py-2.5 px-4 rounded-xl border border-purple-500/40 bg-purple-950/30 hover:bg-purple-900/40 text-purple-200 font-medium text-xs transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Sign in with Demo Developer Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
