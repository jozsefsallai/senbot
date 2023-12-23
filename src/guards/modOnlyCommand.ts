import { ApplicationCommandPermissions } from 'discord.js';

import config from '../config';
import makeRoleRestrictedCommand from './roleRestrictedCommand';

export const permissions: ApplicationCommandPermissions[] =
  makeRoleRestrictedCommand([
    config.guild.ownerRole,
    config.guild.adminRole,
    config.guild.moderatorRole,
  ]);
