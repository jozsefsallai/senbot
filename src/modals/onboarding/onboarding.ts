import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
  ModalActionRowComponentBuilder,
} from 'discord.js';
import config from '../../config';
import { EMBED_LIGHT_BLUE } from '../../core/constants';
import { ModalContext } from '../../core/handler/ModalHandler';

enum FieldNames {
  Introduction = 'introduction',
  Referrer = 'referrer',
  Consent = 'consent',
}

export const meta = {
  id: 'onboarding',
};

export const handler = async (ctx: ModalContext) => {
  if (!ctx.uniqueId) {
    return;
  }

  await ctx.interaction.deferReply({
    ephemeral: true,
  });

  try {
    const userId = ctx.uniqueId;
    const firstAnswer = ctx.interaction.fields.getTextInputValue(
      FieldNames.Introduction,
    );
    const secondAnswer = ctx.interaction.fields.getTextInputValue(
      FieldNames.Referrer,
    );
    const thirdAnswer = ctx.interaction.fields.getTextInputValue(
      FieldNames.Consent,
    );

    const embed = new EmbedBuilder();

    const { user } = ctx.interaction;

    embed.setTitle('New membership request');
    embed.setDescription(
      `User ${user.toString()} has requested to join the server.`,
    );
    embed.setColor(EMBED_LIGHT_BLUE);

    embed.addFields({ name: 'Status', value: 'PENDING REVIEW' });
    embed.addFields({
      name: 'Account creation date',
      value: user.createdAt.toUTCString(),
    });
    embed.addFields({ name: 'Tag', value: user.tag, inline: true });
    embed.addFields({ name: 'ID', value: userId, inline: true });

    embed.addFields({ name: 'Introduction', value: firstAnswer });
    embed.addFields({ name: 'Referrer', value: secondAnswer });
    embed.addFields({ name: 'Consent', value: thirdAnswer });

    embed.setThumbnail(user.displayAvatarURL());

    const approveButton = new ButtonBuilder();
    approveButton
      .setCustomId(`approve-membership_${userId}`)
      .setLabel('Approve')
      .setStyle(ButtonStyle.Success);

    const rejectButton = new ButtonBuilder();
    rejectButton
      .setCustomId(`reject-membership_${userId}`)
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger);

    const processingButton = new ButtonBuilder();
    processingButton
      .setCustomId(`processing-membership_${userId}`)
      .setLabel('Mark as processing')
      .setStyle(ButtonStyle.Primary);

    const componentRow = new ActionRowBuilder<ButtonBuilder>();
    componentRow.addComponents(approveButton, rejectButton, processingButton);

    const channel = await ctx.client.getChannelWithId(
      config.guild.membershipReviewChannelId,
    );
    if (!channel || !channel.isTextBased()) {
      throw new Error('Failed to find membership review channel.');
    }

    const textChannel = <TextChannel>channel;
    await textChannel.send({
      embeds: [embed],
      components: [componentRow],
    });

    await ctx.interaction.editReply(
      'Membership request sent successfully. We will review it as soon as possible.',
    );
  } catch {
    await ctx.interaction.editReply(
      'Failed to send membership request. Please contact a staff member via DM.',
    );
  }
};

export const generateOnboardingModal = (userId: string): ModalBuilder => {
  const modal = new ModalBuilder();
  modal.setCustomId(`onboarding_${userId}`);
  modal.setTitle('Membership request form');

  const firstField = new TextInputBuilder()
    .setCustomId(FieldNames.Introduction)
    .setLabel('Introduction')
    .setPlaceholder('Give us a brief introduction of yourself!')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const secondField = new TextInputBuilder()
    .setCustomId(FieldNames.Referrer)
    .setLabel('How did you get here?')
    .setPlaceholder(
      'How did you find out about senzawa and this Discord server?',
    )
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const thirdField = new TextInputBuilder()
    .setCustomId(FieldNames.Consent)
    .setLabel('Confirmation')
    .setPlaceholder(
      'Please confirm that you acknowledge violating certain rules can result in an instant ban.',
    )
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      firstField,
    ),
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      secondField,
    ),
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      thirdField,
    ),
  );

  return modal;
};
