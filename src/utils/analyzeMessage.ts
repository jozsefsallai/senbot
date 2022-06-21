import { Message, PartialMessage } from 'discord.js';
import config from '../config';
import Client from '../core/client';

const analyzeMessage = async (
  client: Client,
  message: Message | PartialMessage,
) => {
  if (!message.content) {
    return;
  }

  const exceptionChannels = config.nakiri?.analysisExceptionChannels ?? [];
  if (exceptionChannels.includes(message.channelId)) {
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
    options: {
      analyzePhrases: false,
    },
  });
};

export default analyzeMessage;
