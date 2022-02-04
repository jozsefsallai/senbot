import { Message } from 'discord.js';
import { success } from '../../utils/serviceMessages';

const onSearchCancel = async (message: Message) =>
  await message.channel.send({
    embeds: [success('Cancelled successfully!')],
  });

export default onSearchCancel;
