//functions to interact with learning analytics main function defined as generics for scalability to different usage
import { AnalyticsActionBody } from '../types/polyglotElements';
import { API } from './api';

export function registerAnalyticsAction<T extends AnalyticsActionBody>(
  actionRegistred: T
): void {
  if ('actionType' in actionRegistred) {
    switch (actionRegistred.actionType) {
      case 'remove_LP_selection':

      case 'open_LP_info':
      case 'close_LP_info':
      case 'select_LP':
      case 'open_tool':
      case 'close_tool':
        if (!('flowId' in actionRegistred.action)) {
          throw new Error('Invalid structure, missing flowId');
        }
        break;
      case 'open_node':
      case 'close_node':
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
