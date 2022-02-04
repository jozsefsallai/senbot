import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { RepeatMode } from 'distube';
import { CommandContext } from '../../core/commands';

export const meta = new SlashCommandBuilder()
  .setName('repeat')
  .setDescription('Set the repeat mode of the current music playback.')
  .addIntegerOption((option) =>
    option
      .setName('mode')
      .setDescription('The repeat mode.')
      .setRequired(true)
      .addChoice('Disabled', RepeatMode.DISABLED)
      .addChoice('Repeat song', RepeatMode.SONG)
      .addChoice('Repeat queue', RepeatMode.QUEUE),
  ) as SlashCommandBuilder;

export const handler = async (ctx: CommandContext<CommandInteraction>) => {
  const channel = (ctx.interaction.member as GuildMember)?.voice.channel;
  if (!channel) {
    await ctx.interaction.reply({
      content: 'You must be in a voice channel to use this command.',
      ephemeral: true,
    });
    return;
  }

  const mode: RepeatMode = ctx.interaction.options.getInteger('mode')!;

  const queue = ctx.client.distube.getQueue(ctx.interaction.guildId!);
  if (!queue) {
    await ctx.interaction.reply({
      content: 'There is no music playing right now.',
      ephemeral: true,
    });
    return;
  }

  const modes: Record<RepeatMode, string> = {
    [RepeatMode.DISABLED]: 'Disabled',
    [RepeatMode.SONG]: 'Repeat song',
    [RepeatMode.QUEUE]: 'Repeat queue',
  };

  await ctx.client.distube.setRepeatMode(ctx.interaction.guildId!, mode);
  await ctx.interaction.reply(`Repeat mode changed to "${modes[mode]}".`);
};
