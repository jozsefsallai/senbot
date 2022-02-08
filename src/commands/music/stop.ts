import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { CommandContext } from '../../core/commands';

export const meta = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Stop the current queue.');

export { permissions } from '../../guards/staffOnlyCommand';

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

  await ctx.client.distube.stop(ctx.interaction.guildId!);
  await ctx.interaction.reply('Playback stopped.');
};
