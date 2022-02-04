import { Message, MessageEmbed } from 'discord.js';
import { SearchResult } from 'distube';

const onSearchResult = async (message: Message, songs: SearchResult[]) => {
  const results = songs
    .map((song, idx) => {
      return `${idx + 1}. [${song.name}](${song.url}) (\`${
        song.formattedDuration
      }\`)`;
    })
    .join('\n');

  const embed = new MessageEmbed();
  embed.setTitle('Choose an option from below');
  embed.setDescription(results);
  embed.setColor(0xff8dbf);
  embed.setFooter({
    text: 'Enter anything else or wait 60 seconds to cancel.',
  });

  await message.channel.send({
    embeds: [embed],
  });
};

export default onSearchResult;
