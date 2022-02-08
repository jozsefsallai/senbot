import { MessageEmbed } from 'discord.js';
import { AnalysisNotification } from 'node-nakiri';
import Client from '../../core/client';
import { EMBED_RED } from '../../core/constants';
import { addLongEmbedField } from '../../utils/embedFields';

const handler = async (client: Client, data: AnalysisNotification) => {
  if (!data.results.problematic) {
    return;
  }

  const {
    results: {
      problematicChannelIDs,
      problematicDiscordInvites,
      problematicLinks,
      problematicPhrases,
      problematicVideoIDs,
      maxPhraseSimilarity,
    },
    messageContext,
  } = data;

  if (!messageContext) {
    return;
  }

  const { channelId, messageId } = messageContext;
  if (!channelId || !messageId) {
    return;
  }

  const message = await client.getMessage(channelId, messageId);

  if (!message) {
    return;
  }

  const { username, discriminator, id } = message.author!;

  const embed = new MessageEmbed();

  embed.setTitle('Positive Nakiri Analysis');
  embed.setColor(EMBED_RED);
  embed.setTimestamp();
  embed.addField('Channel', message.channel.toString());
  embed.addField('User', `${username}#${discriminator} (${id})`);
  addLongEmbedField(embed, 'Message', message.content);

  let shouldDelete = false;

  if (problematicVideoIDs.length > 0) {
    embed.addField('Filtered YouTube Videos', problematicVideoIDs.join(', '));
  }

  if (problematicChannelIDs.length > 0) {
    embed.addField(
      'Filtered YouTube Channels',
      problematicChannelIDs.join(', '),
    );
  }

  if (problematicDiscordInvites.length > 0) {
    embed.addField(
      'Filtered Discord Invites',
      problematicDiscordInvites.join(', '),
    );
  }

  if (problematicLinks.length > 0) {
    embed.addField('Filtered URLs', problematicLinks.join(', '));
  }

  if (problematicPhrases.length > 0) {
    const phrases = problematicPhrases
      .sort((a, b) => b.severity - a.severity)
      .map((similarityMap) => {
        return `${similarityMap.phrase} (${similarityMap.similarity * 100}%)`;
      })
      .join('\n');

    if (maxPhraseSimilarity && maxPhraseSimilarity >= 0.75) {
      embed.addField('Matched and Filtered Phrases', phrases);
      shouldDelete = true;
    } else {
      embed.addField('Matched Phrases', phrases);
    }
  }

  shouldDelete ||=
    !!problematicVideoIDs.length ||
    !!problematicChannelIDs.length ||
    !!problematicDiscordInvites.length ||
    !!problematicLinks.length;

  if (shouldDelete) {
    await message.delete();
  }

  await client.logger?.logEvent({ embeds: [embed] });
};

export default handler;
