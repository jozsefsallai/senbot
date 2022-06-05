import { ApplicationCommandPermissionData } from 'discord.js';

import config from '../config';
import makeRoleRestrictedCommand from './roleRestrictedCommand';

export const STAFF_ONLY_ROLES = [
  config.guild.ownerRole,
  config.guild.adminRole,
  config.guild.moderatorRole,
  config.guild.helperRole,
];

export const permissions: ApplicationCommandPermissionData[] =
  makeRoleRestrictedCommand(STAFF_ONLY_ROLES);
