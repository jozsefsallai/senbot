import { MessageEmbed, TextChannel } from 'discord.js';
import config from '../config';
import Client from '../core/client';

export interface EditOnboardingEntryOpts {
  client: Client;
  messageId: string;
  status?: string;
  removeButtons?: boolean;
}

export const editOnboardingEntry = async ({
  client,
  messageId,
  status = 'COMPLETE',
  removeButtons = true,
}: EditOnboardingEntryOpts) => {
  const channel = await client.getChannelWithId(
    config.guild.membershipReviewChannelId,
  );
  if (!channel) {
    return;
  }

  const message = await (channel as TextChannel).messages.fetch(messageId);
  if (!message) {
    return;
  }

  const embeds = message.embeds.slice(0);

  let embed: MessageEmbed | undefined;

  if (embeds.length > 0) {
    embed = embeds[0];

    const fields = embed.fields.slice(0);

    if (fields.length > 0) {
      fields[0].value = status;
    }

    embed.setFields(fields);
  }

  const newEmbeds: MessageEmbed[] = [];
  if (embed) {
    newEmbeds.push(embed);
  }

  const components = removeButtons ? [] : message.components.slice(0);

  await message.edit({
    embeds: newEmbeds,
    components,
  });
};
