import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { CommandContext } from '../../core/handler/CommandHandler';

export const meta = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skip a song in the current queue.')
  .setDefaultPermission(false);

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

  const nextsong = await ctx.client.distube.skip(ctx.interaction.guildId!);
  await ctx.interaction.reply(
    `Skipped! Now playing ${nextsong.name ?? 'Unknown'}`,
  );
};
