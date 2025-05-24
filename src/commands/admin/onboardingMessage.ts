import {
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from 'discord.js';

import { CommandContext } from '../../core/handler/CommandHandler';

export const meta = new SlashCommandBuilder()
  .setName('onboardingmessage')
  .setDescription('Send the onboarding message in the current channel.')
  .setDefaultPermission(false);

export { permissions } from '../../guards/staffOnlyCommand';

export const handler = async (
  ctx: CommandContext<ChatInputCommandInteraction>,
) => {
  await ctx.interaction.deferReply({ ephemeral: true });

  try {
    const button = new ButtonBuilder();
    button
      .setCustomId('onboarding')
      .setLabel('Answer questions')
      .setStyle(ButtonStyle.Primary);

    const componentRow = new ActionRowBuilder<ButtonBuilder>();
    componentRow.addComponents(button);

    const embed = new EmbedBuilder();
    embed.setTitle('Welcome to the Senzawa Fan Discord!');
    embed.setDescription(
      [
        'Before gaining access to the rest of the server, we require our ',
        'members to read the rules and answer 3 questions. You can start the ',
        'onboarding process by clicking on the button below. If the button ',
        "doesn't work, or the form results in an error, please send a DM to a ",
        'moderator.',
      ].join(''),
    );
    embed.setColor('#0099ff');

    if (ctx.interaction.channel?.isSendable()) {
      await ctx.interaction.channel.send({
        embeds: [embed],
        components: [componentRow],
      });
    }

    await ctx.interaction.editReply('Onboarding message sent successfully.');
  } catch (err) {
    ctx.client.reportToSentry(err);
    await ctx.interaction.editReply(
      `Failed to send onboarding message:\n\`\`\`\n${err}\n\`\`\``,
    );
  }
};
