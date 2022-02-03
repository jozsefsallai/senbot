import { ApplicationCommandPermissionData } from 'discord.js';

import config from '../config';
import makeRoleRestrictedCommand from './roleRestrictedCommand';

export const permissions: ApplicationCommandPermissionData[] =
  makeRoleRestrictedCommand([
    config.guild.ownerRole,
    config.guild.adminRole,
    config.guild.moderatorRole,
  ]);
