import { Message, MessageEmbed, PartialMessage } from 'discord.js';
import Client from '../core/client';
import { EMBED_LIGHT_BLUE } from '../core/constants';
import { addLongEmbedField } from '../utils/embedFields';

type MessageLike = Message<boolean> | PartialMessage;

const handler = async (
  client: Client,
  before: MessageLike,
  after: MessageLike,
) => {
  if (before.content === after.content) {
    return;
  }

  const { id, username, discriminator } = before.author!;

  const embed = new MessageEmbed();
  embed.setTitle('Message Edit Log');
  embed.setColor(EMBED_LIGHT_BLUE);
  embed.setTimestamp();
  embed.setURL(before.url);
  embed.addField('Channel', before.channel.toString());
  embed.addField('User', `${username}#${discriminator} (${id})`);
  addLongEmbedField(embed, 'Before', before.content);
  addLongEmbedField(embed, 'After', after.content);

  await client.logger?.logEvent({ embeds: [embed] });
};

export default handler;
