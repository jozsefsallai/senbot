import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import { CommandContext } from '../../core/handler/CommandHandler';

import Minesweeper from 'discord.js-minesweeper';

export const meta = new SlashCommandBuilder()
  .setName('minesweeper')
  .setDescription('Play a game of minesweeper.')
  .addIntegerOption((option) =>
    option
      .setName('rows')
      .setDescription('The number of rows in the grid.')
      .setMinValue(4)
      .setMaxValue(9),
  )
  .addIntegerOption((option) =>
    option
      .setName('columns')
      .setDescription('The number of columns in the grid.')
      .setMinValue(4)
      .setMaxValue(9),
  )
  .addIntegerOption((option) =>
    option
      .setName('mines')
      .setDescription('The number of mines in the grid.')
      .setMinValue(1)
      .setMaxValue(40),
  )
  .addBooleanOption((option) =>
    option
      .setName('plaintext')
      .setDescription('Whether to show the plaintext grid in a code block.'),
  ) as SlashCommandBuilder;

export const handler = async (
  ctx: CommandContext<ChatInputCommandInteraction>,
) => {
  const rows = ctx.interaction.options.getInteger('rows') ?? 9;
  const columns = ctx.interaction.options.getInteger('columns') ?? 9;
  const mines = ctx.interaction.options.getInteger('mines') ?? 10;
  const plaintext = ctx.interaction.options.getBoolean('plaintext') ?? false;

  if (rows * columns <= mines * 2) {
    await ctx.interaction.reply({
      content: 'You have provided too many mines for this field.',
      ephemeral: true,
    });
    return;
  }

  const minesweeper = new Minesweeper({
    rows,
    columns,
    mines,
    returnType: plaintext ? 'code' : 'emoji',
    revealFirstCell: true,
    zeroFirstCell: false,
  });

  try {
    const output = `Rows: \`${rows}\`, columns: \`${columns}\` (cells: \`${
      rows * columns
    }\`), mines: \`${mines}\`\n\n${minesweeper.start()}`;
    await ctx.interaction.reply(output);
  } catch (err) {
    ctx.client.reportToSentry(err);

    await ctx.interaction.reply({
      content: 'Failed to generate minesweeper field.',
      ephemeral: true,
    });
  }
};
