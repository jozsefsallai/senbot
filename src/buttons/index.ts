import { ButtonContext } from '../core/handler/ButtonHandler';

import * as onboarding from './onboarding/onboarding';
import * as approveMembership from './onboarding/approveMembership';
import * as rejectMembership from './onboarding/rejectMembership';
import * as processingMembership from './onboarding/processingMembership';

type ButtonHandler = (ctx: ButtonContext) => void | Promise<void>;

interface ButtonMeta {
  id: string;
}

interface ButtonData {
  meta: ButtonMeta;
  handler: ButtonHandler;
}

const handlers: ButtonData[] = [
  onboarding,
  approveMembership,
  rejectMembership,
  processingMembership,
];

export default handlers;
