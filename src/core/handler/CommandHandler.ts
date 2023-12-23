import {
  ApplicationCommandPermissions,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
} from 'discord.js';
import BaseHandler from './BaseHandler';
import { HandlerContext } from './IBaseHandler';

export type CommandContext<
  T = ChatInputCommandInteraction | ContextMenuCommandInteraction,
> = HandlerContext<T>;

class CommandHandler extends BaseHandler<
  ChatInputCommandInteraction | ContextMenuCommandInteraction
> {
  private permissions: Record<string, ApplicationCommandPermissions[]> = {};

  public setPermissions(
    command: string,
    permissions?: ApplicationCommandPermissions[],
  ) {
    if (!permissions) {
      return;
    }

    this.permissions[command] = permissions;
  }

  public getPermissions(
    command: string,
  ): ApplicationCommandPermissions[] | null {
    if (!this.permissions[command]) {
      return null;
    }

    return this.permissions[command];
  }
}

export default CommandHandler;
