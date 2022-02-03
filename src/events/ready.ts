import Client from '../core/client';

const handler = async (client: Client) => {
  client.setPlayingStatus('with bubbles in a bath');
};

export default handler;
