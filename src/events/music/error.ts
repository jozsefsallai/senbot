import { GuildTextBasedChannel } from 'discord.js';
import { error } from '../../utils/serviceMessages';

const onMusicError = async (channel: GuildTextBasedChannel, err: Error) => {
  const contents = error(`Error: ${err}`);
  await channel.send({
    embeds: [contents],
  });
};

export default onMusicError;
