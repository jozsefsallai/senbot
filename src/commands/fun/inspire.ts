import { SlashCommandBuilder } from '@discordjs/builders';
import axios from 'axios';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { EMBED_LIGHT_BLUE } from '../../core/constants';

import { CommandContext } from '../../core/handler/CommandHandler';
import { error } from '../../utils/serviceMessages';

export const meta = new SlashCommandBuilder()
  .setName('inspire')
  .setDescription('Send a totally inspirational image.')
  .setDefaultPermission(true);

export const handler = async (ctx: CommandContext<CommandInteraction>) => {
  await ctx.interaction.deferReply();

  try {
    const response = await axios.get('https://inspirobot.me/api?generate=true');
    let url = response.data;

    if (!url) {
      throw new Error('Internal server error.');
    }

    if (ctx.client.s3) {
      const imageResponse = await axios.get(url, {
        responseType: 'arraybuffer',
      });

      const image = Buffer.from(imageResponse.data, 'binary');
      const filename = url.split('/').pop();

      await ctx.client.s3.upload(`inspire/${filename}`, image);

      url = ctx.client.s3.buildUrl(`inspire/${filename}`);
    }

    const embed = new MessageEmbed();
    embed.setTitle("Here's an AI generated inspirational quote:");
    embed.setColor(EMBED_LIGHT_BLUE);
    embed.setImage(url);

    await ctx.interaction.editReply({
      embeds: [embed],
    });
  } catch (err) {
    ctx.client.reportToSentry(err);

    const errorEmbed = error('Something bad happened.');
    await ctx.interaction.editReply({
      embeds: [errorEmbed],
    });
  }
};
