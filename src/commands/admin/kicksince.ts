import {
  ChatInputCommandInteraction,
  SnowflakeUtil,
  SlashCommandBuilder,
} from 'discord.js';

import { CommandContext } from '../../core/handler/CommandHandler';

import dayjs from 'dayjs';
import { success, warn } from '../../utils/serviceMessages';

export const meta = new SlashCommandBuilder()
  .setName('kicksince')
  .setDescription('Kick all users from a given timestamp.')
  .addStringOption((option) =>
    option
      .setName('snowflake')
      .setDescription('Snowflake ID (copy the message ID from enter-exit).')
      .setRequired(true),
  )
  .addBooleanOption((option) =>
    option
      .setName('confirm')
      .setDescription(
        "Confirm the kick. Only confirm if you know what you're doing.",
      )
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName('reason')
      .setDescription('Reason for the kick.')
      .setRequired(false),
  )
  .setDefaultPermission(false);

export { permissions } from '../../guards/staffOnlyCommand';

export const handler = async (
  ctx: CommandContext<ChatInputCommandInteraction>,
) => {
  const snowflake = ctx.interaction.options.getString('snowflake')!;
  const confirm = ctx.interaction.options.getBoolean('confirm') ?? false;
  const reason = ctx.interaction.options.getString('reason');

  await ctx.interaction.deferReply({ ephemeral: true });

  const timestamp = SnowflakeUtil.timestampFrom(snowflake);

  try {
    const members = await ctx.client.getGuildMembersAfter(timestamp);
    const date = dayjs(timestamp).format('MMMM D, YYYY h:mm:ss A');

    if (!confirm) {
      const warning = warn(
        `You are about to kick **${members.length}** users who joined after **${date}**. If this is correct, run the command again and specify the confirm option. RUN WITH CAUTION.`,
      );

      await ctx.interaction.editReply({
        embeds: [warning],
      });

      return;
    }

    for await (const member of members) {
      await member.kick(reason || undefined);
    }

    const successMessage = success(
      `Successfully kicked **${members.length}** users who joined after **${date}**.`,
    );

    await ctx.interaction.editReply({
      embeds: [successMessage],
    });
  } catch (err) {
    ctx.client.reportToSentry(err);

    await ctx.interaction.editReply(
      `An error occurred while kicking users:\n\`\`\`\n${err}\n\`\`\``,
    );
  }
};
