import {
  SlashCommandBuilder,
  SlashCommandIntegerOption,
} from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import {
  NakiriHTTPAddDiscordGuildEntryRequest,
  NakiriHTTPAddLinkPatternEntryRequest,
  NakiriHTTPAddPhraseEntryRequest,
  NakiriHTTPAddYouTubeChannelEntryRequest,
  NakiriHTTPAddYouTubeVideoEntryRequest,
  NakiriPostRequestOptions,
  Severity,
} from 'node-nakiri';
import config from '../../config';

import { CommandContext } from '../../core/handler/CommandHandler';

enum EntryTarget {
  GUILD,
  GROUP,
  GLOBAL,
}

const targetOption: SlashCommandIntegerOption = new SlashCommandIntegerOption()
  .setName('target')
  .setDescription('The blacklist to which the entry will be added.')
  .addChoices({ name: 'Guild blacklist', value: EntryTarget.GUILD })
  .addChoices({ name: 'Group blacklist', value: EntryTarget.GROUP })
  .addChoices({ name: 'Global blacklist', value: EntryTarget.GLOBAL });

const severityOption: SlashCommandIntegerOption =
  new SlashCommandIntegerOption()
    .setName('severity')
    .setDescription('Severity of the blacklisted item.')
    .addChoices(
      { name: 'Very low', value: Severity.VERY_HIGH },
      { name: 'Low', value: Severity.LOW },
      { name: 'Medium', value: Severity.MEDIUM },
      { name: 'High', value: Severity.HIGH },
      { name: 'Very high', value: Severity.VERY_HIGH },
    );

export const meta = new SlashCommandBuilder()
  .setName('nakiri')
  .setDescription('Nakiri-specific commands.')
  .setDefaultPermission(false)
  .addSubcommand((subcommand) =>
    subcommand
      .setName('addvideo')
      .setDescription('Add a video ID to the Nakiri blacklist.')
      .addStringOption((option) =>
        option
          .setName('videoid')
          .setDescription('The video ID to add.')
          .setRequired(true),
      )
      .addIntegerOption(targetOption)
      .addIntegerOption(severityOption),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('addchannel')
      .setDescription('Add a channel ID to the Nakiri blacklist.')
      .addStringOption((option) =>
        option
          .setName('channelid')
          .setDescription('The channel ID to add.')
          .setRequired(true),
      )
      .addIntegerOption(targetOption)
      .addIntegerOption(severityOption),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('addlinkpattern')
      .setDescription('Add a link pattern to the Nakiri blacklist.')
      .addStringOption((option) =>
        option
          .setName('pattern')
          .setDescription('The link pattern to add.')
          .setRequired(true),
      )
      .addIntegerOption(targetOption)
      .addIntegerOption(severityOption),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('adddiscord')
      .setDescription('Add a Discord guild ID to the Nakiri blacklist.')
      .addStringOption((option) =>
        option
          .setName('guildid')
          .setDescription('The Discord guild ID to add.')
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('name')
          .setDescription('The name of the guild.')
          .setRequired(true),
      )
      .addIntegerOption(targetOption)
      .addIntegerOption(severityOption),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('addphrase')
      .setDescription('Add a phrase to the Nakiri blacklist.')
      .addStringOption((option) =>
        option
          .setName('phrase')
          .setDescription('The phrase to add.')
          .setRequired(true),
      )
      .addIntegerOption(targetOption)
      .addIntegerOption(severityOption),
  );

export { permissions } from '../../guards/modOnlyCommand';

const getCommonOptions = (ctx: CommandContext<CommandInteraction>) => {
  const target: EntryTarget =
    ctx.interaction.options.getInteger('target') ?? EntryTarget.GUILD;
  const severity: Severity =
    ctx.interaction.options.getInteger('severity') ?? Severity.MEDIUM;

  return {
    global: target === EntryTarget.GLOBAL,
    guild: target === EntryTarget.GUILD ? config.guild.guildId : undefined,
    severity,
  };
};

