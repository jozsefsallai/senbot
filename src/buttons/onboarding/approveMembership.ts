import { GuildMember, MessageEmbed } from 'discord.js';

import config from '../../config';
import { EMBED_GREEN } from '../../core/constants';
import { ButtonContext } from '../../core/handler/ButtonHandler';
import { STAFF_ONLY_ROLES } from '../../guards/staffOnlyCommand';
import { editOnboardingEntry } from '../../utils/editOnboardingEntry';
import { hasAnyRole } from '../../utils/hasAnyRole';

export const meta = {
  id: 'approve-membership',
};

export const handler = async (ctx: ButtonContext) => {
  await ctx.interaction.deferReply();

  if (typeof ctx.uniqueId === 'undefined') {
    await ctx.interaction.editReply('User ID is missing from request.');
    return;
  }

  if (!hasAnyRole(STAFF_ONLY_ROLES, ctx.interaction.member as GuildMember)) {
    await ctx.interaction.editReply('You do not have permission to do that.');
    return;
  }

  const userId = ctx.uniqueId;

  try {
    await editOnboardingEntry(ctx.client, ctx.interaction.message.id);
  } catch (err) {
    // ignore
  }

  const member = await ctx.client.getGuildMemberWithId(userId);
  if (!member) {
    await ctx.interaction.editReply(
      'User not found. They might have left the server already.',
    );
    return;
  }

  try {
    await member.roles.add(config.guild.membersRole);

    const embed = new MessageEmbed();
    embed.setTitle('✅ User approved successfully.');
    embed.setDescription(
      `User ${member.toString()} has been approved by ${ctx.interaction.user.toString()}.`,
    );
    embed.setColor(EMBED_GREEN);

    await ctx.interaction.editReply({ embeds: [embed] });
  } catch (err) {
    await ctx.interaction.editReply(
      `Failed to update member:\n\`\`\`\n${err}\n\`\`\``,
    );
  }

  try {
    const dm = await member.createDM();

    const embed = new MessageEmbed();
    embed.setTitle('✅ Membership approved!');
    embed.setColor(EMBED_GREEN);

    embed.setDescription(
      'Good news! Your request to join the **Senzawa Fan Discord** has been approved by a moderator. Have a great time!',
    );

    await dm.send({ embeds: [embed] });
  } catch (err) {
    // ignore
  }
};
