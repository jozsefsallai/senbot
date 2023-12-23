import {
  ChatInputCommandInteraction,
  TextChannel,
  ThreadChannel,
  SlashCommandBuilder,
} from 'discord.js';

import { CommandContext } from '../../core/handler/CommandHandler';

export const meta = new SlashCommandBuilder()
  .setName('purge')
  .setDescription('Purge a number of messages.')
  .addIntegerOption((option) =>
    option
      .setName('count')
      .setDescription('The number of messages to purge.')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(100),
  )
  .setDefaultPermission(false);

export { permissions } from '../../guards/staffOnlyCommand';

export const handler = async (
  ctx: CommandContext<ChatInputCommandInteraction>,
) => {
  const count = ctx.interaction.options.getInteger('count')!;

  await ctx.interaction.deferReply({ ephemeral: true });

  if (
    !['GUILD_TEXT', 'GUILD_PRIVATE_THREAD', 'GUILD_PUBLIC_THREAD'].includes(
      ctx.interaction.channel?.type?.toString() ?? '',
    )
  ) {
    await ctx.interaction.editReply(
      'You can only use this command in a text channel or a thread.',
    );
  }

  const channel = (await ctx.interaction.channel) as
    | TextChannel
    | ThreadChannel;

  try {
    const messages = await channel.messages.fetch({ limit: count });
    let deletedCount = 0;

    for await (const message of messages.values()) {
      await message.delete();
      deletedCount++;
    }

    await ctx.interaction.editReply(
      `Successfully purged ${deletedCount} messages.`,
    );
  } catch (err) {
    ctx.client.reportToSentry(err);
    await ctx.interaction.editReply(
      `An error occurred while purging messages:\n\`\`\`\n${err}\n\`\`\``,
    );
  }
};
