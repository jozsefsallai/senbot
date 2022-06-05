import { ButtonContext } from '../../core/handler/ButtonHandler';
import { generateOnboardingModal } from '../../modals/onboarding/onboarding';

export const meta = {
  id: 'onboarding',
};

export const handler = async (ctx: ButtonContext) => {
  const userId = ctx.interaction.user.id;
  const modal = generateOnboardingModal(userId);
  await ctx.interaction.showModal(modal);
};
