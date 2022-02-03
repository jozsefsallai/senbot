import { ApplicationCommandPermissionData } from 'discord.js';

import config from '../config';

export const permissions: ApplicationCommandPermissionData[] = [
  config.guild.ownerRole,
  config.guild.adminRole,
  config.guild.moderatorRole,
  config.guild.helperRole,
].map((id) => ({
  id,
  type: 'ROLE',
  permission: true,
}));
