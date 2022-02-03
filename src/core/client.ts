import config from '../config';

import { Client as Discord, Intents, Message, TextChannel } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { Client as Nakiri } from 'node-nakiri';

import CommandHandler from './commands';
import commands from '../commands';
import Logger from '../logger/Logger';

import onMessageUpdate from '../events/messageUpdate';
import onMessageDelete from '../events/messageDelete';
import onGuildMemberUpdate from '../events/guildMemberUpdate';
import onMessage from '../events/message';
import onReady from '../events/ready';

import onNakiriAnalysis from '../events/nakiri/analysis';
import onNakiriError from '../events/nakiri/error';

class Client {
  private client: Discord;
  private rest: REST;
  private commandHandler: CommandHandler;

  public nakiri?: Nakiri;

  public logger?: Logger;

  constructor() {
    this.client = new Discord({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
      ],
    });

    this.logger = new Logger(this.client);

    this.rest = new REST({
      version: '9',
    });

    this.rest.setToken(config.bot.token);

    this.commandHandler = new CommandHandler();

    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand() && !interaction.isContextMenu()) {
        return;
      }

      await this.commandHandler.emit(interaction.commandName, {
        interaction,
        client: this,
      });
    });

    this.client.on('messageUpdate', (before, after) =>
      onMessageUpdate(this, before, after),
    );

    this.client.on('messageDelete', (message) =>
      onMessageDelete(this, message),
    );

    this.client.on('guildMemberUpdate', (before, after) =>
      onGuildMemberUpdate(this, before, after),
    );

    this.client.on('guildMemberAdd', async (member) => {
      await this.logger?.logJoinOrLeave('join', member);
    });

    this.client.on('guildMemberRemove', async (member) => {
      await this.logger?.logJoinOrLeave('leave', member);
    });

    this.client.on('messageCreate', (message) => onMessage(this, message));

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

      this.nakiri.on('analysis', (data) => onNakiriAnalysis(this, data));
    }
  }

  async login() {
    try {
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
    } catch (err) {
      console.error(err);
    }

    await this.client.login(config.bot.token);
    console.log(`senbot started successfully as ${this.client.user?.tag}`);

    console.log('Updating application command permissions...');

    try {
      await this.updateApplicationCommandPermissions();
      console.log('Application command permissions updated successfully.');
    } catch (err) {
      console.error(err);
    }

    if (this.nakiri) {
      console.log('Booting Nakiri client...');

      try {
        await this.nakiri.login(config.nakiri!.apiKey);
      } catch (err) {
        console.error(err);
      }
    }
  }

  private async updateApplicationCommandPermissions() {
    const registeredCommands = await this.client.guilds.cache
      .get(config.guild.guildId)
      ?.commands.fetch();

    for await (const command of registeredCommands!.values()) {
      const permissions = this.commandHandler.getPermissions(command.name);
      if (!permissions) {
        continue;
      }

      await command.permissions.set({ permissions });
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
}

export default Client;
