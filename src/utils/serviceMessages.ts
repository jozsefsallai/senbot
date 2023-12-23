import { EmbedBuilder } from 'discord.js';
import {
  EMBED_GREEN,
  EMBED_LIGHT_BLUE,
  EMBED_ORANGE,
  EMBED_RED,
} from '../core/constants';

const logEmbed = (
  level: 'info' | 'error' | 'warn' | 'success',
  input: string | string[],
): EmbedBuilder => {
  const colors = {
    info: EMBED_LIGHT_BLUE,
    error: EMBED_RED,
    warn: EMBED_ORANGE,
    success: EMBED_GREEN,
  };

  const titles = {
    info: ':information_source: Information',
    error: ':x: Error',
    warn: ':warning: Warning',
    success: ':white_check_mark: Success',
  };

  if (typeof input !== 'string') {
    input = input.join(' ');
  }

  const embed = new EmbedBuilder();
  embed.setColor(colors[level]);
  embed.setTitle(titles[level]);
  embed.setDescription(input);
  return embed;
};

const info = (input: string | string[]): EmbedBuilder =>
  logEmbed('info', input);
const error = (input: string | string[]): EmbedBuilder =>
  logEmbed('error', input);
const warn = (input: string | string[]): EmbedBuilder =>
  logEmbed('warn', input);
const success = (input: string | string[]): EmbedBuilder =>
  logEmbed('success', input);

const UNEXPECTED_ERROR = 'An unexpected error happened.';

export { info, error, warn, success, UNEXPECTED_ERROR };
