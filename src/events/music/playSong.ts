import { MessageEmbed, EmbedField } from 'discord.js';
import { Queue, Song } from 'distube';
import queueInfo from './lib/queueInfo';

const onPlaySong = async (queue: Queue, song: Song) => {
  const embed = new MessageEmbed();
  embed.setTitle(':musical_note: Now Playing');
  embed.setURL(song.url);
  embed.setDescription(`[${song.name}](${song.url})`);
  embed.setColor(0xff8dbf);

  if (song.thumbnail) {
    embed.setThumbnail(song.thumbnail);
  }

  const fields: EmbedField[] = [];

  fields.push({
    name: 'Requested By',
    value: song.member?.toString() ?? 'Unknown',
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

export default onPlaySong;
