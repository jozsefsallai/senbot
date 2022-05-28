import config from '../config';
import Client from '../core/client';

const handler = async (client: Client) => {
  client.setPlayingStatus(config.bot.activity);
};

export default handler;
