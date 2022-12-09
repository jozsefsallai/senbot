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

export interface S3Config {
  bucket: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface DanbooruConfig {
  username: string;
  apiKey: string;
}

export interface SaucenaoConfig {
  apiKey: string;
}

export interface StableHordeConfig {
  apiKey: string;
}

export interface ChatGPTConfig {
  sessionToken: string;
}

export interface IConfig {
  bot: BotConfig;
  guild: GuildConfig;
  nakiri?: NakiriConfig;
  sentry?: SentryConfig;
  s3?: S3Config;
  danbooru?: DanbooruConfig;
  saucenao?: SaucenaoConfig;
  stablehorde?: StableHordeConfig;
  chatgpt?: ChatGPTConfig;
}
