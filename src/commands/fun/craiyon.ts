import {
  ChatInputCommandInteraction,
  AttachmentBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { CommandContext } from '../../core/handler/CommandHandler';

export const meta = new SlashCommandBuilder()
  .setName('craiyon')
  .setDescription('AI-generate an image using Craiyon.')
  .addStringOption((option) =>
    option
      .setName('prompt')
      .setDescription('The prompt of the image.')
      .setRequired(true),
  )
  .setDefaultPermission(true);

export const handler = async (
  ctx: CommandContext<ChatInputCommandInteraction>,
) => {
  await ctx.interaction.reply(
    'Please wait a minute or two while Craiyon generates your image!',
  );

  const prompt = ctx.interaction.options.getString('prompt');

  try {
    const buffer = await ctx.client.craiyon.generate(prompt!);

    const message = `${ctx.interaction.user} **Here's the image for prompt:** \`${prompt}\``;
    const attachment = new AttachmentBuilder(buffer, {
      name: 'craiyon.png',
    });

    await ctx.interaction.channel!.send({
      files: [attachment],
      content: message,
    });
  } catch (err) {
    ctx.client.reportToSentry(err);

    await ctx.interaction.channel!.send({
      content: `${ctx.interaction.user} Something went wrong while trying to generate your image. Prompt was: \`${prompt}\``,
    });
  }
};
