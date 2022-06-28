import { ApplicationCommandPermissionData } from 'discord.js';
import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ContextMenuCommandBuilder,
} from '@discordjs/builders';
import { CommandContext } from '../core/handler/CommandHandler';

import * as ping from './ping';

import * as kicksince from './admin/kicksince';
import * as purge from './admin/purge';
import * as purgefrom from './admin/purgefrom';
import * as purgefromContext from './admin/purgefromContext';
import * as purgebetween from './admin/purgebetween';
import * as activity from './admin/activity';
import * as onboardingmessage from './admin/onboardingMessage';

import * as nakiri from './admin/nakiri';

import * as minesweeper from './fun/minesweeper';
import * as inspire from './fun/inspire';

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

  kicksince,
  purge,
  purgefrom,
  purgefromContext,
  purgebetween,
  activity,
  onboardingmessage,

  nakiri,

  minesweeper,
  inspire,
];

export default commands;
