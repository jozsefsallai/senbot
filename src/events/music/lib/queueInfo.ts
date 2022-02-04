import { EmbedField } from 'discord.js';
import { Queue } from 'distube';

const getQueueInfo = (queue: Queue): EmbedField[] => {
  const fields: EmbedField[] = [];

  fields.push({
    name: 'Volume',
    value: `${queue.volume}%`,
    inline: true,
  });

  fields.push({
    name: 'Filter',
    value: queue.filters.length > 0 ? queue.filters.join(', ') : 'Off',
    inline: true,
  });

  const loop = queue.repeatMode
    ? queue.repeatMode === 2
      ? 'All'
      : 'Current Song'
    : 'Off';

  fields.push({
    name: 'Loop',
    value: loop,
    inline: true,
  });

  fields.push({
    name: 'Autoplay',
    value: queue.autoplay ? 'On' : 'Off',
    inline: true,
  });

  return fields;
};

export default getQueueInfo;
