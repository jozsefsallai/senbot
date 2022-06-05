import { GuildMember } from 'discord.js';
import { ButtonContext } from '../../core/handler/ButtonHandler';
import { STAFF_ONLY_ROLES } from '../../guards/staffOnlyCommand';
import { generateOnboardingRequestDeniedModal } from '../../modals/onboarding/requestDenied';
import { hasAnyRole } from '../../utils/hasAnyRole';

export const meta = {
  id: 'reject-membership',
};

export const handler = async (ctx: ButtonContext) => {
  if (!ctx.uniqueId) {
    await ctx.interaction.reply('Missing user ID from request.');
  }

  if (!hasAnyRole(STAFF_ONLY_ROLES, ctx.interaction.member as GuildMember)) {
    await ctx.interaction.editReply('You do not have permission to do that.');
    return;
  }

  const modal = generateOnboardingRequestDeniedModal(ctx.uniqueId!);
  await ctx.interaction.showModal(modal);
};
