import { ModalContext } from '../core/handler/ModalHandler';

import * as onboarding from './onboarding/onboarding';
import * as requestDenied from './onboarding/requestDenied';

type ModalHandler = (ctx: ModalContext) => void | Promise<void>;

interface ModalMeta {
  id: string;
}

interface ModalData {
  meta: ModalMeta;
  handler: ModalHandler;
}

const handlers: ModalData[] = [onboarding, requestDenied];

export default handlers;
