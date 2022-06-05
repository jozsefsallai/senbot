import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types/v10';

export const meta = new ContextMenuCommandBuilder()
  .setName('Purge From Here')
  .setType(ApplicationCommandType.Message)
  .setDefaultPermission(false);

export { permissions, handler } from './purgefrom';
