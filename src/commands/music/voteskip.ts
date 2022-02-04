import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, Message } from 'discord.js';
import { CommandContext } from '../../core/commands';

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
    `If this message reaches ${targetCount} :white_check_mark: reactions in ${time} seconds, I will skip the song.`,
  );
  await (reply as Message).react('✅');

  const collector = (reply as Message).createReactionCollector({
    time: time * 1000,
    filter: (reaction) => reaction.emoji.name === '✅',
  });

  let enoughVotes = false;

  collector.on('collect', async (reaction) => {
    if (reaction.count >= targetCount) {
      collector.stop();
      enoughVotes = true;

      const nextsong = await ctx.client.distube.skip(ctx.interaction.guildId!);
      await ctx.interaction.editReply(
        `Skipped! Now playing ${nextsong.name ?? 'Unknown'}`,
      );
    }
  });

  collector.on('end', async () => {
    if (enoughVotes) {
      return;
    }

    await ctx.interaction.editReply('Not enough reactions, not skipping.');
  });
};
