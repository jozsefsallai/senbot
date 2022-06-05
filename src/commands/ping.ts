import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandContext } from '../core/handler/CommandHandler';

export const meta = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with pong');

export const handler = async (ctx: CommandContext) => {
  await ctx.interaction.reply('pong');
};
