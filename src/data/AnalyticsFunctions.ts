//functions to interact with learning analytics main function defined as generics for scalability to different usage
import { AnalyticsActionBody } from '../types/polyglotElements';
import { API } from './api';

export function registerAnalyticsAction<T extends AnalyticsActionBody>(
  actionRegistred: T
): void {
  if ('actionType' in actionRegistred) {
    switch (actionRegistred.actionType) {
      case 'removeLPSelectionAction':
      case 'openLPInfoAction':
      case 'selectLPAction':
      case 'openLPInfoAction':
        if (!('flowId' in actionRegistred.action)) {
          throw new Error('Invalid structure, missing flowId');
        }
        break;
      case 'closeToolAction':
      case 'openToolAction':
        if (
          !(
            'flowId' in actionRegistred.action &&
            'nodeId' in actionRegistred.action &&
            'activity' in actionRegistred.action
          )
        ) {
          throw new Error('Invalid OpenCloseToolAction structure');
        }
        break;
      default:
        throw new Error(`Unknown actionType: ${actionRegistred.actionType}`);
    }
  }

  API.registerAction(actionRegistred);
}
