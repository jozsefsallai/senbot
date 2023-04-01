import { Message, PartialMessage } from 'discord.js';
import Client from '../core/client';
import analyzeMessage from '../utils/analyzeMessage';

const handler = async (client: Client, message: Message | PartialMessage) => {
  try {
    const emotes = await message.guild?.emojis.fetch();
    if (!emotes) {
      return;
    }

    const probability = message.content?.includes('uwu')
      ? 1
      : 1 - Math.random();
    if (probability >= 0.95) {
      const count = probability >= 0.99 ? 3 : 1;
      const reactions = emotes.random(count);

      const promises = [reactions.map((e) => message.react(e))];
      await Promise.all(promises);
    }
  } catch (err) {
    // rip
  }

  await analyzeMessage(client, message);
};

export default handler;
