import { Message, EmbedBuilder, PartialMessage } from 'discord.js';
import Client from '../core/client';
import { EMBED_LIGHT_BLUE } from '../core/constants';
import analyzeMessage from '../utils/analyzeMessage';
import { addLongEmbedField } from '../utils/embedFields';

export type MessageLike = Message<boolean> | PartialMessage;

const handler = async (
  client: Client,
  before: MessageLike,
  after: MessageLike,
) => {
  if (before.author?.bot) {
    return;
  }

  if (before.content === after.content) {
    return;
  }

  const { id, username, discriminator } = before.author!;

  const embed = new EmbedBuilder();
  embed.setTitle('Message Edit Log');
  embed.setColor(EMBED_LIGHT_BLUE);
  embed.setTimestamp();
  embed.setURL(before.url);
  embed.addFields({ name: 'Channel', value: before.channel.toString() });
  embed.addFields({
    name: 'User',
    value: `${username}#${discriminator} (${id})`,
  });
  addLongEmbedField(embed, 'Before', before.content || '(empty message)');
  addLongEmbedField(embed, 'After', after.content || '(empty message)');

  await client.logger?.logEvent({ embeds: [embed] });

  await analyzeMessage(client, after);
};

export default handler;
