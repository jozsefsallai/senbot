import { ModalSubmitInteraction } from 'discord.js';
import BaseHandler from './BaseHandler';
import { HandlerContext } from './IBaseHandler';

export type ModalContext = HandlerContext<ModalSubmitInteraction>;

class ModalHandler extends BaseHandler<ModalSubmitInteraction> {}

export default ModalHandler;
