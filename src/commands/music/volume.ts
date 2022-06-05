import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { CommandContext } from '../../core/handler/CommandHandler';

export const meta = new SlashCommandBuilder()
  .setName('volume')
  .setDescription('Set the volume of the current music playback.')
  .addIntegerOption((option) =>
    option
      .setName('volume')
      .setDescription('The volume to set the playback to.')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(100),
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

  const volume = ctx.interaction.options.getInteger('volume')!;
  const realvolume = Math.min(Math.max(volume, 1), 100);

  const queue = ctx.client.distube.getQueue(ctx.interaction.guildId!);
  if (!queue) {
    await ctx.interaction.reply({
      content: 'There is no music playing right now.',
      ephemeral: true,
    });
    return;
  }

  await ctx.client.distube.setVolume(ctx.interaction.guildId!, realvolume);
  await ctx.interaction.reply(`Set the volume to ${realvolume}%.`);
};
