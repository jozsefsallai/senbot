import { MessageEmbed, EmbedField } from 'discord.js';
import { Queue, Song } from 'distube';
import queueInfo from './lib/queueInfo';

const onAddSong = async (queue: Queue, song: Song) => {
  const embed = new MessageEmbed();
  embed.setTitle(':white_check_mark: Added Song');
  embed.setURL(song.url);
  embed.setDescription(`[${song.name}](${song.url})`);
  embed.setColor(0xff8dbf);

  if (song.thumbnail) {
    embed.setThumbnail(song.thumbnail);
  }

  const fields: EmbedField[] = [];

  fields.push({
    name: 'Added By',
    value: song.user?.toString() ?? 'Unknown',
    inline: true,
  });

  fields.push({
    name: 'Duration',
    value: song.formattedDuration ?? 'Unknown',
    inline: true,
  });

  fields.push(...queueInfo(queue));

  embed.addFields(fields);

  await queue.textChannel?.send({
    embeds: [embed],
  });
};

export default onAddSong;
