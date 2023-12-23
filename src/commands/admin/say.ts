import {
  ChatInputCommandInteraction,
  TextBasedChannel,
  SlashCommandBuilder,
} from 'discord.js';

import { CommandContext } from '../../core/handler/CommandHandler';
import { error } from '../../utils/serviceMessages';
import { sleep } from '../../utils/sleep';

export const meta = new SlashCommandBuilder()
  .setName('say')
  .setDescription('Make the bot say something.')
  .addStringOption((option) =>
    option
      .setName('message')
      .setDescription('Message to say.')
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('replyto')
      .setDescription('Message ID to reply to.')
      .setRequired(false),
  )
  .setDefaultPermission(false);

export { permissions } from '../../guards/staffOnlyCommand';

const startTyping = async (channel: TextBasedChannel, message: string) => {
  const typingTime = (message.split(' ').length / 2.5) * 1000;
  await channel.sendTyping();
  await sleep(typingTime);
};

export const handler = async (
  ctx: CommandContext<ChatInputCommandInteraction>,
) => {
  const message = ctx.interaction.options.getString('message')!;
  const replyTo = ctx.interaction.options.getString('replyto');

  await ctx.interaction.deferReply({ ephemeral: true });

  const channel = ctx.interaction.channel!;

  if (replyTo) {
    try {
      const targetMessage = await channel.messages.fetch(replyTo);
      if (!targetMessage) {
        await ctx.interaction.editReply({
          embeds: [error('Message not found.')],
        });
        return;
      }

      await startTyping(channel, message);
      await targetMessage.reply(message);
      await ctx.interaction.editReply('Done!');

      return;
    } catch (err) {
      await ctx.interaction.editReply({
        embeds: [error('Failed to fetch target message.')],
      });
      return;
    }
  }

  await startTyping(channel, message);
  await channel.send(message);
  await ctx.interaction.editReply('Done!');
};
