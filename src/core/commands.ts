import Client from './client';
import {
  ApplicationCommandPermissionData,
  CommandInteraction,
  ContextMenuInteraction,
} from 'discord.js';

export interface CommandContext<
  T = CommandInteraction | ContextMenuInteraction,
> {
  interaction: T;
  client: Client;
}

export interface CommandHandlers {
  [command: string]: (ctx: CommandContext) => void | Promise<void>;
}

class CommandHandler {
  private handlers: CommandHandlers = {};
  private permissions: Record<string, ApplicationCommandPermissionData[]> = {};

  public on(command: string, handler: (ctx: CommandContext) => void): void {
    this.handlers[command] = handler;
  }

  public off(command: string): void {
    delete this.handlers[command];
  }

  public async emit(command: string, ctx: CommandContext): Promise<void> {
    if (!this.handlers[command]) {
      return;
    }

    await this.handlers[command](ctx);
  }

  public setPermissions(
    command: string,
    permissions?: ApplicationCommandPermissionData[],
  ) {
    if (!permissions) {
      return;
    }

    this.permissions[command] = permissions;
  }

  public getPermissions(
    command: string,
  ): ApplicationCommandPermissionData[] | null {
    if (!this.permissions[command]) {
      return null;
    }

    return this.permissions[command];
  }
}

export default CommandHandler;
