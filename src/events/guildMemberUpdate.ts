import { GuildMember, MessageEmbed, PartialGuildMember } from 'discord.js';
import Client from '../core/client';
import { EMBED_LIGHT_BLUE } from '../core/constants';

type MemberLike = GuildMember | PartialGuildMember;

const handler = async (
  client: Client,
  before: MemberLike,
  after: MemberLike,
) => {
  if (before.nickname !== after.nickname) {
    const { id, username, discriminator } = before.user;
    const [previousName, newName] = [before.nickname, after.nickname];

    const embed = new MessageEmbed();
    embed.setTitle('Nickname Change Log');
    embed.setColor(EMBED_LIGHT_BLUE);
    embed.setTimestamp();
    embed.addField('User', `${username}#${discriminator} (${id})`, true);
    embed.addField('Previous Nickname', previousName ?? username);
    embed.addField('New Nickname', newName ?? username);

    await client.logger?.logEvent({ embeds: [embed] });
  }
};

export default handler;
