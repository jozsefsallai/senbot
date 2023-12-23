import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import { EMBED_LIGHT_BLUE } from '../../core/constants';

import { CommandContext } from '../../core/handler/CommandHandler';
import { error, warn } from '../../utils/serviceMessages';

export const meta = new SlashCommandBuilder()
  .setName('sauce')
  .setDescription('Find the source of an image.')
  .addStringOption((option) =>
    option.setName('url').setDescription('The URL of the image.'),
  )
  .addAttachmentOption((option) =>
    option.setName('image').setDescription('The image to find the source of.'),
  )
  .setDefaultPermission(true);

export const handler = async (
  ctx: CommandContext<ChatInputCommandInteraction>,
) => {
  await ctx.interaction.deferReply();

  if (!ctx.client.sagiri) {
    const errorEmbed = error('The bot is not configured for this command.');
    await ctx.interaction.editReply({
      embeds: [errorEmbed],
    });
    return;
  }

  const url = ctx.interaction.options.getString('url');
  const image = ctx.interaction.options.getAttachment('image');

  if (!url && !image) {
    const errorEmbed = error('You must specify either a URL or an image.');
    await ctx.interaction.editReply({
      embeds: [errorEmbed],
    });
    return;
  }

  let item: string | Buffer | undefined;

  if (url) {
    item = url;
  }

  if (image) {
    item = image.url;
  }

  if (!item) {
    const errorEmbed = error('Your request is invalid.');
    await ctx.interaction.editReply({
      embeds: [errorEmbed],
    });
    return;
  }

  const sources = await ctx.client.sagiri(item);

  if (!sources) {
    const errorEmbed = warn('No source found.');
    await ctx.interaction.editReply({
      embeds: [errorEmbed],
    });
    return;
  }

  const sauce = sources[0];

  const embed = new EmbedBuilder();
  embed.setColor(EMBED_LIGHT_BLUE);
  embed.setTitle('Source found!');
  embed.setURL(sauce.url);
  embed.setThumbnail(sauce.thumbnail);

  if (sauce.authorName) {
    if (sauce.authorUrl) {
      embed.addFields({
        name: 'Author',
        value: `[${sauce.authorName}](${sauce.authorUrl})`,
        inline: true,
      });
    } else {
      embed.addFields({
        name: 'Author',
        value: sauce.authorName || 'unknown',
        inline: true,
      });
    }
  }

  if (sauce.similarity) {
    embed.addFields({
      name: 'Similarity',
      value: `${sauce.similarity}%`,
      inline: true,
    });
  }

  if (sauce.site) {
    embed.addFields({
      name: 'Site',
      value: sauce.site || 'unknown',
      inline: true,
    });
  }

  embed.addFields({ name: 'URL', value: sauce.url || 'unknown' });

  await ctx.interaction.editReply({
    embeds: [embed],
  });
};
