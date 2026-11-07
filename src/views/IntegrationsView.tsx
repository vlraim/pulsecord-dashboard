import React, { useState } from 'react';
import { useBot } from '../context/BotContext';
import { IntegrationsConfig } from '../types';
import {
  Puzzle,
  Save,
  Video,
  Youtube,
  Github,
  Hash,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const { config, updateConfigSection, isSaving } = useBot();
  const [integrations, setIntegrations] = useState<IntegrationsConfig>(
    config?.integrations || {
      twitchAlerts: { enabled: true, streamerName: 'PulseLiveStream', channel: '#streams-live' },
      youtubeAlerts: { enabled: true, channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw', channel: '#yt-uploads' },
      githubWebhook: { enabled: true, repository: 'pulsecord/community-bot', channel: '#dev-commits' },
      redditFeed: { enabled: false, subreddit: 'discordapp', channel: '#reddit-feed' },
    }
  );

  const handleSave = async () => {
    await updateConfigSection('integrations', integrations);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">External Service Integrations</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Connect Twitch livestreams, YouTube uploads, GitHub git commit feeds, and Reddit subreddits.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/40 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Integrations</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Twitch Live Stream Alerts */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#9146FF]/20 border border-[#9146FF]/30 flex items-center justify-center text-[#9146FF]">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Twitch Live Alerts</h3>
                <p className="text-[11px] text-neutral-400">Ping server when streamer goes live</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={integrations.twitchAlerts.enabled}
              onChange={(e) =>
                setIntegrations((prev) => ({
                  ...prev,
                  twitchAlerts: { ...prev.twitchAlerts, enabled: e.target.checked },
                }))
              }
              className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
            />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Twitch Channel Username</label>
              <input
                type="text"
                value={integrations.twitchAlerts.streamerName}
                onChange={(e) =>
                  setIntegrations((prev) => ({
                    ...prev,
                    twitchAlerts: { ...prev.twitchAlerts, streamerName: e.target.value },
                  }))
                }
                placeholder="e.g. Shroud"
                className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Announcement Channel</label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  value={integrations.twitchAlerts.channel}
                  onChange={(e) =>
                    setIntegrations((prev) => ({
                      ...prev,
                      twitchAlerts: { ...prev.twitchAlerts, channel: e.target.value },
                    }))
                  }
                  className="w-full bg-[#131520] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* YouTube Uploads */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500">
                <Youtube className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">YouTube Uploads</h3>
                <p className="text-[11px] text-neutral-400">Post notifications when new video airs</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={integrations.youtubeAlerts.enabled}
              onChange={(e) =>
                setIntegrations((prev) => ({
                  ...prev,
                  youtubeAlerts: { ...prev.youtubeAlerts, enabled: e.target.checked },
                }))
              }
              className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
            />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">YouTube Channel ID</label>
              <input
                type="text"
                value={integrations.youtubeAlerts.channelId}
                onChange={(e) =>
                  setIntegrations((prev) => ({
                    ...prev,
                    youtubeAlerts: { ...prev.youtubeAlerts, channelId: e.target.value },
                  }))
                }
                placeholder="UC..."
                className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Target Channel</label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  value={integrations.youtubeAlerts.channel}
                  onChange={(e) =>
                    setIntegrations((prev) => ({
                      ...prev,
                      youtubeAlerts: { ...prev.youtubeAlerts, channel: e.target.value },
                    }))
                  }
                  className="w-full bg-[#131520] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Webhook */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">GitHub Webhook Feeds</h3>
                <p className="text-[11px] text-neutral-400">Stream commits, PRs, and release tags</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={integrations.githubWebhook.enabled}
              onChange={(e) =>
                setIntegrations((prev) => ({
                  ...prev,
                  githubWebhook: { ...prev.githubWebhook, enabled: e.target.checked },
                }))
              }
              className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
            />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Repository Name</label>
              <input
                type="text"
                value={integrations.githubWebhook.repository}
                onChange={(e) =>
                  setIntegrations((prev) => ({
                    ...prev,
                    githubWebhook: { ...prev.githubWebhook, repository: e.target.value },
                  }))
                }
                placeholder="organization/repo"
                className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Logs Channel</label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  value={integrations.githubWebhook.channel}
                  onChange={(e) =>
                    setIntegrations((prev) => ({
                      ...prev,
                      githubWebhook: { ...prev.githubWebhook, channel: e.target.value },
                    }))
                  }
                  className="w-full bg-[#131520] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reddit Feed */}
        <div className="carbon-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-600/30 flex items-center justify-center text-orange-500">
                <Puzzle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Reddit Community Posts</h3>
                <p className="text-[11px] text-neutral-400">Crosspost hot and new posts from subreddit</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={integrations.redditFeed.enabled}
              onChange={(e) =>
                setIntegrations((prev) => ({
                  ...prev,
                  redditFeed: { ...prev.redditFeed, enabled: e.target.checked },
                }))
              }
              className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 bg-[#131520] border-white/20"
            />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Subreddit Name (without r/)</label>
              <input
                type="text"
                value={integrations.redditFeed.subreddit}
                onChange={(e) =>
                  setIntegrations((prev) => ({
                    ...prev,
                    redditFeed: { ...prev.redditFeed, subreddit: e.target.value },
                  }))
                }
                placeholder="discordapp"
                className="w-full bg-[#131520] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Target Channel</label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  value={integrations.redditFeed.channel}
                  onChange={(e) =>
                    setIntegrations((prev) => ({
                      ...prev,
                      redditFeed: { ...prev.redditFeed, channel: e.target.value },
                    }))
                  }
                  className="w-full bg-[#131520] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
