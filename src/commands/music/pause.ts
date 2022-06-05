import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { CommandContext } from '../../core/handler/CommandHandler';

export const meta = new SlashCommandBuilder()
  .setName('pause')
  .setDescription('Pause the playback of the current song.');

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
  if (queue?.paused) {
    await ctx.interaction.reply({
      content: 'Playback is already paused.',
      ephemeral: true,
    });
    return;
  }

  await ctx.client.distube.pause(ctx.interaction.guildId!);
  await ctx.interaction.reply('Playback paused.');
};
