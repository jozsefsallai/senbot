import {
  Message,
  MessageAttachment,
  MessageEmbed,
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

  const embed = new MessageEmbed();
  embed.setTitle('Message Delete Log');
  embed.setColor(EMBED_RED);
  embed.setTimestamp();
  embed.addField('Channel', message.channel.toString());
  embed.addField('User', `${username}#${discriminator} (${id})`);
  addLongEmbedField(embed, 'Message', message.content);

  if (message.attachments.size > 0) {
    try {
      const files: MessageAttachment[] = [];

      for await (const attachment of message.attachments.values()) {
        const res = await fetch(attachment.url);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = arrayBufferToBuffer(arrayBuffer);

        const file = new MessageAttachment(
          buffer,
          attachment.name || 'attachment',
        );
        files.push(file);
      }

      await client.logger?.logEvent({
        embeds: [embed],
        files: files,
      });

      return;
    } catch (err) {
      client.reportToSentry(err);

      embed.addField(
        'Attachment Upload Failure',
        "This message had attachments, but I couldn't upload them...",
      );
    }
  }

  await client.logger?.logEvent({ embeds: [embed] });
};

export default handler;
