import { TextChannel, ThreadChannel, SlashCommandBuilder } from 'discord.js';

import { CommandContext } from '../../core/handler/CommandHandler';

export const meta = new SlashCommandBuilder()
  .setName('purgefrom')
  .setDescription('Purge all messages starting from a given message ID.')
  .addStringOption((option) =>
    option
      .setName('message')
      .setDescription('The ID of the message.')
      .setRequired(true),
  )
  .setDefaultPermission(false);

export { permissions } from '../../guards/staffOnlyCommand';

export const handler = async (ctx: CommandContext) => {
  let id: string | undefined;

  if (ctx.interaction.isMessageContextMenuCommand()) {
    id = ctx.interaction.targetMessage.id;
  }

  if (ctx.interaction.isChatInputCommand()) {
    id = ctx.interaction.options.getString('message')!;
  }

  await ctx.interaction.deferReply({ ephemeral: true });

  if (!id) {
    await ctx.interaction.editReply('Invalid message ID.');
  }

  if (
    !['GUILD_TEXT', 'GUILD_PRIVATE_THREAD', 'GUILD_PUBLIC_THREAD'].includes(
      ctx.interaction.channel?.type?.toString() ?? '',
    )
  ) {
    await ctx.interaction.editReply(
      'You can only use this command in a text channel or a thread.',
    );
    return;
  }

  const channel = (await ctx.interaction.channel) as
    | TextChannel
    | ThreadChannel;

  try {
    const targetMessage = await channel.messages.fetch(id!);

    if (!targetMessage) {
      await ctx.interaction.editReply(
        'Could not find the message with the given ID.',
      );
    }

    const messages = await channel.messages.fetch({
      after: targetMessage.id,
    });

    let deletedCount = 0;

    for await (const message of messages.values()) {
      await message.delete();
      deletedCount++;
    }

    await targetMessage.delete();

    await ctx.interaction.editReply(
      `Successfully purged ${deletedCount + 1} messages.`,
    );
  } catch (err) {
    ctx.client.reportToSentry(err);
    await ctx.interaction.editReply(
      `An error occurred while purging messages:\n\`\`\`\n${err}\n\`\`\``,
    );
  }
};
