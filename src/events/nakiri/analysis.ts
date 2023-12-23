import { EmbedBuilder } from 'discord.js';
import { AnalysisNotification } from 'node-nakiri';
import Client from '../../core/client';
import { EMBED_RED } from '../../core/constants';
import { addLongEmbedField } from '../../utils/embedFields';

import * as path from 'path';
import * as fs from 'fs';
import { binarySearch } from '../../utils/binarySearch';

const DICTIONARY_PATH = path.join(
  __dirname,
  '../../..',
  'assets',
  'words_alpha.txt',
);
const dictionary = fs
  .readFileSync(DICTIONARY_PATH, 'utf8')
  .split('\n')
  .filter((e) => e.length > 0);

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

  const embed = new EmbedBuilder();

  embed.setTitle('Positive Nakiri Analysis');
  embed.setColor(EMBED_RED);
  embed.setTimestamp();
  embed.addFields({ name: 'Channel', value: message.channel.toString() });
  embed.addFields({
    name: 'User',
    value: `${username}#${discriminator} (${id})`,
  });
  addLongEmbedField(embed, 'Message', message.content || '(empty message)');

  let shouldDelete = false;

  if (problematicVideoIDs.length > 0) {
    embed.addFields({
      name: 'Filtered YouTube Videos',
      value: problematicVideoIDs.join(', '),
    });
  }

  if (problematicChannelIDs.length > 0) {
    embed.addFields({
      name: 'Filtered YouTube Channels',
      value: problematicChannelIDs.join(', '),
    });
  }

  if (problematicDiscordInvites.length > 0) {
    embed.addFields({
      name: 'Filtered Discord Invites',
      value: problematicDiscordInvites.join(', '),
    });
  }

  if (problematicLinks.length > 0) {
    embed.addFields({
      name: 'Filtered URLs',
      value: problematicLinks.join(', '),
    });
  }

  if (problematicPhrases.length > 0) {
    const phrases = problematicPhrases
      .sort((a, b) => b.severity - a.severity)
      .map((similarityMap) => {
        return `${similarityMap.phrase} (${similarityMap.word} ${
          similarityMap.similarity * 100
        }%)`;
      })
      .join('\n');

    if (maxPhraseSimilarity && maxPhraseSimilarity >= 0.5) {
      const maxPhrase = problematicPhrases.find(
        (e) => e.similarity === maxPhraseSimilarity,
      );
      embed.addFields({ name: 'Matched and Filtered Phrases', value: phrases });
      shouldDelete =
        !!maxPhrase && !binarySearch(dictionary, maxPhrase.word.toLowerCase());
    } else {
      embed.addFields({ name: 'Matched Phrases', value: phrases });
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
