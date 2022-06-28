import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import config from '../../config';
import { EMBED_LIGHT_BLUE } from '../../core/constants';

import { CommandContext } from '../../core/handler/CommandHandler';
import Danbooru from '../../utils/danbooru';
import { error, warn } from '../../utils/serviceMessages';

export const meta = new SlashCommandBuilder()
  .setName('neko')
  .setDescription('Request a catgirl image.')
  .addBooleanOption((option) =>
    option
      .setName('plain')
      .setDescription('Send the image without additional information.')
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName('tags')
      .setDescription(
        'Additional Danbooru tags (up to 3, separated by spaces).',
      )
      .setRequired(false),
  )
  .setDefaultPermission(true);

export const handler = async (ctx: CommandContext<CommandInteraction>) => {
  await ctx.interaction.deferReply();

  const plain = ctx.interaction.options.getBoolean('plain') ?? false;
  const additionalTags = ctx.interaction.options.getString('tags');

  if (!config.danbooru) {
    const errorEmbed = error('The bot is not configured for this command.');
    await ctx.interaction.editReply({
      embeds: [errorEmbed],
    });
    return;
  }

  if (additionalTags && additionalTags.split(' ').length > 3) {
    const errorEmbed = error('You can only specify up to 3 additional tags.');
    await ctx.interaction.editReply({
      embeds: [errorEmbed],
    });
    return;
  }

  try {
    const danbooru = new Danbooru(
      config.danbooru.apiKey,
      config.danbooru.username,
    )
      .tags(['cat_ears'])
      .tags(['video', 'animated'], true)
      .tags(additionalTags?.split(' ') ?? [])
      .rating('general')
      .favcount(10, '>')
      .random();

    const images = await danbooru.get();

    if (!images.length) {
      const warningEmbed = warn('No images found.');
      await ctx.interaction.editReply({
        embeds: [warningEmbed],
      });
      return;
    }

    const image = images[0];

    const embed = new MessageEmbed();

    embed.setTitle("Here's a catgirl for you:");

    if (!plain) {
      embed.addField('Tags', Danbooru.humanReadableTags(image.tag_string));
      embed.addField('Score', image.score.toString(), true);
      embed.addField('Favorite count', image.fav_count.toString(), true);

      if (image.source) {
        embed.addField('Source', image.source);
      }
    }

    embed.setColor(EMBED_LIGHT_BLUE);
    embed.setImage(image.file_url);

    await ctx.interaction.editReply({
      embeds: [embed],
    });
  } catch (err) {
    ctx.client.reportToSentry(err);

    const errorEmbed = error('Failed to fetch a catgirl for you :(');
    await ctx.interaction.editReply({
      embeds: [errorEmbed],
    });
  }
};
