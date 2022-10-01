import { SlashCommandBuilder } from '@discordjs/builders';
import { ActivityType } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';

import { CommandContext } from '../../core/handler/CommandHandler';

export const meta = new SlashCommandBuilder()
  .setName('activity')
  .setDescription("Set the bot's activity (does not persist between deploys).")
  .addStringOption((option) =>
    option
      .setName('text')
      .setDescription("The new activity's text.")
      .setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName('type')
      .setDescription('The type of the activity.')
      .addChoices(
        { name: 'Playing', value: ActivityType.Playing },
        { name: 'Streaming', value: ActivityType.Streaming },
        { name: 'Listening', value: ActivityType.Listening },
        { name: 'Watching', value: ActivityType.Watching },
        { name: 'Competing', value: ActivityType.Competing },
      )
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName('url')
      .setDescription('The URL of the activity.')
      .setRequired(false),
  )
  .setDefaultPermission(false);

export { permissions } from '../../guards/staffOnlyCommand';

export const handler = async (ctx: CommandContext<CommandInteraction>) => {
  const text = ctx.interaction.options.getString('text')!;
  const type: ActivityType =
    ctx.interaction.options.getInteger('type') ?? ActivityType.Playing;
  const url = ctx.interaction.options.getString('url') ?? undefined;

  await ctx.interaction.deferReply({ ephemeral: true });
  try {
    await ctx.client.setPlayingStatus(text, type, url);
    await ctx.interaction.editReply('New activity set successfully.');
  } catch (err) {
    ctx.client.reportToSentry(err);

    await ctx.interaction.editReply(
      `Failed to set activity:\n\`\`\`\n${err}\n\`\`\``,
    );
  }
};
