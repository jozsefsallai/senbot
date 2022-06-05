import { SlashCommandBuilder } from '@discordjs/builders';
import {
  CommandInteraction,
  GuildMember,
  TextChannel,
  VoiceBasedChannel,
} from 'discord.js';
import { CommandContext } from '../../core/handler/CommandHandler';

export const meta = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Search a song on YouTube and play it.')
  .addStringOption((option) =>
    option
      .setName('query')
      .setDescription('The query to search for.')
      .setRequired(true),
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

  const query = ctx.interaction.options.getString('query')!;

  await ctx.interaction.deferReply();
  await ctx.interaction.deleteReply();

  await ctx.client.distube.play(channel as VoiceBasedChannel, query, {
    textChannel: ctx.interaction.channel as TextChannel,
  });
};
