import { EmbedBuilder } from 'discord.js';
import { GatewayError } from 'node-nakiri/lib/common/errors';
import Client from '../../core/client';
import { EMBED_RED } from '../../core/constants';

const handler = async (client: Client, error: GatewayError) => {
  const embed = new EmbedBuilder();

  embed.setTitle('Nakiri Error');
  embed.setColor(EMBED_RED);
  embed.setTimestamp();
  embed.addFields({ name: 'Error', value: `${error}` });

  client.logger?.logEvent({ embeds: [embed] });
  client.reportToSentry(error);
};

export default handler;
