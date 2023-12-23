import { GuildMember, EmbedBuilder } from 'discord.js';
import { EMBED_ORANGE } from '../../core/constants';
import { ButtonContext } from '../../core/handler/ButtonHandler';
import { STAFF_ONLY_ROLES } from '../../guards/staffOnlyCommand';
import { editOnboardingEntry } from '../../utils/editOnboardingEntry';
import { hasAnyRole } from '../../utils/hasAnyRole';

export const meta = {
  id: 'processing-membership',
};

export const handler = async (ctx: ButtonContext) => {
  await ctx.interaction.deferReply();

  if (typeof ctx.uniqueId === 'undefined') {
    await ctx.interaction.editReply('User ID is missing from request.');
    return;
  }

  if (!hasAnyRole(STAFF_ONLY_ROLES, ctx.interaction.member as GuildMember)) {
    await ctx.interaction.editReply('You do not have permission to do that.');
    return;
  }

  const userId = ctx.uniqueId;

  try {
    await editOnboardingEntry({
      client: ctx.client,
      messageId: ctx.interaction.message!.id,
      status: 'PROCESSING',
      removeButtons: false,
    });
  } catch (err) {
    // ignore
  }

  const member = await ctx.client.getGuildMemberWithId(userId);
  if (!member) {
    await ctx.interaction.editReply(
      'User not found. They might have left the server already.',
    );
    return;
  }

  try {
    const embed = new EmbedBuilder();
    embed.setTitle('⏳ Asking additional questions...');
    embed.setDescription(
      `The request of user ${member.toString()} is being processed by ${ctx.interaction.user.toString()}. Waiting for additional information from the user.`,
    );
    embed.setColor(EMBED_ORANGE);

    await ctx.interaction.editReply({ embeds: [embed] });
  } catch (err) {
    ctx.client.reportToSentry(err);

    await ctx.interaction.editReply(
      `Failed to send status message:\n\`\`\`\n${err}\n\`\`\``,
    );
  }
};
