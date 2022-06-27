import config from '../config';

import {
  AnyChannel,
  Client as Discord,
  GuildMember,
  Intents,
  Message,
  TextChannel,
} from 'discord.js';
import { REST } from '@discordjs/rest';

import DisTube from 'distube';

import { Client as Nakiri } from 'node-nakiri';

import CommandHandler from './handler/CommandHandler';
import ButtonHandler from './handler/ButtonHandler';
import ModalHandler from './handler/ModalHandler';

import commands from '../commands';
import buttons from '../buttons';
import modals from '../modals';

import Logger from '../logger/Logger';

import onMessageUpdate, { MessageLike } from '../events/messageUpdate';
import onMessageDelete from '../events/messageDelete';
import onGuildMemberUpdate, { MemberLike } from '../events/guildMemberUpdate';
import onMessage from '../events/message';
import onReady from '../events/ready';

import onNakiriAnalysis from '../events/nakiri/analysis';
import onNakiriError from '../events/nakiri/error';

// import onPlaySong from '../events/music/playSong';
// import onAddSong from '../events/music/addSong';
// import onMusicError from '../events/music/error';
// import onSearchResult from '../events/music/searchResult';
// import onSearchCancel from '../events/music/searchCancel';

import * as Sentry from '@sentry/node';
import { Routes } from 'discord-api-types/v10';

class Client {
  private client: Discord;
  private rest: REST;

  private commandHandler: CommandHandler;
  private buttonHandler: ButtonHandler;
  private modalHandler: ModalHandler;

  public nakiri?: Nakiri;
  public distube: DisTube;

  public logger?: Logger;

  constructor() {
    this.client = new Discord({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
      ],
    });

    this.distube = new DisTube(this.client, {
      searchSongs: 1,
      emitNewSongOnly: true,
      leaveOnFinish: true,
    });

    // this.distube.on('playSong', onPlaySong);
    // this.distube.on('addSong', onAddSong);
    // this.distube.on('error', (channel, error) =>
    //   onMusicError(this, channel, error),
    // );
    // this.distube.on('searchResult', onSearchResult);
    // this.distube.on('searchCancel', onSearchCancel);

    this.logger = new Logger(this.client);

    this.rest = new REST({
      version: '9',
    });

    this.rest.setToken(config.bot.token);

    this.commandHandler = new CommandHandler();
    this.buttonHandler = new ButtonHandler();
    this.modalHandler = new ModalHandler();

    this.client.on('interactionCreate', async (interaction) => {
      if (interaction.isCommand() || interaction.isContextMenu()) {
        await this.commandHandler.emit(interaction.commandName, {
          interaction,
          client: this,
        });
      }

      if (interaction.isButton() || interaction.isModalSubmit()) {
        const idComponents = interaction.customId.split('_');
        const id = idComponents[0];
        const uniqueId =
          idComponents.length > 1 ? idComponents.slice(1).join('_') : undefined;

        if (interaction.isButton()) {
          await this.buttonHandler.emit(id, {
            interaction,
            client: this,
            uniqueId,
          });
        }

        if (interaction.isModalSubmit()) {
          await this.modalHandler.emit(id, {
            interaction,
            client: this,
            uniqueId,
          });
        }
      }
    });

    this.client.on('messageUpdate', (before, after) =>
      onMessageUpdate(this, before as MessageLike, after as MessageLike),
    );

    this.client.on('messageDelete', (message) =>
      onMessageDelete(this, message),
    );

    this.client.on('guildMemberUpdate', (before, after) =>
      onGuildMemberUpdate(this, before as MemberLike, after as MemberLike),
    );

    this.client.on('guildMemberAdd', async (member) => {
      await this.logger?.logJoinOrLeave('join', member);
    });

    this.client.on('guildMemberRemove', async (member) => {
      await this.logger?.logJoinOrLeave('leave', member);
    });

    this.client.on('messageCreate', (message) => onMessage(this, message));

    this.client.on('error', this.reportToSentry.bind(this));

    this.client.on('ready', () => onReady(this));

    if (config.nakiri) {
      this.nakiri = new Nakiri({
        baseUrl: config.nakiri.apiUrl,
        group: config.nakiri.group,
      });

      this.nakiri.on('error', (error) => onNakiriError(this, error));

      this.nakiri.on('ready', () => {
        console.log('Started Nakiri client.');
      });
      this.nakiri.on('reconnect', () => {
        console.log('Reconnected to Nakiri Gateway.');
      });

      this.nakiri.on('analysis', (data) => onNakiriAnalysis(this, data));
    }

    if (config.sentry) {
      Sentry.init({
        dsn: config.sentry.dsn,
      });
    }
  }

  async login() {
    console.log('Updating application commands...');

    await this.rest.put(
      Routes.applicationGuildCommands(
        config.bot.clientId,
        config.guild.guildId,
      ),
      {
        body: commands.map((command) => command.meta.toJSON()),
      },
    );

    commands.forEach((command) => {
      this.commandHandler.on(command.meta.name, command.handler);
      this.commandHandler.setPermissions(
        command.meta.name,
        command.permissions,
      );
    });

    console.log('Application commands updated successfully.');

    console.log('Registering button handlers...');

    buttons.forEach((button) => {
      this.buttonHandler.on(button.meta.id, button.handler);
    });

    console.log('Button handlers registered successfully.');

    console.log('Registering modal handlers...');

    modals.forEach((modal) => {
      this.modalHandler.on(modal.meta.id, modal.handler);
    });

    console.log('Modal handlers registered successfully.');

    await this.client.login(config.bot.token);
    console.log(`senbot started successfully as ${this.client.user?.tag}`);

    if (this.nakiri) {
      console.log('Booting Nakiri client...');

      try {
        await this.nakiri.login(config.nakiri!.apiKey);
      } catch (err) {
        console.error(err);
      }
    }
  }

  public async setPlayingStatus(message: string) {
    this.client.user?.setPresence({
      status: 'online',
      activities: [
        {
          name: message,
          type: 'PLAYING',
        },
      ],
    });
  }

  public async getMessage(
    channelId: string,
    messageId: string,
  ): Promise<Message | undefined> {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) {
      return;
    }

    if (
      ![
        'GUILD_NEWS',
        'GUILD_NEWS_THREAD',
        'GUILD_PRIVATE_THREAD',
        'GUILD_PUBLIC_THREAD',
        'GUILD_TEXT',
      ].includes(channel.type)
    ) {
      return;
    }

    return (channel as TextChannel).messages.fetch(messageId);
  }

  public async getChannelWithId(channelId: string): Promise<AnyChannel | null> {
    return this.client.channels.fetch(channelId);
  }

  public async getGuildMemberWithId(
    userId: string,
  ): Promise<GuildMember | null> {
    const guild = await this.client.guilds.fetch(config.guild.guildId);
    if (!guild) {
      return null;
    }

    try {
      return guild.members.fetch(userId);
    } catch (err) {
      return null;
    }
  }

  public reportToSentry(ex: any) {
    if (!config.sentry) {
      return;
    }

    Sentry.captureException(ex);
  }

  public async getGuildMembersAfter(timestamp: number): Promise<GuildMember[]> {
    const guild = await this.client.guilds.fetch(config.guild.guildId);
    if (!guild) {
      return [];
    }

    const members = await guild.members.fetch();

    return Array.from(
      members
        .filter((member) =>
          member.joinedTimestamp ? member.joinedTimestamp >= timestamp : false,
        )
        .values(),
    );
  }
}

export default Client;
