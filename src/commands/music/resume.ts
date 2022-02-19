import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { CommandContext } from '../../core/commands';

export const meta = new SlashCommandBuilder()
  .setName('resume')
  .setDescription('Resume the playback of the current song.');

export const handler = async (ctx: CommandContext<CommandInteraction>) => {
  const channel = (ctx.interaction.member as GuildMember)?.voice.channel;
  if (!channel) {
    await ctx.interaction.reply({
      content: 'You must be in a voice channel to use this command.',
      ephemeral: true,
    });
    return;
  }

  const queue = await ctx.client.distube.getQueue(ctx.interaction.guildId!);
  if (queue?.playing) {
    await ctx.interaction.reply({
      content: 'Playback is not paused.',
      ephemeral: true,
    });
    return;
  }

  await ctx.client.distube.resume(ctx.interaction.guildId!);
  await ctx.interaction.reply('Playback resumed.');
};
