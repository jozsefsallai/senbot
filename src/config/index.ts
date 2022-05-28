import { IConfig } from './IConfig';

import * as path from 'path';

import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = [
  'BOT_TOKEN',
  'CLIENT_ID',
  'GUILD_ID',
  'OWNER_ROLE',
  'ADMIN_ROLE',
  'MODERATOR_ROLE',
  'HELPER_ROLE',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

const config: IConfig = {
  bot: {
    token: process.env.BOT_TOKEN!,
    clientId: process.env.CLIENT_ID!,
    activity: process.env.BOT_ACTIVITY ?? 'with bubbles in a bath',
  },

  guild: {
    guildId: process.env.GUILD_ID!,
    logChannelId: process.env.LOG_CHANNEL_ID,
    joinChannelId: process.env.JOIN_CHANNEL_ID,

    ownerRole: process.env.OWNER_ROLE!,
    adminRole: process.env.ADMIN_ROLE!,
    moderatorRole: process.env.MODERATOR_ROLE!,
    helperRole: process.env.HELPER_ROLE!,
  },
};

if (process.env.NAKIRIAPI_KEY) {
  if (process.env.NAKIRIAPI_GROUP) {
    config.nakiri = {
      apiUrl: process.env.NAKIRIAPI_URL ?? 'https://nakiri.one/api',
      apiKey: process.env.NAKIRIAPI_KEY,
      group: process.env.NAKIRIAPI_GROUP,
      analysisExceptionChannels:
        process.env.NAKIRIAPI_ANALYSIS_EXCEPTION_CHANNELS?.split(',')?.map(
          (channel) => channel.trim(),
        ),
    };
  } else {
    console.warn(
      'Nakiri API key was provided but no group was specified. Nakiri will be disabled.',
    );
  }
}

if (process.env.SENTRY_DSN) {
  config.sentry = {
    dsn: process.env.SENTRY_DSN,
  };
}

export default config;
