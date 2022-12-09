import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { CommandContext } from '../../core/handler/CommandHandler';
import { truncate } from '../../utils/truncate';

export const meta = new SlashCommandBuilder()
  .setName('chatgpt')
  .setDescription('Ask something from ChatGPT.')
  .addStringOption((option) =>
    option
      .setName('prompt')
      .setDescription('The prompt you want to give to the AI.')
      .setRequired(true),
  )
  .setDefaultPermission(true);

export const handler = async (ctx: CommandContext<CommandInteraction>) => {
  if (!ctx.client.chatgpt) {
    await ctx.interaction.reply(
      'ChatGPT is not available on this instance of senbot.',
    );
    return;
  }

  await ctx.interaction.deferReply();

  try {
    await ctx.client.chatgpt.ensureAuth();
  } catch (err) {
    ctx.client.reportToSentry(err);

    await ctx.interaction.editReply(
      'ChatGPT is currently not available. Please try again later.',
    );
    return;
  }

  const prompt = ctx.interaction.options.getString('prompt');

  try {
    const response = await ctx.client.chatgpt.sendMessage(prompt!);
    await ctx.interaction.editReply(truncate(response, 2000));
  } catch (err) {
    ctx.client.reportToSentry(err);

    await ctx.interaction.editReply(
      'Something went wrong while trying to generate your response. Please try again later.',
    );
  }
};
