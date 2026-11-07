export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
  verified: boolean;
  nitroTier?: number;
  serversCount: number;
}

export type BotStatus = 'online' | 'idle' | 'dnd' | 'offline';
export type ActivityType = 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING' | 'COMPETING';

export interface ConnectedBot {
  id: string;
  name: string;
  discriminator: string;
  avatar: string | null;
  status: BotStatus;
  activityType: ActivityType;
  activityText: string;
  prefix: string;
  slashCommandsEnabled: boolean;
  latencyMs: number;
  serversCount: number;
  membersCount: number;
  uptime: number;
  addedAt: string;
  isCustomToken: boolean;
}

export interface BotCommand {
  id: string;
  name: string;
  description: string;
  category: 'Moderation' | 'Utility' | 'Leveling' | 'Giveaways' | 'Fun' | 'Custom';
  enabled: boolean;
  slash: boolean;
  prefix: boolean;
  cooldown: number; // in seconds
  userPerms: string[];
  response?: string;
}

export interface ModerationConfig {
  antiSpam: {
    enabled: boolean;
    maxMessages: number;
    perSeconds: number;
    action: 'WARN' | 'TIMEOUT_5M' | 'TIMEOUT_1H' | 'KICK';
  };
  antiInviteLinks: {
    enabled: boolean;
    whitelistDomains: string[];
    action: 'DELETE' | 'DELETE_AND_WARN' | 'TIMEOUT_10M';
  };
  badWordsFilter: {
    enabled: boolean;
    words: string[];
    action: 'DELETE' | 'DELETE_AND_WARN';
  };
  massMentions: {
    enabled: boolean;
    maxMentions: number;
    action: 'DELETE' | 'TIMEOUT_10M' | 'TIMEOUT_1H';
  };
  antiCaps: {
    enabled: boolean;
    percentageThreshold: number;
    minChars: number;
    action: 'DELETE' | 'DELETE_AND_WARN';
  };
  modLogChannel: string;
  notifyUserInDM: boolean;
  maxWarningsBeforeBan: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'MEMBER_JOIN' | 'KEYWORD_MATCH' | 'MESSAGE_IN_ANNOUNCEMENT_CHANNEL' | 'USER_LEVEL_UP' | 'ROLE_ADDED';
  action: 'SEND_DM' | 'ADD_REACTION' | 'CROSSPOST_MESSAGE' | 'ASSIGN_ROLE' | 'DISPATCH_WEBHOOK';
  enabled: boolean;
  params: {
    message?: string;
    keyword?: string;
    emoji?: string;
    roleName?: string;
    webhookUrl?: string;
  };
}

export interface WelcomeConfig {
  enabled: boolean;
  channel: string;
  sendAsEmbed: boolean;
  title: string;
  description: string;
  color: string;
  thumbnailUrl: string;
  showFooter: boolean;
  footerText: string;
  sendDirectMessage: boolean;
  dmMessage: string;
}

export interface LeaveConfig {
  enabled: boolean;
  channel: string;
  sendAsEmbed: boolean;
  title: string;
  description: string;
  color: string;
}

export interface LoggingConfig {
  messageDelete: { enabled: boolean; channel: string };
  messageEdit: { enabled: boolean; channel: string };
  memberJoin: { enabled: boolean; channel: string };
  memberLeave: { enabled: boolean; channel: string };
  roleUpdates: { enabled: boolean; channel: string };
  voiceState: { enabled: boolean; channel: string };
  channelModifications: { enabled: boolean; channel: string };
}

export interface AutoRolesConfig {
  enabled: boolean;
  humanRoles: string[];
  botRoles: string[];
  delaySeconds: number;
  restoreOnRejoin: boolean;
}

export interface ReactionRoleOption {
  emoji: string;
  label: string;
  role: string;
  color: string;
}

