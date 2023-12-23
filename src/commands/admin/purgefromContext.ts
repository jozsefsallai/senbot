import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';

export const meta = new ContextMenuCommandBuilder()
  .setName('Purge From Here')
  .setType(ApplicationCommandType.Message)
  .setDefaultPermission(false);

export { permissions, handler } from './purgefrom';
