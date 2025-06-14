import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AttachmentBuilder,
  SendableChannels,
} from 'discord.js';
import { CommandContext } from '../../core/handler/CommandHandler';
import { buildCollage } from '../../utils/collage';
import { preprocessImages } from '../../utils/images';

const IMAGE_WIDTH = 512;
const IMAGE_HEIGHT = 512;
const IMAGE_COUNT = 4;

export const meta = new SlashCommandBuilder()
  .setName('stablediffusion')
  .setDescription(
    'AI-generate an image using Stable Diffusion (powered by Stable Horde).',
  )
  .addStringOption((option) =>
    option
      .setName('prompt')
      .setDescription('The prompt of the image.')
      .setRequired(true),
  )
  .addNumberOption((option) =>
    option
      .setName('c')
      .setDescription('Config scale (7.5 - 15, default: 7.5).')
      .setRequired(false)
      .setMinValue(7.5)
      .setMaxValue(15.0),
  )
  .setDefaultPermission(true);

export const handler = async (
  ctx: CommandContext<ChatInputCommandInteraction>,
) => {
  if (!ctx.client.stablehorde) {
    await ctx.interaction.reply(
      'Stable Diffusion image generation is not available on this instance of senbot.',
    );

    return;
  }

  if (!ctx.interaction.channel || !ctx.interaction.channel.isSendable()) {
    await ctx.interaction.editReply({
      content: 'This channel is not sendable. Please try another channel.',
    });
    return;
  }

  await ctx.interaction.reply(
    'Please wait a minute or two while we generate your image!',
  );

  const prompt = ctx.interaction.options.getString('prompt');
  const C = ctx.interaction.options.getNumber('c') || 7.5;

  const request = ctx.client.stablehorde.newRequestHandler(2000);

  request.on('error', async (err) => {
    await (ctx.interaction.channel as SendableChannels).send({
      content: `${ctx.interaction.user} Something went wrong while trying to generate your image. Prompt was: \`${prompt}\``,
    });

    ctx.client.reportToSentry(err);
  });

  request.on('finished', async (generations) => {
    const buffers = generations.buffers();
    const images = await preprocessImages(buffers, IMAGE_WIDTH, IMAGE_HEIGHT);
    const collage = await buildCollage(
      images,
      IMAGE_COUNT / 2,
      IMAGE_COUNT / 2,
      IMAGE_WIDTH,
      IMAGE_HEIGHT,
      10,
      '#111827',
    );

    const buffer = collage.toBuffer("image/png");

    const workers = generations.generations.map((g) => g.workerName);

    const message = `${
      ctx.interaction.user
    } **Here's the images for prompt:** \`${prompt}\`\n*Generated by: ${workers.join(
      ', ',
    )}*`;
    const attachment = new AttachmentBuilder(buffer, {
      name: 'stablediffusion.png',
    });

    await (ctx.interaction.channel as SendableChannels).send({
      content: message,
      files: [attachment],
    });
  });

  request.generate(prompt!, {
    cfgScale: C,
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    n: IMAGE_COUNT,
    steps: 24,
  });
};
