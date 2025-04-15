//functions to interact with learning analytics main function defined as generics for scalability to different usage
import { AnalyticsActionBody } from '../types/polyglotElements';
import { API } from './api';

export async function registerAnalyticsAction<T extends AnalyticsActionBody>(
  actionRegistred: T
): Promise<void> {
  if ('actionType' in actionRegistred) {
    switch (actionRegistred.actionType) {
      case 'remove_LP_selection':

      case 'open_LP_info':
      case 'close_LP_info':
      case 'select_LP':
      case 'open_tool':
      case 'close_tool':
        if (!('flowId' in actionRegistred.action)) {
          console.log('Invalid structure, missing flowId');
          return;
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
          console.log('Invalid OpenCloseToolAction structure');
          return;
        }
        break;
      default:
        console.log(`Unknown actionType: ${actionRegistred.actionType}`);
        return;
    }
  }
try {  
  await API.registerAction(actionRegistred);
} catch (error) {
  console.log(error)
}
}
