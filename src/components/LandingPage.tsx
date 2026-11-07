import React from 'react';
import { useBot } from '../context/BotContext';
import {
  Zap,
  Bot,
  Shield,
  Sliders,
  Terminal,
  Ticket,
  Award,
  Gift,
  Smile,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Server,
  Lock,
  Layers,
  ChevronRight,
  Code,
  Users,
} from 'lucide-react';
import { DiscordEmbedPreview } from './DiscordEmbedPreview';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  const { loginWithDiscord, demoLogin, setIsAddBotOpen, setIsOAuthModalOpen, user } = useBot();

  const stats = [
    { label: 'Active Bots Orchestrated', value: '18,400+', change: '+14% this month' },
    { label: 'Discord Members Protected', value: '4.2 Million', change: 'Across 12,000 guilds' },
    { label: 'Commands Executed Daily', value: '2.8M', change: '< 25ms avg latency' },
    { label: 'Core Platform Features', value: '18 Modules', change: '100% Free forever' },
  ];

  const featureCards = [
    {
      icon: Sliders,
      title: 'Bot Management & Presence',
      description: 'Tune rich Discord activity states (Playing, Watching, Competing), custom presence texts, gateway intents, and command prefixes on the fly.',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Terminal,
      title: 'Slash & Prefix Commands',
      description: 'Synchronize application slash commands with official Discord REST endpoints in one click. Toggle cooldowns and user permissions.',
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: Shield,
      title: 'Real-Time Auto Moderation',
      description: 'Guard your community against spam floods, unauthorized invite links, blacklisted words, and mass mentions with instant timeout actions.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Zap,
      title: 'Event-Driven Automations',
      description: 'Chain server triggers to instant actions: auto-DM newcomers, react to keywords, or crosspost announcements automatically.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Ticket,
      title: 'Support Ticket System',
      description: 'Deploy interactive ticket panels with Discord message buttons. Manage staff roles, categories, and automated transcript channels.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Award,
      title: 'Leveling & XP Rewards',
      description: 'Gamify your community with customizable rank cards, voice XP multipliers, level-up alerts, and automatic role rewards.',
      color: 'from-fuchsia-500 to-pink-500',
    },
    {
      icon: Smile,
      title: 'Reaction & Button Roles',
      description: 'Provide self-assignable server roles through interactive embeds and emojis. Support toggle, unique, and verify gatekeeper modes.',
      color: 'from-rose-500 to-red-500',
    },
    {
      icon: Gift,
      title: 'Automated Giveaways',
      description: 'Host and manage giveaways with role requirements, duration timers, automatic winner selection, and instant re-roll tools.',
      color: 'from-violet-600 to-purple-800',
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-white selection:bg-purple-500 selection:text-white">
      {/* Top Hero Glow Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[140px]" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/50 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Universal Discord Bot Management Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Your Bots.{' '}
            <span className="violet-gradient-text">Your Control.</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Connect and orchestrate your Discord bot applications through a unified, carbon-fiber dashboard. Manage commands, auto-moderation, support tickets, leveling, and custom embeds with zero subscription fees.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-purple-900/40 transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setIsOAuthModalOpen(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-sm shadow-xl shadow-[#5865F2]/25 transition flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Connect with Discord</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Free Core Modules
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-purple-400" /> Zero Token Leakage
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-400" /> Real-time Discord API
            </span>
          </div>
        </div>

        {/* Live Interactive Discord Preview Mockup Showcase */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="relative rounded-2xl p-1 bg-gradient-to-b from-purple-500/30 via-purple-500/10 to-transparent shadow-2xl">
            <div className="bg-[#0f111a] rounded-[15px] p-4 sm:p-8 border border-white/5 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-neutral-400">#welcome-and-rules • PulseCord Automated Feed</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Live Dispatch Preview
                </span>
              </div>

              <div className="flex justify-center">
                <DiscordEmbedPreview
                  botName="Aegis Guardian"
                  title="🛡️ PulseCord Sentinel • Server Security & Welcome"
                  description="Welcome to the server, **@NewMember**! You are member **#14,821**.\n\nAll automated protections are armed. Read our community guidelines and click the button below to verify and unlock your roles."
                  color="#8b5cf6"
                  fields={[
                    { name: 'Active Moderation', value: 'Anti-Spam & Anti-Phishing Enabled', inline: true },
                    { name: 'Gateway Latency', value: '24ms (Optimal)', inline: true },
                  ]}
                  footer={{ text: 'Powered by PulseCord Universal Bot Dashboard' }}
                  buttons={[
                    { label: 'Verify & Claim Roles', emoji: '✅', style: 'primary' },
                    { label: 'Open Support Ticket', emoji: '🎫', style: 'secondary' },
                  ]}
                  reactions={[
                    { emoji: '👋', count: 48, active: true },
                    { emoji: '🔥', count: 19 },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Platform Metrics
            </h3>
            <p className="text-2xl font-bold text-white mt-1">
              Built for Scale & Reliable Delivery
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="carbon-card rounded-2xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-neutral-300 mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] text-purple-300 font-mono mt-2">
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 18 Features Overview Grid */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Complete Feature Suite
            </h3>
            <h2 className="text-3xl font-bold text-white mt-2">
              Everything Your Discord Community Demands
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              All 18 management modules are completely functional and unmetered with live Discord webhook testing and REST API synchronization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featureCards.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="carbon-card carbon-card-interactive rounded-2xl p-5 border border-purple-500/15 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-white mb-2">{feat.title}</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">{feat.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-purple-300 font-semibold">
                    <span>Explore module</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & Privacy Banner */}
        <div className="mt-20 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#10121e] to-purple-950/40 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Bank-Grade Discord Bot Security</h3>
              <p className="text-xs text-neutral-300 mt-1 max-w-xl leading-relaxed">
                Tokens are communicated through secure backend API proxy calls to <code className="text-purple-300">discord.com/api/v10</code>. No bot secrets are ever stored in cookies, local storage, or frontend source bundles.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddBotOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Connect a Bot Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