const videoHandler = async (ctx: CommandContext<CommandInteraction>) => {
  const videoId = ctx.interaction.options.getString('videoid');
  const { global, guild, severity } = getCommonOptions(ctx);

  const req: NakiriHTTPAddYouTubeVideoEntryRequest = {
    videoID: videoId!,
    severity,
  };

  const opts: NakiriPostRequestOptions = {
    global,
    guild,
  };

  try {
    await ctx.client.nakiri!.addYouTubeVideo(req, opts);
    await ctx.interaction.reply('Video added successfully.');
  } catch (err) {
    await ctx.interaction.reply(`Failed to add video: \`${err}\``);
  }
};

const channelHandler = async (ctx: CommandContext<CommandInteraction>) => {
  const channelId = ctx.interaction.options.getString('channelid');
  const { global, guild, severity } = getCommonOptions(ctx);

  const req: NakiriHTTPAddYouTubeChannelEntryRequest = {
    channelID: channelId!,
    severity,
  };

  const opts: NakiriPostRequestOptions = {
    global,
    guild,
  };

  try {
    await ctx.client.nakiri!.addYouTubeChannel(req, opts);
    await ctx.interaction.reply('Channel added successfully.');
  } catch (err) {
    await ctx.interaction.reply(`Failed to add channel: \`${err}\``);
  }
};

const linkPatternHandler = async (ctx: CommandContext<CommandInteraction>) => {
  const linkPattern = ctx.interaction.options.getString('pattern');
  const { global, guild, severity } = getCommonOptions(ctx);

  const req: NakiriHTTPAddLinkPatternEntryRequest = {
    pattern: linkPattern!,
    severity,
  };

  const opts: NakiriPostRequestOptions = {
    global,
    guild,
  };

  try {
    await ctx.client.nakiri!.addLinkPattern(req, opts);
    await ctx.interaction.reply('Link pattern added successfully.');
  } catch (err) {
    await ctx.interaction.reply(`Failed to add link pattern: \`${err}\``);
  }
};

const discordGuildHandler = async (ctx: CommandContext<CommandInteraction>) => {
  const guildId = ctx.interaction.options.getString('guildid');
  const name = ctx.interaction.options.getString('name');

  const { global, guild, severity } = getCommonOptions(ctx);

  const req: NakiriHTTPAddDiscordGuildEntryRequest = {
    id: guildId!,
    name: name ?? guildId!,
    severity,
  };

  const opts: NakiriPostRequestOptions = {
    global,
    guild,
  };

  try {
    await ctx.client.nakiri!.addDiscordGuild(req, opts);
    await ctx.interaction.reply('Discord guild added successfully.');
  } catch (err) {
    await ctx.interaction.reply(`Failed to add Discord guild: \`${err}\``);
  }
};

const phraseHandler = async (ctx: CommandContext<CommandInteraction>) => {
  const phrase = ctx.interaction.options.getString('phrase');
  const { global, guild, severity } = getCommonOptions(ctx);

  const req: NakiriHTTPAddPhraseEntryRequest = {
    content: phrase!,
    severity,
  };

  const opts: NakiriPostRequestOptions = {
    global,
    guild,
  };

  try {
    await ctx.client.nakiri!.addPhrase(req, opts);
    await ctx.interaction.reply('Phrase added successfully.');
  } catch (err) {
    await ctx.interaction.reply(`Failed to add phrase: \`${err}\``);
  }
};

export const handler = async (ctx: CommandContext<CommandInteraction>) => {
  if (!ctx.client.nakiri) {
    await ctx.interaction.reply(
      'Cannot use Nakiri endpoints because Nakiri is not configured.',
    );
    return;
  }

  const subcommand = ctx.interaction.options.getSubcommand();

  switch (subcommand) {
    case 'addvideo':
      await videoHandler(ctx);
      break;
    case 'addchannel':
      await channelHandler(ctx);
      break;
    case 'addlinkpattern':
      await linkPatternHandler(ctx);
      break;
    case 'adddiscord':
      await discordGuildHandler(ctx);
      break;
    case 'addphrase':
      await phraseHandler(ctx);
      break;
    default:
      await ctx.interaction.reply('Unknown subcommand.');
      break;
  }
};
