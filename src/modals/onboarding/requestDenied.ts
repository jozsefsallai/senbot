import {
  GuildMember,
  ActionRowBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalActionRowComponentBuilder,
} from 'discord.js';
import { EMBED_RED } from '../../core/constants';
import { ModalContext } from '../../core/handler/ModalHandler';
import { STAFF_ONLY_ROLES } from '../../guards/staffOnlyCommand';
import { editOnboardingEntry } from '../../utils/editOnboardingEntry';
import { hasAnyRole } from '../../utils/hasAnyRole';
import { error } from '../../utils/serviceMessages';

enum FieldNames {
  Reason = 'reason',
  Action = 'action',
}

export const meta = {
  id: 'onboarding-request-denied',
};

export const handler = async (ctx: ModalContext) => {
  await ctx.interaction.deferReply();

  if (typeof ctx.uniqueId === 'undefined') {
    await ctx.interaction.editReply({
      embeds: [error('User ID is missing from request.')],
    });
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
    });
  } catch (err) {
    // ignore
  }

  const member = await ctx.client.getGuildMemberWithId(userId);
  if (!member) {
    await ctx.interaction.editReply({
      embeds: [
        error('User not found. They might have left the server already.'),
      ],
    });
    return;
  }

  const reason = ctx.interaction.fields.getTextInputValue(FieldNames.Reason);

  let embed = new EmbedBuilder();
  embed.setTitle('❌ Membership request denied.');
  embed.setColor(EMBED_RED);
  embed.setDescription(
    'Your request to join the **Senzawa Fan Discord** has been denied.',
  );

  if (reason) {
    embed.addFields({ name: 'Reason', value: reason });
  }

  try {
    const dm = await member.createDM();
    await dm.send({ embeds: [embed] });
  } catch (err) {
    // ignore
  }

  embed = new EmbedBuilder();
  embed.setTitle('✅ User denied successfully.');
  embed.setColor(EMBED_RED);
  embed.setDescription(
    `User ${member.toString()} has been denied by ${ctx.interaction.user.toString()}.`,
  );

  if (reason) {
    embed.addFields({ name: 'Reason', value: reason });
  }

  await ctx.interaction.editReply({ embeds: [embed] });
};

export const generateOnboardingRequestDeniedModal = (
  userId: string,
): ModalBuilder => {
  const modal = new ModalBuilder();
  modal.setCustomId(`onboarding-request-denied_${userId}`);
  modal.setTitle('Deny membership request');

  const reasonField = new TextInputBuilder()
    .setCustomId(FieldNames.Reason)
    .setLabel('Reason (optional)')
    .setPlaceholder('Tell the user why they got rejected.')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false);

  modal.addComponents(
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      reasonField,
    ),
  );

  return modal;
};
