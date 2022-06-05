import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Modal,
  ModalActionRowComponent,
  TextChannel,
  TextInputComponent,
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

    const embed = new MessageEmbed();

    embed.setTitle('New membership request');
    embed.setDescription(
      `User ${ctx.interaction.user.toString()} has requested to join the server.`,
    );
    embed.setColor(EMBED_LIGHT_BLUE);

    embed.addField('Status', 'PENDING REVIEW');
    embed.addField(
      'Account creation date',
      ctx.interaction.user.createdAt.toUTCString(),
    );
    embed.addField('Introduction', firstAnswer);
    embed.addField('Referrer', secondAnswer);
    embed.addField('Consent', thirdAnswer);

    const approveButton = new MessageButton();
    approveButton
      .setCustomId(`approve-membership_${userId}`)
      .setLabel('Approve')
      .setStyle('SUCCESS');

    const rejectButton = new MessageButton();
    rejectButton
      .setCustomId(`reject-membership_${userId}`)
      .setLabel('Reject')
      .setStyle('DANGER');

    const componentRow = new MessageActionRow();
    componentRow.addComponents(approveButton, rejectButton);

    const channel = await ctx.client.getChannelWithId(
      config.guild.membershipReviewChannelId,
    );
    if (!channel || !channel.isText()) {
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

export const generateOnboardingModal = (userId: string): Modal => {
  const modal = new Modal();
  modal.setCustomId(`onboarding_${userId}`);
  modal.setTitle('Membership request form');

  const firstField = new TextInputComponent()
    .setCustomId(FieldNames.Introduction)
    .setLabel('Introduction')
    .setPlaceholder('Give us a brief introduction of yourself!')
    .setStyle('PARAGRAPH')
    .setRequired(true);

  const secondField = new TextInputComponent()
    .setCustomId(FieldNames.Referrer)
    .setLabel('How did you get here?')
    .setPlaceholder(
      'How did you find out about senzawa and this Discord server?',
    )
    .setStyle('PARAGRAPH')
    .setRequired(true);

  const thirdField = new TextInputComponent()
    .setCustomId(FieldNames.Consent)
    .setLabel('Confirmation')
    .setPlaceholder(
      'Please confirm that you acknowledge violating certain rules can result in an instant ban.',
    )
    .setStyle('PARAGRAPH')
    .setRequired(true);

  modal.addComponents(
    new MessageActionRow<ModalActionRowComponent>().addComponents(firstField),
    new MessageActionRow<ModalActionRowComponent>().addComponents(secondField),
    new MessageActionRow<ModalActionRowComponent>().addComponents(thirdField),
  );

  return modal;
};
