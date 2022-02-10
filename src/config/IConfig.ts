export interface GuildConfig {
  guildId: string;
  logChannelId?: string;
  joinChannelId?: string;

  ownerRole: string;
  adminRole: string;
  moderatorRole: string;
  helperRole: string;
}

export interface BotConfig {
  token: string;
  clientId: string;
}

export interface NakiriConfig {
  apiUrl: string;
  apiKey: string;
  group: string;
  analysisExceptionChannels?: string[];
}

export interface IConfig {
  bot: BotConfig;
  guild: GuildConfig;
  nakiri?: NakiriConfig;
}
