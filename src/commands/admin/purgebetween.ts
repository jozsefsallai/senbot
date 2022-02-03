import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, TextChannel, ThreadChannel } from 'discord.js';

import { CommandContext } from '../../core/commands';

export const meta = new SlashCommandBuilder()
  .setName('purgebetween')
  .setDescription('Purge all messages between two messages.')
  .addStringOption((option) =>
    option
      .setName('from')
      .setDescription('The ID of the first message.')
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('to')
      .setDescription('The ID of the second message.')
      .setRequired(true),
  )
  .setDefaultPermission(false);

export { permissions } from '../../guards/staffOnlyCommand';

export const handler = async (ctx: CommandContext<CommandInteraction>) => {
  const fromID = ctx.interaction.options.getString('from')!;
  const toID = ctx.interaction.options.getString('to')!;

  await ctx.interaction.deferReply({ ephemeral: true });

  if (
    !['GUILD_TEXT', 'GUILD_PRIVATE_THREAD', 'GUILD_PUBLIC_THREAD'].includes(
      ctx.interaction.channel?.type ?? '',
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
    const fromMessage = await channel.messages.fetch(fromID);
    const toMessage = await channel.messages.fetch(toID);

    if (!fromMessage || !toMessage) {
      await ctx.interaction.editReply(
        'At least one of the supplied message IDs are invalid.',
      );
      return;
    }

    if (fromMessage.createdAt >= toMessage.createdAt) {
      await ctx.interaction.editReply(
        'The first message must be older than the second message.',
      );
      return;
    }

    const messages = await channel.messages.fetch({
      after: fromMessage.id,
    });

    let deletedCount = 0;

    for await (const message of messages.reverse().values()) {
      if (message.createdTimestamp >= toMessage.createdTimestamp) {
        break;
      }

      await message.delete();
      deletedCount++;
    }

    await fromMessage.delete();
    await toMessage.delete();

    await ctx.interaction.editReply(
      `Successfully purged ${deletedCount + 2} messages.`,
    );
  } catch (err) {
    await ctx.interaction.editReply(
      `An error occurred while purging messages:\n\`\`\`\n${err}\n\`\`\``,
    );
  }
};
