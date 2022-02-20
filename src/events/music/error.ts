import { GuildTextBasedChannel } from 'discord.js';
import Client from '../../core/client';
import { error } from '../../utils/serviceMessages';

const onMusicError = async (
  client: Client,
  channel: GuildTextBasedChannel,
  err: Error,
) => {
  const contents = error(`Error: ${err}`);
  await channel.send({
    embeds: [contents],
  });
  client.reportToSentry(err);
};

export default onMusicError;
