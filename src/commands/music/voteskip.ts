import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, Message } from 'discord.js';
import { CommandContext } from '../../core/handler/CommandHandler';

export const meta = new SlashCommandBuilder()
  .setName('voteskip')
  .setDescription('Vote to skip a song in the current queue.');

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

  const targetCount = Math.min(channel.members.size, 5) - 1;
  const time = (targetCount + 1) * 5;

  await ctx.interaction.deferReply();
  const reply = await ctx.interaction.editReply(
    `If this message reaches ${targetCount} ✅ reactions in ${time} seconds, I will skip the song.`,
  );
  await (reply as Message).react('✅');

  try {
    await (reply as Message).awaitReactions({
      filter: (reaction, user) => reaction.emoji.name === '✅' && !user.bot,
      time: time * 1000,
      max: targetCount,
      errors: ['time'],
    });

    const queue = await ctx.client.distube.getQueue(ctx.interaction.guildId!);
    if (!queue) {
      await ctx.interaction.editReply('There is no music playing right now.');
      return;
    }

    if (queue.songs.length < 2) {
      await ctx.interaction.editReply(
        'This is the last song in the queue. Use `/votestop` instead.',
      );
      return;
    }

    const nextsong = await ctx.client.distube.skip(ctx.interaction.guildId!);
    await ctx.interaction.editReply(
      `Skipped! Now playing ${nextsong.name ?? 'Unknown'}`,
    );
  } catch (_) {
    await ctx.interaction.editReply('Not enough reactions, not skipping.');
  }
};
