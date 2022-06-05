import { GuildMember } from 'discord.js';

export const hasAnyRole = (roles: string[], member: GuildMember): boolean => {
  for (const role of roles) {
    if (member.roles.cache.has(role)) {
      return true;
    }
  }

  return false;
};
