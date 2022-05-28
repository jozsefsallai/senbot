import { ApplicationCommandPermissionData } from 'discord.js';
import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ContextMenuCommandBuilder,
} from '@discordjs/builders';
import { CommandContext } from '../core/commands';

import * as ping from './ping';

import * as purge from './admin/purge';
import * as purgefrom from './admin/purgefrom';
import * as purgefromContext from './admin/purgefromContext';
import * as purgebetween from './admin/purgebetween';
import * as activity from './admin/activity';

import * as nakiri from './admin/nakiri';

import * as minesweeper from './fun/minesweeper';

// import * as play from './music/play';
// import * as pause from './music/pause';
// import * as resume from './music/resume';
// import * as queue from './music/queue';
// import * as voteskip from './music/voteskip';
// import * as votestop from './music/votestop';
// import * as skip from './music/skip';
// import * as stop from './music/stop';
// import * as repeat from './music/repeat';
// import * as volume from './music/volume';

interface CommandData {
  meta:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | ContextMenuCommandBuilder;
  handler: (ctx: CommandContext<any>) => void | Promise<void>;
  permissions?: ApplicationCommandPermissionData[];
}

const commands: CommandData[] = [
  ping,

  purge,
  purgefrom,
  purgefromContext,
  purgebetween,
  activity,

  nakiri,

  minesweeper,

  // play,
  // pause,
  // resume,
  // queue,
  // voteskip,
  // votestop,
  // skip,
  // stop,
  // repeat,
  // volume,
];

export default commands;