export interface ReactionRoleConfig {
  id: string;
  name: string;
  channel: string;
  messageId: string;
  mode: 'TOGGLE' | 'UNIQUE' | 'VERIFY';
  options: ReactionRoleOption[];
}

export interface TicketConfig {
  enabled: boolean;
  categoryName: string;
  transcriptChannel: string;
  supportTeamRole: string;
  maxOpenTicketsPerUser: number;
  ticketPanelTitle: string;
  ticketPanelDescription: string;
  buttonLabel: string;
  buttonEmoji: string;
  welcomeInsideTicket: string;
}

export interface GiveawayItem {
  id: string;
  prize: string;
  channel: string;
  durationHours: number;
  winnersCount: number;
  requiredRole: string;
  status: 'ACTIVE' | 'ENDED';
  entriesCount: number;
  winnerNames?: string[];
  endsAt: string;
}

export interface LevelingConfig {
  enabled: boolean;
  xpMultiplier: number;
  xpCooldownSeconds: number;
  voiceXpEnabled: boolean;
  announceLevelUp: boolean;
  levelUpChannel: 'SAME_CHANNEL' | 'DEDICATED' | 'DM';
  customCardBgColor: string;
  customCardAccent: string;
  roleRewards: Array<{ level: number; role: string }>;
}

export interface CustomEmbedField {
  name: string;
  value: string;
  inline: boolean;
}

export interface CustomEmbedItem {
  id: string;
  name: string;
  title: string;
  description: string;
  color: string;
  author: { name: string; iconUrl?: string; url?: string };
  fields: CustomEmbedField[];
  footer: { text: string; iconUrl?: string };
  thumbnailUrl?: string;
  imageUrl?: string;
  timestamp: boolean;
}

export interface AnalyticsData {
  totalCommandsUsed: number;
  moderationActions30d: number;
  activeUsers24h: number;
  uptimePercentage: number;
  commandBreakdown: Array<{ name: string; count: number }>;
}

export interface IntegrationsConfig {
  twitchAlerts: { enabled: boolean; streamerName: string; channel: string };
  youtubeAlerts: { enabled: boolean; channelId: string; channel: string };
  githubWebhook: { enabled: boolean; repository: string; channel: string };
  redditFeed: { enabled: boolean; subreddit: string; channel: string };
}

export interface DashboardSettings {
  language: string;
  timezone: string;
  dashboardTheme: string;
  auditLogging: boolean;
  enableTwoFactorAuth: boolean;
}

export interface BotFullConfig {
  overview?: {
    enableAutoRestart: boolean;
    debugMode: boolean;
    logLevel: string;
  };
  botManagement?: {
    activityType: ActivityType;
    activityText: string;
    status: BotStatus;
    prefix: string;
    slashCommandsEnabled: boolean;
    customStatusDuration: string;
    shardingEnabled: boolean;
    intents: Record<string, boolean>;
  };
  commands: BotCommand[];
  moderation: ModerationConfig;
  automations: AutomationRule[];
  welcomeSystem: WelcomeConfig;
  leaveMessages: LeaveConfig;
  logging: LoggingConfig;
  autoRoles: AutoRolesConfig;
  reactionRoles: ReactionRoleConfig[];
  ticketSystem: TicketConfig;
  giveawaySystem: GiveawayItem[];
  levelingSystem: LevelingConfig;
  customEmbeds: CustomEmbedItem[];
  analytics: AnalyticsData;
  integrations: IntegrationsConfig;
  settings: DashboardSettings;
}

export type SectionKey =
  | 'overview'
  | 'my-bots'
  | 'bot-management'
  | 'commands'
  | 'moderation'
  | 'automations'
  | 'welcome-system'
  | 'leave-messages'
  | 'logging'
  | 'auto-roles'
  | 'reaction-roles'
  | 'ticket-system'
  | 'giveaway-system'
  | 'leveling-system'
  | 'custom-embeds'
  | 'analytics'
  | 'integrations'
  | 'settings';
