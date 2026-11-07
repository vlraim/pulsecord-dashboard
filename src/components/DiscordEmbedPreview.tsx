import React from 'react';
import { Bot, CheckCircle, ExternalLink } from 'lucide-react';
import { InitialsAvatar } from './InitialsAvatar';

interface DiscordEmbedPreviewProps {
  botName?: string;
  botAvatar?: string | null;
  author?: { name: string; iconUrl?: string; url?: string };
  title?: string;
  description?: string;
  color?: string;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  footer?: { text?: string; iconUrl?: string };
  thumbnailUrl?: string;
  imageUrl?: string;
  timestamp?: boolean;
  buttons?: Array<{ label: string; emoji?: string; style?: 'primary' | 'secondary' | 'success' | 'danger' }>;
  reactions?: Array<{ emoji: string; count: number; active?: boolean }>;
}

export const DiscordEmbedPreview: React.FC<DiscordEmbedPreviewProps> = ({
  botName = 'PulseCord Bot',
  botAvatar,
  author,
  title,
  description,
  color = '#8b5cf6',
  fields = [],
  footer,
  thumbnailUrl,
  imageUrl,
  timestamp = true,
  buttons = [],
  reactions = [],
}) => {
  return (
    <div className="bg-[#313338] text-[#dbdee1] rounded-xl p-4 sm:p-5 font-sans border border-[#3f4147] shadow-2xl max-w-2xl w-full">
      {/* Bot message header */}
      <div className="flex items-start gap-3 mb-2">
        {botAvatar && botAvatar.trim() !== '' ? (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#5865F2] flex-shrink-0 flex items-center justify-center text-white font-bold">
            <img src={botAvatar} alt={botName} className="w-full h-full object-cover" />
          </div>
        ) : (
          <InitialsAvatar name={botName} size="md" shape="circle" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white hover:underline cursor-pointer text-sm">
              {botName}
            </span>
            <span className="bg-[#5865F2] text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase flex items-center gap-1">
              <CheckCircle className="w-2.5 h-2.5 inline" /> BOT
            </span>
            <span className="text-xs text-[#949ba4]">Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {/* Discord Embed Box */}
          <div
            className="mt-2.5 rounded-r-lg bg-[#2b2d31] p-3.5 sm:p-4 text-sm border-l-4 shadow-sm"
            style={{ borderLeftColor: color }}
          >
            {/* Author */}
            {author?.name && (
              <div className="flex items-center gap-2 mb-2 text-xs font-medium text-white">
                {author.iconUrl && author.iconUrl.trim() !== '' ? (
                  <img src={author.iconUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <InitialsAvatar name={author.name} size="xs" shape="circle" />
                )}
                <span>{author.name}</span>
              </div>
            )}

            {/* Thumbnail + Title/Description layout */}
            <div className="flex gap-4 items-start">
              <div className="flex-1 min-w-0">
                {title && (
                  <h4 className="font-bold text-white text-base hover:underline cursor-pointer mb-1.5">
                    {title}
                  </h4>
                )}
                {description && (
                  <div className="text-xs sm:text-sm text-[#dbdee1] whitespace-pre-wrap leading-relaxed">
                    {description}
                  </div>
                )}
              </div>
              {thumbnailUrl && thumbnailUrl.trim() !== '' ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-[#1e1f22] flex-shrink-0">
                  <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
              ) : null}
            </div>

            {/* Fields Grid */}
            {fields.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-2 border-t border-[#35373c]">
                {fields.map((f, i) => (
                  <div key={i} className={f.inline ? 'col-span-1' : 'col-span-1 sm:col-span-2'}>
                    <div className="font-semibold text-xs text-white mb-0.5">{f.name}</div>
                    <div className="text-xs text-[#b5bac1] whitespace-pre-wrap">{f.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Main Image */}
            {imageUrl && imageUrl.trim() !== '' ? (
              <div className="mt-3 rounded-lg overflow-hidden max-h-64 bg-[#1e1f22]">
                <img src={imageUrl} alt="Embed Media" className="w-full h-auto object-cover max-h-64" />
              </div>
            ) : null}

            {/* Footer */}
            {(footer?.text || timestamp) && (
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#35373c] text-[11px] text-[#949ba4]">
                {footer?.iconUrl && footer.iconUrl.trim() !== '' ? (
                  <img src={footer.iconUrl} alt="" className="w-4 h-4 rounded-full" />
                ) : null}
                <span>{footer?.text || 'PulseCord Automated Engine'}</span>
                {timestamp && <span>• Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
              </div>
            )}
          </div>

          {/* Interactive Discord Buttons Mockup */}
          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2.5">
              {buttons.map((btn, i) => (
                <button
                  key={i}
                  type="button"
                  className="px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition bg-[#4e5058] hover:bg-[#6d6f78] text-white shadow-sm"
                >
                  {btn.emoji && <span>{btn.emoji}</span>}
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Discord Emoji Reactions Mockup */}
          {reactions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {reactions.map((r, i) => (
                <div
                  key={i}
                  className={`px-2 py-1 rounded text-xs flex items-center gap-1.5 cursor-pointer border ${
                    r.active
                      ? 'bg-[#3c4270] border-[#5865F2] text-white font-semibold'
                      : 'bg-[#2b2d31] border-[#35373c] text-[#b5bac1] hover:bg-[#35373c]'
                  }`}
                >
                  <span>{r.emoji}</span>
                  <span className="text-[11px] font-mono">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
