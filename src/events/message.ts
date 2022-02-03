import { Message, PartialMessage } from 'discord.js';
import Client from '../core/client';

const handler = async (client: Client, message: Message | PartialMessage) => {
  if (!message.content) {
    return;
  }

  client.nakiri?.analyze({
    content: message.content,
    messageContext: {
      guildId: message.guild?.id,
      channelId: message.channel.id,
      messageId: message.id,
      userId: message.author?.id,
    },
  });
};

export default handler;
