import {
  ApplicationCommandPermissionType,
  ApplicationCommandPermissions,
} from 'discord.js';

const makeRoleRestrictedCommand = (
  roles: string[],
): ApplicationCommandPermissions[] =>
  roles.map((id) => ({
    id,
    type: ApplicationCommandPermissionType.Role,
    permission: true,
  }));

export default makeRoleRestrictedCommand;
