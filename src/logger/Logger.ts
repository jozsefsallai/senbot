import {
  Client,
  GuildMember,
  Message,
  EmbedBuilder,
  MessageCreateOptions,
  MessagePayload,
  PartialGuildMember,
  TextChannel,
} from 'discord.js';
import config from '../config';
import { EMBED_GREEN, EMBED_RED } from '../core/constants';

class Logger {
  private client: Client;

  private logChannel?: TextChannel;
  private joinChannel?: TextChannel;

  constructor(client: Client) {
    this.client = client;
  }

  private async bootstrap() {
    if (config.guild.logChannelId) {
      this.logChannel = (await this.client.channels.fetch(
        config.guild.logChannelId,
      )) as TextChannel;
    }

    if (config.guild.joinChannelId) {
      this.joinChannel = (await this.client.channels.fetch(
        config.guild.joinChannelId,
      )) as TextChannel;
    }
  }

  async logEvent(
    opts: string | MessagePayload | MessageCreateOptions,
  ): Promise<Message<boolean> | undefined> {
    await this.bootstrap();

    if (!this.logChannel) {
      return;
    }

    return this.logChannel.send(opts);
  }

  async logJoinOrLeave(
    type: 'join' | 'leave',
    member: GuildMember | PartialGuildMember,
  ): Promise<Message<boolean> | undefined> {
    await this.bootstrap();

    if (!this.joinChannel && !this.logChannel) {
      return;
    }

    const avatar = member.user.avatarURL() ?? member.user.defaultAvatarURL;

    const embed = new EmbedBuilder();

    embed.setTitle(type === 'join' ? 'Member Joined' : 'Member Left');
    embed.setColor(type === 'join' ? EMBED_GREEN : EMBED_RED);
    embed.setDescription(
      `${member.user.tag} (${member.user.username}#${member.user.discriminator})`,
    );
    embed.setTimestamp();
    embed.setAuthor({
      name: this.client.user!.username,
      iconURL:
        this.client.user!.avatarURL() ?? this.client.user!.defaultAvatarURL,
    });
    embed.setThumbnail(avatar);
    embed.setFooter({ text: `ID: ${member.id}` });

    if (this.joinChannel) {
      await this.joinChannel.send({ embeds: [embed] });
    }

    if (!this.logChannel) {
      return;
    }

    embed.addFields({
      name: 'Created at',
      value: member.user.createdAt.toISOString(),
    });
    return this.logEvent({ embeds: [embed] });
  }
}

export default Logger;
