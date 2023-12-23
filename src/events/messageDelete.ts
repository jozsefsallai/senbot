import {
  Message,
  AttachmentBuilder,
  EmbedBuilder,
  PartialMessage,
} from 'discord.js';
import fetch from 'node-fetch';
import Client from '../core/client';
import { EMBED_RED } from '../core/constants';
import { arrayBufferToBuffer } from '../utils/arrayBufferToBuffer';
import { addLongEmbedField } from '../utils/embedFields';

const handler = async (
  client: Client,
  message: Message<boolean> | PartialMessage,
) => {
  if (message.author?.bot) {
    return;
  }

  const { id, username, discriminator } = message.author!;

  const embed = new EmbedBuilder();
  embed.setTitle('Message Delete Log');
  embed.setColor(EMBED_RED);
  embed.setTimestamp();
  embed.addFields({ name: 'Channel', value: message.channel.toString() });
  embed.addFields({
    name: 'User',
    value: `${username}#${discriminator} (${id})`,
  });
  addLongEmbedField(embed, 'Message', message.content || '(empty message)');

  if (message.attachments.size > 0) {
    try {
      const files: AttachmentBuilder[] = [];

      for await (const attachment of message.attachments.values()) {
        const res = await fetch(attachment.url);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = arrayBufferToBuffer(arrayBuffer);

        const file = new AttachmentBuilder(buffer, {
          name: attachment.name || 'attachment',
        });
        files.push(file);
      }

      await client.logger?.logEvent({
        embeds: [embed],
        files: files,
      });

      return;
    } catch (err) {
      client.reportToSentry(err);

      embed.addFields({
        name: 'Attachment Upload Failure',
        value: "This message had attachments, but I couldn't upload them...",
      });
    }
  }

  await client.logger?.logEvent({ embeds: [embed] });
};

export default handler;
