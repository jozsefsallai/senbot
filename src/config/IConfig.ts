export interface GuildConfig {
  guildId: string;
  logChannelId?: string;
  joinChannelId?: string;
  membershipReviewChannelId: string;

  ownerRole: string;
  adminRole: string;
  moderatorRole: string;
  helperRole: string;
  membersRole: string;
}

export interface BotConfig {
  token: string;
  clientId: string;
  activity: string;
}

export interface NakiriConfig {
  apiUrl: string;
  apiKey: string;
  group: string;
  analysisExceptionChannels?: string[];
}

export interface SentryConfig {
  dsn: string;
}

export interface IConfig {
  bot: BotConfig;
  guild: GuildConfig;
  nakiri?: NakiriConfig;
  sentry?: SentryConfig;
}
