import { Message, PartialMessage } from 'discord.js';
import Client from '../core/client';
import analyzeMessage from '../utils/analyzeMessage';

const handler = async (client: Client, message: Message | PartialMessage) => {
  await analyzeMessage(client, message);
};

export default handler;
