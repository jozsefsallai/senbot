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

import * as nakiri from './admin/nakiri';

import * as minesweeper from './fun/minesweeper';

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

  nakiri,

  minesweeper,
];

export default commands;
