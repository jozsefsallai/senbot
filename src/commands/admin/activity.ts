import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

import { CommandContext } from '../../core/commands';

export const meta = new SlashCommandBuilder()
  .setName('activity')
  .setDescription("Set the bot's activity (does not persist between deploys).")
  .addStringOption((option) =>
    option
      .setName('text')
      .setDescription("The new activity's text.")
      .setRequired(true),
  )
  .setDefaultPermission(false);

export { permissions } from '../../guards/staffOnlyCommand';

export const handler = async (ctx: CommandContext<CommandInteraction>) => {
  const text = ctx.interaction.options.getString('text')!;
  await ctx.interaction.deferReply({ ephemeral: true });
  try {
    await ctx.client.setPlayingStatus(text);
    await ctx.interaction.editReply('New activity set successfully.');
  } catch (err) {
    await ctx.interaction.editReply(
      `Failed to set activity:\n\`\`\`\n${err}\n\`\`\``,
    );
  }
};
