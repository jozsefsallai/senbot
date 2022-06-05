import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { CommandContext } from '../../core/handler/CommandHandler';
import getQueueEmbed from '../../events/music/lib/queue';

export const meta = new SlashCommandBuilder()
  .setName('queue')
  .setDescription('Get the current music playback queue.');

export const handler = async (ctx: CommandContext<CommandInteraction>) => {
  const channel = (ctx.interaction.member as GuildMember)?.voice.channel;
  if (!channel) {
    await ctx.interaction.reply({
      content: 'You must be in a voice channel to use this command.',
      ephemeral: true,
    });
    return;
  }

  const queue = ctx.client.distube.getQueue(ctx.interaction.guildId!);
  if (!queue) {
    await ctx.interaction.reply({
      content: 'There is no music playing right now.',
      ephemeral: true,
    });
    return;
  }

  const embed = getQueueEmbed('Current Queue', queue.songs);
  await ctx.interaction.reply({
    embeds: [embed],
  });
};
