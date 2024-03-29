import { IConfig } from './IConfig';

import * as path from 'path';

import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = [
  'BOT_TOKEN',
  'CLIENT_ID',
  'GUILD_ID',
  'MEMBERSHIP_REVIEW_CHANNEL_ID',
  'OWNER_ROLE',
  'ADMIN_ROLE',
  'MODERATOR_ROLE',
  'HELPER_ROLE',
  'MEMBERS_ROLE',
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
    membershipReviewChannelId: process.env.MEMBERSHIP_REVIEW_CHANNEL_ID!,

    ownerRole: process.env.OWNER_ROLE!,
    adminRole: process.env.ADMIN_ROLE!,
    moderatorRole: process.env.MODERATOR_ROLE!,
    helperRole: process.env.HELPER_ROLE!,
    membersRole: process.env.MEMBERS_ROLE!,
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

if (
  process.env.S3_BUCKET &&
  process.env.S3_ENDPOINT &&
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY
) {
  config.s3 = {
    bucket: process.env.S3_BUCKET,
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  };
}

if (process.env.DANBOORU_API_KEY && process.env.DANBOORU_USERNAME) {
  config.danbooru = {
    username: process.env.DANBOORU_USERNAME,
    apiKey: process.env.DANBOORU_API_KEY,
  };
}

if (process.env.SAUCENAO_API_KEY) {
  config.saucenao = {
    apiKey: process.env.SAUCENAO_API_KEY,
  };
}

if (process.env.STABLE_HORDE_API_KEY) {
  config.stablehorde = {
    apiKey: process.env.STABLE_HORDE_API_KEY,
  };
}

export default config;
