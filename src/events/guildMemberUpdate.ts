import { GuildMember, EmbedBuilder, PartialGuildMember } from 'discord.js';
import Client from '../core/client';
import { EMBED_LIGHT_BLUE } from '../core/constants';

export type MemberLike = GuildMember | PartialGuildMember;

const handler = async (
  client: Client,
  before: MemberLike,
  after: MemberLike,
) => {
  if (before.nickname !== after.nickname) {
    const { id, username, discriminator } = before.user;
    const [previousName, newName] = [before.nickname, after.nickname];

    const embed = new EmbedBuilder();
    embed.setTitle('Nickname Change Log');
    embed.setColor(EMBED_LIGHT_BLUE);
    embed.setTimestamp();
    embed.addFields({
      name: 'User',
      value: `${username}#${discriminator} (${id})`,
      inline: true,
    });
    embed.addFields({
      name: 'Previous Nickname',
      value: previousName ?? username,
    });
    embed.addFields({ name: 'New Nickname', value: newName ?? username });

    await client.logger?.logEvent({ embeds: [embed] });
  }
};

export default handler;
