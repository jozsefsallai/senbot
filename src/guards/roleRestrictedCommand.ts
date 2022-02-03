import { ApplicationCommandPermissionData } from 'discord.js';

const makeRoleRestrictedCommand = (
  roles: string[],
): ApplicationCommandPermissionData[] =>
  roles.map((id) => ({
    id,
    type: 'ROLE',
    permission: true,
  }));

export default makeRoleRestrictedCommand;
